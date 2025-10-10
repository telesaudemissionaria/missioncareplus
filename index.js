// index.js - v7 - Added Emergency Assistant Endpoint & Adult Triage Prompt v2025

import express from 'express';
import cors from 'cors';
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
  clinica: 'asst_qitIwbREUyPY1GRIYH7vYQx0',       // Assistente de clínica geral para adultos (será atualizado)
  triagem: 'asst_AMRI91iC8Efv90P41K3PVATV',       // Assistente de pediatria
  primeiros_socorros: 'asst_NU2rjoLUZiECJ711IE1pXotZ', // <-- NOVO: Assistente de emergências
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v7 está no ar. Endpoints: /analise-triagem, /analise-triagem-adulto, /api/v1/assistente');
});

// --- ENDPOINT DE EMERGÊNCIAS (CORREÇÃO) ---
app.post('/api/v1/assistente', async (req, res) => {
  const { prompt } = req.body;
  const assistantId = assistants.primeiros_socorros;

  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  try {
    const responseText = await getOpenAIResponse(assistantId, prompt);
    res.json({ response: responseText }); // Envia no formato que o frontend espera
  } catch (error) {
    console.error("Erro no endpoint /api/v1/assistente:", error);
    res.status(500).json({ error: error.message });
  }
});


// --- ENDPOINTS DE TRIAGEM ---

// Endpoint para a Triagem Pediátrica (mantido como está por enquanto)
app.post('/analise-triagem', async (req, res) => {
    const assistantId = assistants.triagem;
    const promptParaAnalise = createPediatricPrompt(req.body);
    await processarAnaliseJSON(res, assistantId, promptParaAnalise);
});

// Endpoint para a Triagem de Adulto (ATUALIZADO com seu prompt v2025)
app.post('/analise-triagem-adulto', async (req, res) => {
  const assistantId = assistants.clinica; // Este assistente usará o prompt abaixo
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
    const responseText = await getOpenAIResponse(assistantId, promptParaAnalise);
    // Como a resposta agora é texto puro, precisamos envolvê-la em um JSON para o frontend
    res.json({ response: responseText }); 
  } catch (error) {
    console.error("Erro no endpoint /analise-triagem-adulto:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- FUNÇÕES HELPER ---

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
      "sinais_de_gravidade": ["Lista de achados preocupantes diretos. Ex: 'Febre alta persistente', 'Tiragem subcostal', 'Letargia'"],
      "conduta_recomendada": {
        "urgencia": true | false,
        "justificativa": "Explicação concisa do porquê a urgência foi classificada como tal, baseada nos sinais de gravidade.",
        "orientacoes": ["Lista de ações claras e diretas para o cuidador. Ex: 'Procure atendimento médico de emergência imediatamente', 'Monitore a frequência respiratória', 'Ofereça líquidos com frequência'"]
      },
      "sinais_de_piora": ["Lista de sinais específicos que o cuidador deve observar que indicariam piora do quadro. Ex: 'Aumento do esforço para respirar', 'Aparecimento de manchas roxas na pele', 'Recusa total de líquidos'"]
    }
  `;
}

app.listen(port, () => {
  console.log(`Servidor MissionCare+ v7 rodando em http://localhost:${port}`);
});
