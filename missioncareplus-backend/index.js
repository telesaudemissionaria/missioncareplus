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
// A .env file with OPENAI_API_KEY is required in the same directory
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Assistant ID Mapping ---
// Add your assistant names and corresponding IDs here
const assistantMapping = {
  'clinica': 'asst_qitIwbREUyPY1GRIYH7vYQx0',
  'emergencias': 'asst_NU2rjoLUZiECJ711IE1pXotZ',
  'gob': 'asst_6Y4J1zJGLhr7Wy129uj4shtA',
  'pediatria': 'asst_AMRI91iC8Efv90P41K3PVATV',
};

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
    // 1. Create a new thread with the user's message
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    console.log(`Thread created: ${thread.id}`);

    // 2. Run the assistant on the thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    console.log(`Run created: ${run.id}`);

    // 3. Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      console.log(`Run status: ${runStatus.status}`);
      
      if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
        console.error('Run failed with status:', runStatus.status, runStatus.last_error);
        return res.status(500).json({ ok: false, error: 'The assistant run failed.', details: runStatus.last_error });
      }
    }
    console.log('Run completed.');
    
    // 4. Retrieve messages from the thread
    const messages = await openai.beta.threads.messages.list(thread.id);

    // 5. Find the assistant's response
    // The messages are in descending order, so the first one should be the latest assistant response.
    const assistantResponse = messages.data.find(m => m.role === 'assistant');

    if (assistantResponse && assistantResponse.content[0].type === 'text') {
      const responseText = assistantResponse.content[0].text.value;
      console.log('Assistant response found.');
      res.json({ ok: true, text: responseText });
    } else {
      console.error("No valid assistant response found in the thread.");
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