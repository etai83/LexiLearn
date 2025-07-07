const request = require('supertest');
const express = require('express');
const quizRoutes = require('../routes/quizRoutes');
const ollamaService = require('../services/ollamaService');

// Mock the ollamaService
jest.mock('../services/ollamaService');

const app = express();
app.use(express.json());
app.use('/api/quiz', quizRoutes);

describe('Quiz API Integration Tests', () => {
  beforeEach(() => {
    ollamaService.generateResponse.mockClear();
  });

  test('POST /api/quiz/generate should generate a quiz successfully', async () => {
    const mockOllamaResponse = JSON.stringify([
      {
        question: 'Test Question 1',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
      },
    ]);
    ollamaService.generateResponse.mockResolvedValueOnce(mockOllamaResponse);

    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ text: 'Sample text for quiz', numQuestions: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        question: 'Test Question 1',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
      },
    ]);
    expect(ollamaService.generateResponse).toHaveBeenCalledTimes(1);
    expect(ollamaService.generateResponse).toHaveBeenCalledWith(expect.stringContaining('Sample text for quiz'));
  });

  test('POST /api/quiz/generate should return 400 if text is missing', async () => {
    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ numQuestions: 1 });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Text content is required to generate a quiz.' });
    expect(ollamaService.generateResponse).not.toHaveBeenCalled();
  });

  test('POST /api/quiz/generate should return 500 if Ollama service fails', async () => {
    ollamaService.generateResponse.mockRejectedValueOnce(new Error('Ollama service error'));

    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ text: 'Sample text', numQuestions: 1 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Ollama service error' });
    expect(ollamaService.generateResponse).toHaveBeenCalledTimes(1);
  });

  test('POST /api/quiz/generate should return 500 if Ollama response is invalid JSON', async () => {
    ollamaService.generateResponse.mockResolvedValueOnce('invalid json');

    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ text: 'Sample text', numQuestions: 1 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to parse quiz data from AI response.');
    expect(ollamaService.generateResponse).toHaveBeenCalledTimes(1);
  });

  test('POST /api/quiz/generate should return 500 if Ollama response has invalid quiz data format', async () => {
    const mockOllamaResponse = JSON.stringify([
      {
        question: 'Test Question 1',
        options: ['A', 'B', 'C'], // Missing one option
        answer: 'A',
      },
    ]);
    ollamaService.generateResponse.mockResolvedValueOnce(mockOllamaResponse);

    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ text: 'Sample text', numQuestions: 1 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Invalid quiz data format received from AI.');
    expect(ollamaService.generateResponse).toHaveBeenCalledTimes(1);
  });
});
