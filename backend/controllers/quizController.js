const ollamaService = require('../services/ollamaService');
const pdfParse = require('pdf-parse');

async function generateQuiz(req, res) {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'PDF file is required.' });
  }

  let textContent;
  try {
    const data = await pdfParse(req.file.buffer);
    textContent = data.text;
  } catch (pdfError) {
    console.error('Error parsing PDF:', pdfError);
    return res.status(500).json({ error: 'Failed to parse PDF content.' });
  }

  const numQuestions = req.body.numQuestions || 5;

  if (!textContent || textContent.trim().length === 0) {
    return res.status(400).json({ error: 'No readable text found in the PDF.' });
  }

  const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions based on the following text. Provide the questions, 4 options for each question, and the correct answer. Format the output as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'answer' (the correct option string). Text: ${textContent}`;

  try {
    const ollamaResponse = await ollamaService.generateResponse(prompt);
    // Attempt to parse the JSON response from Ollama
    let quizData;
    try {
      const jsonMatch = ollamaResponse.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        quizData = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback if no ```json block is found, try to parse directly
        quizData = JSON.parse(ollamaResponse);
      }
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
