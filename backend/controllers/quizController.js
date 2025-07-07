const ollamaService = require('../services/ollamaService');

async function generateQuiz(req, res) {
  const { text, numQuestions } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text content is required to generate a quiz.' });
  }

  const prompt = `Generate a quiz with ${numQuestions || 5} multiple-choice questions based on the following text. Provide the questions, 4 options for each question, and the correct answer. Format the output as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'answer' (the correct option string). Text: ${text}`;

  try {
    const ollamaResponse = await ollamaService.generateResponse(prompt);
    // Attempt to parse the JSON response from Ollama
    let quizData;
    try {
      quizData = JSON.parse(ollamaResponse);
    } catch (parseError) {
      console.error('Failed to parse Ollama response as JSON:', parseError);
      console.error('Ollama raw response:', ollamaResponse);
      return res.status(500).json({ error: 'Failed to parse quiz data from AI response.', rawResponse: ollamaResponse });
    }

    // Basic validation of the parsed data structure
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer)) {
      return res.status(500).json({ error: 'Invalid quiz data format received from AI.', quizData });
    }

    res.json(quizData);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  generateQuiz,
};
