// index.js

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IDs dos assistentes da OpenAI
const assistants = {
  clinica: 'asst_p3D8is4KCKsPq5YRL4adL5sQ', // Assistente para anamnese clínica
  triagem: 'asst_qitIwbREUyPY1GRIYH7vYQx0', // Assistente para triagem inicial
};

app.use(cors());
app.use(express.json());

app.post('/api/v1/assistente', async (req, res) => {
  const { tipo_assistente, prompt } = req.body;
  const assistantId = assistants[tipo_assistente];

  if (!assistantId) {
    return res.status(400).json({ error: 'Tipo de assistente inválido.' });
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

    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const runCheck = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      runStatus = runCheck.status;
    } while (runStatus === 'in_progress' || runStatus === 'queued');

    if (runStatus === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data.find(
        (message) => message.run_id === run.id && message.role === 'assistant'
      );

      if (lastMessage) {
        // Extrai o conteúdo de texto da mensagem
        const textContent = lastMessage.content[0].text.value;
        res.json({ response: textContent });
      } else {
        res.status(500).json({ error: 'Nenhuma resposta do assistente.' });
      }
    } else {
      console.error(`O status da execução é: ${runStatus}`);
      res.status(500).json({ error: 'Falha na execução do assistente.' });
    }
  } catch (error) {
    console.error('Erro ao processar a requisição do assistente:', error);
    res.status(500).json({ error: 'Falha ao se comunicar com o assistente.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
