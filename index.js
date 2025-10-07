
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantIds = {
  "primeiros_socorros": "asst_NU2rjoLUZiECJ711IE1pXotZ",
  "clinica": "asst_re1VWU19CE7rvfMzbdfNQVdm" 
};

app.use(cors());
app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.send('API MissionCare Plus v1 está no ar!');
});

app.post('/api/v1/assistente', async (req, res) => {
  const { tipo_assistente, prompt } = req.body;

  if (!tipo_assistente || !prompt) {
    return res.status(400).json({ error: 'Parâmetros "tipo_assistente" e "prompt" são obrigatórios.' });
  }

  const assistantId = assistantIds[tipo_assistente];

  if (!assistantId) {
    return res.status(400).json({ error: 'Tipo de assistente inválido.' });
  }

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 300));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        console.error('Run failed with status:', runStatus.status, runStatus.last_error);
        return res.status(500).json({ error: `A execução falhou com o status: ${runStatus.status}` });
      }
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessageForRun = messages.data
      .filter(message => message.run_id === run.id && message.role === "assistant")
      .pop();

    if (lastMessageForRun && lastMessageForRun.content[0].type === 'text') {
      res.json({ response: lastMessageForRun.content[0].text.value });
    } else {
      res.status(500).json({ error: "Nenhuma resposta do assistente encontrada." });
    }

  } catch (error) {
    console.error("Erro ao processar a requisição do assistente:", error);
    res.status(500).json({ error: "Falha ao se comunicar com o assistente." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
