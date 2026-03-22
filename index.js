// index.js - v8 - Security, rate limiting, retry, caching, input sanitization

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 10000;

if (!process.env.OPENAI_API_KEY) {
  console.error("ERRO FATAL: A variável de ambiente OPENAI_API_KEY não está definida.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistants = {
  clinica: 'asst_qitIwbREUyPY1GRIYH7vYQx0',
  triagem: 'asst_AMRI91iC8Efv90P41K3PVATV',
  primeiros_socorros: 'asst_NU2rjoLUZiECJ711IE1pXotZ',
};

// --- CORS ---
const allowedOrigins = [
  'https://telesaudemissionaria.github.io',
  'https://missioncareplus-jca0.onrender.com',
  'https://missioncare-plus-backend.onrender.com',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc) in dev
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    callback(new Error('Origem não permitida pelo CORS'));
  },
}));

app.use(express.json({ limit: '10kb' }));

// --- RATE LIMITING ---
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 requests por IP por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Aguarde um momento antes de tentar novamente.' },
});

// --- INPUT SANITIZATION ---
function sanitizeInput(text, maxLength = 1000) {
  if (typeof text !== 'string') return '';
  return text
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim();
}

function sanitizeTriagePayload(body) {
  const sanitized = {};
  const fields = ['problemaPrincipal', 'inicioSintomas', 'melhoraPiora', 'doencasCronicas', 'medicamentos', 'alergias'];
  for (const field of fields) {
    sanitized[field] = sanitizeInput(body[field] || '', 500);
  }
  return sanitized;
}

function sanitizePediatricPayload(body) {
  const sanitized = {};
  const textFields = ['idade', 'queixaPrincipal', 'historiaDoenca', 'estadoGeral', 'nivelConsciencia', 'observacoesAdicionais'];
  for (const field of textFields) {
    sanitized[field] = sanitizeInput(body[field] || '', 500);
  }
  // Numeric fields - parse and validate
  const numericFields = ['temperatura', 'frequenciaCardiaca', 'frequenciaRespiratoria', 'saturacaoO2'];
  for (const field of numericFields) {
    const val = parseFloat(body[field]);
    sanitized[field] = (!isNaN(val) && val >= 0 && val <= 500) ? String(val) : '';
  }
  return sanitized;
}

// --- RESPONSE CACHE (in-memory, TTL-based) ---
const responseCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const MAX_CACHE_SIZE = 100;

function getCacheKey(prefix, data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  // Simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `${prefix}:${hash}`;
}

function getFromCache(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  // Evict oldest if cache is full
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
}

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v8 está no ar. Endpoints: /analise-triagem, /analise-triagem-adulto, /api/v1/assistente');
});

// Endpoint de Emergências
app.post('/api/v1/assistente', apiLimiter, async (req, res) => {
  const prompt = sanitizeInput(req.body.prompt, 2000);

  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  const cacheKey = getCacheKey('emergency', prompt);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ response: cached });
  }

  try {
    const responseText = await getOpenAIResponseWithRetry(assistants.primeiros_socorros, prompt);
    setCache(cacheKey, responseText);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Erro no endpoint /api/v1/assistente:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint de Triagem Pediátrica
app.post('/analise-triagem', apiLimiter, async (req, res) => {
  const dados = sanitizePediatricPayload(req.body);
  const promptParaAnalise = createPediatricPrompt(dados);
  await processarAnaliseJSON(res, assistants.triagem, promptParaAnalise);
});

// Endpoint de Triagem Adulto
app.post('/analise-triagem-adulto', apiLimiter, async (req, res) => {
  const dadosAdulto = sanitizeTriagePayload(req.body);

  if (!dadosAdulto.problemaPrincipal) {
    return res.status(400).json({ error: 'Dados de triagem insuficientes. O problema principal é obrigatório.' });
  }

  const promptParaAnalise = `
    # DADOS DO PACIENTE PARA ANÁLISE IMEDIATA
    - Queixa Principal: ${dadosAdulto.problemaPrincipal || 'Não informado'}
    - Início dos Sintomas: ${dadosAdulto.inicioSintomas || 'Não informado'}
    - Fatores de Melhora/Piora: ${dadosAdulto.melhoraPiora || 'Não informado'}
    - Doenças Crônicas: ${dadosAdulto.doencasCronicas || 'Não informado'}
    - Medicamentos em Uso: ${dadosAdulto.medicamentos || 'Não informado'}
    - Alergias: ${dadosAdulto.alergias || 'Não informado'}

    # INSTRUÇÃO FINAL
    Com base nos dados acima, aplique as regras do seu guia de campo (Dr. IA - v2025). Determine o modo de resposta (EMERGÊNCIA, ATENÇÃO ou CUIDADO) e forneça a orientação correspondente. Sua resposta deve ser apenas o texto de orientação, limpo, sem formatação JSON.
  `;

  try {
    const responseText = await getOpenAIResponseWithRetry(assistants.clinica, promptParaAnalise);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Erro no endpoint /analise-triagem-adulto:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GOB unificado (antes estava em backend separado)
app.post('/api/assistants/run/gob', apiLimiter, async (req, res) => {
  const message = sanitizeInput(req.body.message, 3000);

  if (!message) {
    return res.status(400).json({ ok: false, error: 'O campo "message" é obrigatório.' });
  }

  try {
    const responseText = await getOpenAIResponseWithRetry(assistants.clinica, message);
    res.json({ ok: true, text: responseText });
  } catch (error) {
    console.error("Erro no endpoint /api/assistants/run/gob:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// --- HELPER FUNCTIONS ---

async function getOpenAIResponseWithRetry(assistantId, prompt, maxRetries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await getOpenAIResponse(assistantId, prompt);
    } catch (error) {
      lastError = error;
      console.warn(`Tentativa ${attempt + 1} falhou: ${error.message}`);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

async function getOpenAIResponse(assistantId, prompt) {
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: prompt,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  const runStatus = await waitForRunCompletion(thread.id, run.id);

  if (runStatus === 'completed') {
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find(m => m.run_id === run.id && m.role === 'assistant');
    if (lastMessage && lastMessage.content[0].type === 'text') {
      return lastMessage.content[0].text.value;
    }
    throw new Error('Nenhuma resposta de texto coerente do assistente.');
  } else {
    throw new Error(`A análise não pôde ser concluída. Status: ${runStatus}`);
  }
}

async function processarAnaliseJSON(res, assistantId, prompt) {
  try {
    const rawResponse = await getOpenAIResponseWithRetry(assistantId, prompt);

    // Improved JSON extraction: try multiple strategies
    let parsedJson = null;

    // Strategy 1: markdown code block
    const codeBlockMatch = rawResponse.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (codeBlockMatch) {
      try { parsedJson = JSON.parse(codeBlockMatch[1].trim()); } catch {}
    }

    // Strategy 2: find outermost JSON object
    if (!parsedJson) {
      const firstBrace = rawResponse.indexOf('{');
      const lastBrace = rawResponse.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try { parsedJson = JSON.parse(rawResponse.slice(firstBrace, lastBrace + 1)); } catch {}
      }
    }

    // Strategy 3: try the entire response as JSON
    if (!parsedJson) {
      try { parsedJson = JSON.parse(rawResponse.trim()); } catch {}
    }

    if (!parsedJson) {
      throw new Error("Nenhum JSON válido encontrado na resposta da IA.");
    }

    res.json(parsedJson);
  } catch (error) {
    console.error('Erro ao processar resposta JSON:', error);
    res.status(500).json({ error: error.message });
  }
}

async function waitForRunCompletion(threadId, runId) {
  const startTime = Date.now();
  const TIMEOUT = 45000; // 45 seconds (increased from 35s)
  while (Date.now() - startTime < TIMEOUT) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
      return run.status;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  return 'timed_out';
}

function createPediatricPrompt(dados) {
  return `
    # CONTEXTO
    Você é um assistente de IA especialista em triagem pediátrica para um aplicativo de telessaúde. Sua função é analisar dados preliminares de uma criança e fornecer uma avaliação de risco estruturada em JSON, focada em identificar sinais de gravidade e orientar os próximos passos.
    # DADOS DA CRIANÇA
    - Idade: ${dados.idade || 'Não informado'}
    - Queixa Principal: ${dados.queixaPrincipal || 'Não informado'}
    - História da Doença: ${dados.historiaDoenca || 'Não informado'}
    - Sinais Vitais: ${dados.temperatura || ''} ${dados.frequenciaCardiaca || ''} ${dados.frequenciaRespiratoria || ''}
    - Estado Geral: ${dados.estadoGeral || 'Não informado'}
    - Nível de Consciência: ${dados.nivelConsciencia || 'Não informado'}
    - Observações Adicionais: ${dados.observacoesAdicionais || 'Nenhuma'}
    # ESTRUTURA JSON DE SAÍDA OBRIGATÓRIA
    Responda SOMENTE com o JSON abaixo, sem texto adicional:
    {
      "sinais_de_gravidade": ["Lista de achados preocupantes diretos"],
      "conduta_recomendada": {
        "urgencia": true | false,
        "justificativa": "Explicação concisa",
        "orientacoes": ["Lista de ações claras"]
      },
      "sinais_de_piora": ["Lista de sinais que indicam piora"]
    }
  `;
}

app.listen(port, () => {
  console.log(`Servidor MissionCare+ v8 rodando em http://localhost:${port}`);
});
