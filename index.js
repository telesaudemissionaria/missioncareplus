// index.js — v8 — CORS seguro + rate limit + thread cleanup + dotenv
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';

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
  clinica:           'asst_qitIwbREUyPY1GRIYH7vYQx0',
  triagem:           'asst_AMRI91iC8Efv90P41K3PVATV',
  primeiros_socorros:'asst_NU2rjoLUZiECJ711IE1pXotZ',
};

// FIX 1 — CORS restrito aos domínios do projeto
const allowedOrigins = [
  'https://missioncareplus-jca0.onrender.com',
  'https://telesaudemissionaria.github.io',
  'http://localhost:8000',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: Postman, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  }
}));

app.use(express.json());

// FIX 2 — Rate limiting: máx 10 requests por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Aguarde 1 minuto e tente novamente.' },
});
app.use('/analise-triagem', limiter);
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v8 está no ar. Endpoints: /analise-triagem, /analise-triagem-adulto, /api/v1/assistente');
});

// --- ENDPOINT DE EMERGÊNCIAS ---
app.post('/api/v1/assistente', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }
  try {
    const responseText = await getOpenAIResponse(assistants.primeiros_socorros, prompt);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Erro no endpoint /api/v1/assistente:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- TRIAGEM PEDIÁTRICA ---
app.post('/analise-triagem', async (req, res) => {
  const promptParaAnalise = createPediatricPrompt(req.body);
  await processarAnaliseJSON(res, assistants.triagem, promptParaAnalise);
});

// --- TRIAGEM ADULTO ---
app.post('/analise-triagem-adulto', async (req, res) => {
  const dadosAdulto = req.body;

  if (!dadosAdulto || !dadosAdulto.problemaPrincipal) {
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
    const responseText = await getOpenAIResponse(assistants.clinica, promptParaAnalise);
    res.json({ response: responseText });
  } catch (error) {
    console.error("Erro no endpoint /analise-triagem-adulto:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- FUNÇÕES HELPER ---

async function getOpenAIResponse(assistantId, prompt) {
  const thread = await openai.beta.threads.create();
  try {
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
  } finally {
    // FIX 3 — Thread cleanup: evita acúmulo de threads na conta OpenAI
    try {
      await openai.beta.threads.del(thread.id);
    } catch (cleanupErr) {
      console.warn('Aviso: não foi possível deletar o thread:', cleanupErr.message);
    }
  }
}

async function processarAnaliseJSON(res, assistantId, prompt) {
  try {
    const rawResponse = await getOpenAIResponse(assistantId, prompt);
    const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
    if (!jsonMatch) throw new Error("Nenhum JSON válido encontrado na resposta da IA.");
    const extractedJson = jsonMatch[1] || jsonMatch[2];
    const parsedJson = JSON.parse(extractedJson);
    res.json(parsedJson);
  } catch (error) {
    console.error('Erro ao processar resposta JSON:', error);
    res.status(500).json({ error: error.message });
  }
}

async function waitForRunCompletion(threadId, runId) {
  const startTime = Date.now();
  while (Date.now() - startTime < 35000) {
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
    {
      "sinais_de_gravidade": ["Lista de achados preocupantes diretos."],
      "conduta_recomendada": {
        "urgencia": true | false,
        "justificativa": "Explicação concisa.",
        "orientacoes": ["Lista de ações claras e diretas para o cuidador."]
      },
      "sinais_de_piora": ["Lista de sinais específicos que indicariam piora do quadro."]
    }
  `;
}

app.listen(port, () => {
  console.log(`Servidor MissionCare+ v8 rodando em http://localhost:${port}`);
});
