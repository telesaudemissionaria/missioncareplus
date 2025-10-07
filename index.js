// index.js - v2

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 10000;

// Valida a presença da chave da API na inicialização
if (!process.env.OPENAI_API_KEY) {
  console.error("ERRO FATAL: A variável de ambiente OPENAI_API_KEY não está definida.");
  process.exit(1); // Encerra o processo se a chave não estiver configurada
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IDs dos assistentes da OpenAI
const assistants = {
  clinica: 'asst_qitIwbREUyPY1GRIYH7vYQx0', // Assistente legado para anamnese clínica
  triagem: 'asst_AMRI91iC8Efv90P41K3PVATV', // Assistente especialista para triagem pediátrica
  gob: 'asst_AMRI91iC8Efv90P41K3PVATV',     // Assistente de Ginecologia e Obstetrícia (usando o mesmo ID)
};

app.use(cors());
app.use(express.json());

// Rota de diagnóstico para verificar se o servidor está online
app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v2 está no ar. Endpoints ativos: /api/v1/assistente, /analise-triagem');
});

// Endpoint genérico para assistentes de chat (GOB, Clínica, etc.)
app.post('/api/v1/assistente', async (req, res) => {
  const { tipo_assistente, prompt } = req.body;
  const assistantId = assistants[tipo_assistente];

  if (!assistantId) {
    return res.status(400).json({ error: `Tipo de assistente inválido: '${tipo_assistente}'. Válidos: ${Object.keys(assistants).join(', ')}` });
  }

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // Espera a conclusão da execução
    let runStatus = await waitForRunCompletion(thread.id, run.id);

    if (runStatus === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find(
        (message) => message.run_id === run.id && message.role === 'assistant'
      );

      if (lastMessage && lastMessage.content[0].type === 'text') {
        const textContent = lastMessage.content[0].text.value;
        res.json({ response: textContent });
      } else {
        res.status(500).json({ error: 'Nenhuma resposta de texto do assistente.' });
      }
    } else {
      console.error(`O status da execução é: ${runStatus}`);
      res.status(500).json({ error: `Falha na execução do assistente. Status: ${runStatus}` });
    }
  } catch (error) {
    console.error('Erro no endpoint /api/v1/assistente:', error);
    res.status(500).json({ error: 'Falha grave ao se comunicar com o assistente.' });
  }
});

// Endpoint específico para a Análise da Triagem Pediátrica
app.post('/analise-triagem', async (req, res) => {
  const assistantId = assistants.triagem; 
  const dadosTriagem = req.body;

  // Validação mínima dos dados recebidos
  if (!dadosTriagem || !dadosTriagem.idade || !dadosTriagem.queixaPrincipal) {
      return res.status(400).json({ error: 'Dados de triagem insuficientes. Idade e queixa principal são obrigatórios.' });
  }

  const promptParaAnalise = `
    Analisar os seguintes dados de triagem pediátrica e retornar um JSON:
    - Idade: ${dadosTriagem.idade}
    - Queixa Principal: ${dadosTriagem.queixaPrincipal}
    - História da Doença: ${dadosTriagem.historiaDoenca}
    - Frequência Cardíaca: ${dadosTriagem.frequenciaCardiaca} bpm
    - Frequência Respiratória: ${dadosTriagem.frequenciaRespiratoria} irpm
    - Temperatura: ${dadosTriagem.temperatura} °C
    - Saturação de O₂: ${dadosTriagem.saturacaoO2} %
    - Estado Geral: ${dadosTriagem.estadoGeral}
    - Nível de Consciência: ${dadosTriagem.nivelConsciencia}
    - Hidratação (Mucosas): ${dadosTriagem.hidratacao}
    - Perfusão: ${dadosTriagem.perfusao}
    - Padrão Respiratório: ${dadosTriagem.padraoRespiratorio}
    - Pele e Anexos: ${dadosTriagem.peleAnexos}
    - Observações Adicionais: ${dadosTriagem.observacoesAdicionais || 'Nenhuma'}
  `;

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: promptParaAnalise,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await waitForRunCompletion(thread.id, run.id);

    if (runStatus === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find(
        (message) => message.run_id === run.id && message.role === 'assistant'
      );

      if (lastMessage && lastMessage.content[0].type === 'text') {
        const jsonResponse = lastMessage.content[0].text.value;
        // Tenta fazer o parse do JSON para garantir que é válido antes de enviar
        try {
          const parsedJson = JSON.parse(jsonResponse);
          res.json(parsedJson);
        } catch (jsonError) {
          console.error('Erro ao fazer parse do JSON da OpenAI:', jsonError, 'String recebida:', jsonResponse);
          res.status(500).json({ error: 'A resposta do assistente não é um JSON válido.' });
        }
      } else {
        res.status(500).json({ error: 'Nenhuma resposta de texto do assistente de triagem.' });
      }
    } else {
      console.error(`O status da execução da triagem é: ${runStatus}`);
      res.status(500).json({ error: `Falha na execução do assistente de triagem. Status: ${runStatus}` });
    }
  } catch (error) {
    console.error('Erro grave na rota /analise-triagem:', error);
    res.status(500).json({ error: 'Falha grave ao se comunicar com o assistente de triagem.' });
  }
});

// Função auxiliar para aguardar a conclusão de uma execução (Run)
async function waitForRunCompletion(threadId, runId) {
    let run;
    const startTime = Date.now();
    const timeout = 30000; // 30 segundos de timeout

    while (Date.now() - startTime < timeout) {
        run = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
            return run.status;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
    }
    return 'timed_out'; // Retorna 'timed_out' se o tempo de espera for excedido
}


app.listen(port, () => {
  console.log(`Servidor MissionCare+ v2 rodando em http://localhost:${port}`);
  console.log('Endpoints disponíveis: GET /, POST /api/v1/assistente, POST /analise-triagem');
});
