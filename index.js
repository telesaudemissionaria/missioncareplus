// index.js - v4 - Improved Prompt Engineering

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
  clinica: 'asst_qitIwbREUyPY1GRIYH7vYQx0',
  triagem: 'asst_AMRI91iC8Efv90P41K3PVATV', // ID do assistente de pediatria
  gob: 'asst_AMRI91iC8Efv90P41K3PVATV', 
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v4 está no ar. Endpoints ativos: /api/v1/assistente, /analise-triagem');
});

// Endpoint legado
app.post('/api/v1/assistente', async (req, res) => {
    // ... (código do endpoint legado mantido, mas não é o foco)
});

// Endpoint específico e melhorado para a Análise da Triagem Pediátrica
app.post('/analise-triagem', async (req, res) => {
  const assistantId = assistants.triagem;
  const dadosTriagem = req.body;

  if (!dadosTriagem || !dadosTriagem.idade || !dadosTriagem.queixaPrincipal) {
      return res.status(400).json({ error: 'Dados de triagem insuficientes. Idade e queixa principal são obrigatórios.' });
  }

  // --- PROMPT MELHORADO ---
  const promptParaAnalise = `
    # CONTEXTO
    Você é um assistente de IA especialista em triagem pediátrica para um aplicativo de telessaúde. Sua função é analisar dados preliminares de uma criança e fornecer uma avaliação de risco estruturada em JSON, focada em identificar sinais de gravidade e orientar os próximos passos.

    # TAREFA
    Analise os dados da criança abaixo e retorne um objeto JSON contendo sua análise. A análise deve ser objetiva, baseada em diretrizes de triagem pediátrica (como o Triângulo de Avaliação Pediátrica - TEP), e priorizar a segurança do paciente.

    # DADOS DA CRIANÇA
    - Idade: ${dadosTriagem.idade || 'Não informado'}
    - Queixa Principal: ${dadosTriagem.queixaPrincipal || 'Não informado'}
    - História da Doença: ${dadosTriagem.historiaDoenca || 'Não informado'}
    - Frequência Cardíaca: ${dadosTriagem.frequenciaCardiaca || 'Não medido'} bpm
    - Frequência Respiratória: ${dadosTriagem.frequenciaRespiratoria || 'Não medido'} irpm
    - Temperatura: ${dadosTriagem.temperatura || 'Não medido'} °C
    - Saturação de O₂: ${dadosTriagem.saturacaoO2 || 'Não medido'} %
    - Estado Geral: ${dadosTriagem.estadoGeral || 'Não informado'}
    - Nível de Consciência: ${dadosTriagem.nivelConsciencia || 'Não informado'}
    - Observações Adicionais: ${dadosTriagem.observacoesAdicionais || 'Nenhuma'}

    # ESTRUTURA JSON DE SAÍDA OBRIGATÓRIA
    O JSON de saída DEVE seguir esta estrutura:
    {
      "sinais_de_gravidade": ["Lista de achados preocupantes diretos. Ex: 'Febre alta persistente', 'Tiragem subcostal', 'Letargia'"],
      "conduta_recomendada": {
        "urgencia": true | false, // Booleano: true se for emergência/urgência, false se for não-urgente.
        "justificativa": "Explicação concisa do porquê a urgência foi classificada como tal, baseada nos sinais de gravidade.",
        "orientacoes": ["Lista de ações claras e diretas para o cuidador. Ex: 'Procure atendimento médico de emergência imediatamente', 'Monitore a frequência respiratória', 'Ofereça líquidos com frequência'"]
      },
      "sinais_de_piora": ["Lista de sinais específicos que o cuidador deve observar que indicariam piora do quadro. Ex: 'Aumento do esforço para respirar', 'Aparecimento de manchas roxas na pele', 'Recusa total de líquidos'"]
    }

    # INSTRUÇÕES IMPORTANTES
    - Seja direto e objetivo. Não adicione texto ou explicações fora da estrutura JSON.
    - Se a criança tiver menos de 3 meses e apresentar febre, classifique sempre como urgência.
    - Sinais de esforço respiratório, alteração do nível de consciência (sonolência excessiva, irritabilidade inconsolável) ou má perfusão (pele pálida, fria) são sempre sinais de gravidade.
    - A sua resposta final DEVE SER APENAS O CÓDIGO JSON, sem nenhum texto adicional antes ou depois.
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

    const runStatus = await waitForRunCompletion(thread.id, run.id);

    if (runStatus === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find(
        (message) => message.run_id === run.id && message.role === 'assistant'
      );

      if (lastMessage && lastMessage.content[0].type === 'text') {
        const rawResponse = lastMessage.content[0].text.value;
        
        try {
          const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
          if (!jsonMatch) {
            throw new Error("Nenhum bloco JSON encontrado na resposta da IA.");
          }
          const extractedJson = jsonMatch[1] || jsonMatch[2];
          const parsedJson = JSON.parse(extractedJson);
          res.json(parsedJson);

        } catch (jsonError) {
          console.error('Erro ao fazer parse do JSON da OpenAI:', jsonError, 'String recebida:', rawResponse);
          res.status(500).json({ error: 'A resposta do assistente não é um JSON válido.', raw_response: rawResponse });
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

async function waitForRunCompletion(threadId, runId) {
    let run;
    const startTime = Date.now();
    const timeout = 30000;

    while (Date.now() - startTime < timeout) {
        run = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
            return run.status;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return 'timed_out';
}

app.listen(port, () => {
  console.log(`Servidor MissionCare+ v4 rodando em http://localhost:${port}`);
});
