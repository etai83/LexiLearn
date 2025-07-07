const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

async function generateResponse(prompt) {
  try {
    console.log(`Sending prompt to Ollama: ${prompt}`);
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'llama2', // You can make this configurable or choose a default model
      prompt: prompt,
      stream: false, // For simplicity, we'll get the full response at once
    });

    console.log('Received response from Ollama.');
    return response.data.response;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection to Ollama API refused. Is Ollama running and accessible at ', OLLAMA_API_URL);
      throw new Error('Failed to connect to Ollama API. Please ensure Ollama is running.');
    } else {
      console.error('Error communicating with Ollama API:', error.message);
      if (error.response) {
        console.error('Ollama API response error data:', error.response.data);
        console.error('Ollama API response status:', error.response.status);
      }
      throw new Error('Failed to get response from Ollama.');
    }
  }
}

module.exports = {
  generateResponse,
};
