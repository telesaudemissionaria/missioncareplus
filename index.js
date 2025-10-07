// index.js - v5 - Added Adult Triage Endpoint

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
  clinica: 'asst_qitIwbREUyPY1GRIYH7vYQx0', // Assistente de clínica geral para adultos
  triagem: 'asst_AMRI91iC8Efv90P41K3PVATV', // Assistente de pediatria
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor MissionCare+ v5 está no ar. Endpoints: /analise-triagem, /analise-triagem-adulto');
});

// Endpoint para a Triagem Pediátrica
app.post('/analise-triagem', async (req, res) => {
  const assistantId = assistants.triagem;
  const dadosTriagem = req.body;
  const promptParaAnalise = `
    # CONTEXTO
    Você é um assistente de IA especialista em triagem pediátrica para um aplicativo de telessaúde. Sua função é analisar dados preliminares de uma criança e fornecer uma avaliação de risco estruturada em JSON, focada em identificar sinais de gravidade e orientar os próximos passos.
    # DADOS DA CRIANÇA
    - Idade: ${dadosTriagem.idade || 'Não informado'}
    - Queixa Principal: ${dadosTriagem.queixaPrincipal || 'Não informado'}
    - História da Doença: ${dadosTriagem.historiaDoenca || 'Não informado'}
    - Sinais Vitais: ${dadosTriagem.temperatura || ''} ${dadosTriagem.frequenciaCardiaca || ''} ${dadosTriagem.frequenciaRespiratoria || ''}
    - Estado Geral: ${dadosTriagem.estadoGeral || 'Não informado'}
    - Nível de Consciência: ${dadosTriagem.nivelConsciencia || 'Não informado'}
    - Observações Adicionais: ${dadosTriagem.observacoesAdicionais || 'Nenhuma'}
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
  await processarAnalise(res, assistantId, promptParaAnalise);
});

// NOVO Endpoint para a Triagem de Adulto
app.post('/analise-triagem-adulto', async (req, res) => {
  const assistantId = assistants.clinica;
  const dadosAdulto = req.body;
  
  // Validação mínima
  if (!dadosAdulto || !dadosAdulto.problemaPrincipal) {
      return res.status(400).json({ error: 'Dados de triagem insuficientes. O problema principal é obrigatório.' });
  }

  const promptParaAnalise = `
    # CONTEXTO
    Você é um assistente de IA especialista em clínica médica para um aplicativo de telessaúde. Sua função é analisar uma anamnese simplificada de um paciente adulto e fornecer uma avaliação de risco estruturada em JSON.

    # TAREFA
    Analise os dados do paciente abaixo e retorne um objeto JSON com sua análise. A análise deve ser objetiva, focada em identificar sinais de alarme e orientar os próximos passos de forma segura.

    # DADOS DO PACIENTE
    - Queixa Principal: ${dadosAdulto.problemaPrincipal || 'Não informado'}
    - Início dos Sintomas: ${dadosAdulto.inicioSintomas || 'Não informado'}
    - Progressão dos Sintomas: ${dadosAdulto.progressaoSintomas || 'Não informado'}
    - Fatores de Melhora/Piora: ${dadosAdulto.melhoraPiora || 'Não informado'}
    - Doenças Crônicas: ${dadosAdulto.doencasCronicas || 'Não informado'}
    - Medicamentos em Uso: ${dadosAdulto.medicamentos || 'Não informado'}
    - Alergias: ${dadosAdulto.alergias || 'Não informado'}

    # ESTRUTURA JSON DE SAÍDA OBRIGATÓRIA
    {
      "sinais_de_gravidade": ["Lista de achados preocupantes baseados nos dados. Ex: 'Dor no peito de início súbito', 'Sintomas que pioram rapidamente', 'Febre persistente acima de 39°C'"],
      "conduta_recomendada": {
        "urgencia": true | false, // Booleano: true se for emergência/urgência, false se for não-urgente.
        "justificativa": "Explicação concisa da classificação de urgência, baseada nos dados fornecidos.",
        "orientacoes": ["Lista de ações claras para o paciente. Ex: 'Procure uma avaliação médica presencial nas próximas 24 horas', 'Monitore sua temperatura', 'Considerar uso de analgésico se não houver contra-indicação'"],
        "hipoteses_diagnosticas_preliminares": ["Liste 2 a 3 possíveis hipóteses em linguagem simples. Ex: 'Virose comum', 'Sinusite', 'Cefaleia tensional'"]
      },
      "sinais_de_piora": ["Lista de sinais de alarme que indicam piora e necessidade de reavaliação. Ex: 'Dificuldade para respirar', 'Dor de cabeça que não melhora com medicação', 'Confusão mental'"],
      "limitacoes_da_analise": "Sempre inclua este texto: Esta é uma análise preliminar baseada em dados limitados e não substitui uma consulta médica. Um diagnóstico preciso só pode ser feito por um profissional de saúde qualificado."
    }

    # INSTRUÇÕES IMPORTANTES
    - Dor no peito, falta de ar, alteração súbita de visão ou força, ou sintomas neurológicos focais devem sempre ser classificados como urgência.
    - Sua resposta DEVE SER APENAS O CÓDIGO JSON, sem nenhum texto adicional.
  `;
  await processarAnalise(res, assistantId, promptParaAnalise);
});

// Função genérica para processar a análise e enviar a resposta
async function processarAnalise(res, assistantId, prompt) {
  try {
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
        const rawResponse = lastMessage.content[0].text.value;
        try {
          const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
          if (!jsonMatch) throw new Error("Nenhum bloco JSON encontrado na resposta.");
          
          const extractedJson = jsonMatch[1] || jsonMatch[2];
          const parsedJson = JSON.parse(extractedJson);
          res.json(parsedJson);

        } catch (jsonError) {
          console.error('Erro ao fazer parse do JSON:', jsonError, 'String recebida:', rawResponse);
          res.status(500).json({ error: 'A resposta da IA não é um JSON válido.', raw_response: rawResponse });
        }
      } else {
        res.status(500).json({ error: 'Nenhuma resposta de texto do assistente.' });
      }
    } else {
      console.error(`Status da execução: ${runStatus}`);
      res.status(500).json({ error: `Falha na execução do assistente. Status: ${runStatus}` });
    }
  } catch (error) {
    console.error('Erro grave na comunicação com a IA:', error);
    res.status(500).json({ error: 'Falha grave ao se comunicar com o assistente.' });
  }
}

async function waitForRunCompletion(threadId, runId) {
    const startTime = Date.now();
    while (Date.now() - startTime < 30000) { // Timeout de 30s
        const run = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (['completed', 'failed', 'cancelled', 'expired'].includes(run.status)) {
            return run.status;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return 'timed_out';
}

app.listen(port, () => {
  console.log(`Servidor MissionCare+ v5 rodando em http://localhost:${port}`);
});
