const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI Client Initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Assistant ID Mapping ---
const assistantMapping = {
  'clinica': 'asst_qitIwbREUyPY1GRIYH7vYQx0',
  'emergencias': 'asst_NU2rjoLUZiECJ711IE1pXotZ',
  'gob': 'asst_6Y4J1zJGLhr7Wy129uj4shtA',
  'pediatria': 'asst_AMRI91iC8Efv90P41K3PVATV',
};

// +++ HEALTH CHECK ROUTE +++
app.get('/', (req, res) => {
  res.status(200).json({ ok: true, message: "Backend is alive!" });
});

// Generic assistant runner endpoint
app.post('/api/assistants/run/:assistantName', async (req, res) => {
  const { assistantName } = req.params;
  const assistantId = assistantMapping[assistantName];

  if (!assistantId) {
    return res.status(404).json({ ok: false, error: `Assistant '${assistantName}' not found.` });
  }
  
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Message is required.' });
  }

  console.log(`Running assistant '${assistantName}' (ID: ${assistantId})`);

  try {
    // ... (rest of the assistant logic is the same)
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 500));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        return res.status(500).json({ ok: false, error: 'The assistant run failed.', details: runStatus.last_error });
      }
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data.find(m => m.role === 'assistant');

    if (assistantResponse && assistantResponse.content[0].type === 'text') {
      const responseText = assistantResponse.content[0].text.value;
      res.json({ ok: true, text: responseText });
    } else {
      res.status(500).json({ ok: false, error: 'Could not find a valid response from the assistant.' });
    }
  } catch (error) {
    console.error('Error running assistant:', error);
    res.status(500).json({ ok: false, error: 'An error occurred while communicating with the OpenAI assistant.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});