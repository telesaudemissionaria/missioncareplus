const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const assistantMapping = {
  'clinica': 'asst_qitIwbREUyPY1GRIYH7vYQx0',
  'ginecologia': 'asst_abc123DEF456ghi789', // Exemplo de outro assistente
};

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('Chave da API da OpenAI não encontrada. Defina a variável de ambiente OPENAI_API_KEY.');
  // Lidar com a ausência da chave da API, se necessário
}

app.post('/api/v1/assistente', async (req, res) => {
  if (!openai) {
    return res.status(500).json({ error: 'A API da OpenAI não foi inicializada.' });
  }

  const { tipo_assistente, prompt } = req.body;
  const assistantId = assistantMapping[tipo_assistente];

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

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data.find(
      (msg) => msg.role === 'assistant' && msg.content[0].type === 'text'
    );

    if (lastMessage) {
      res.json({ response: lastMessage.content[0].text.value });
    } else {
      res.status(500).json({ error: 'Nenhuma resposta recebida do assistente.' });
    }
  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    res.status(500).json({ error: 'Falha ao se comunicar com o assistente.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
