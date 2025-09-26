
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Objeto para mapear nomes de assistentes para seus IDs
const assistantIds = {
  'clinica': 'asst_pQf3n1iGfI213a7p4l3l3Zz4',
};

// Rota principal para executar um assistente
app.post('/api/assistants/run/:assistantName', async (req, res) => {
  const { assistantName } = req.params;
  const { message } = req.body;

  const assistantId = assistantIds[assistantName];

  if (!assistantId) {
    return res.status(404).json({ error: 'Assistente não encontrado.' });
  }

  if (!message) {
    return res.status(400).json({ error: 'A mensagem do usuário é obrigatória.' });
  }

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');

    if (assistantMessage && assistantMessage.content[0].type === 'text') {
      res.json({ ok: true, text: assistantMessage.content[0].text.value });
    } else {
      res.status(500).json({ error: 'Nenhuma resposta recebida do assistente.' });
    }

  } catch (error) {
    console.error('Erro ao executar o assistente:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor do MissionCarePlus Backend está no ar!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
