const { generateResponse } = require('../services/ollamaService');
const axios = require('axios');

jest.mock('axios');

describe('ollamaService', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test('should generate a response from Ollama', async () => {
    const mockResponseData = { response: 'This is a test response from Ollama.' };
    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    const prompt = 'Test prompt';
    const response = await generateResponse(prompt);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      model: 'llama2',
      prompt: prompt,
      stream: false,
    });
    expect(response).toBe(mockResponseData.response);
  });

  test('should throw an error if Ollama API call fails', async () => {
    const errorMessage = 'Network Error';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    const prompt = 'Test prompt';
    await expect(generateResponse(prompt)).rejects.toThrow('Failed to get response from Ollama.');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test('should throw a specific error for connection refused', async () => {
    const error = new Error('Connection refused');
    error.code = 'ECONNREFUSED';
    axios.post.mockRejectedValueOnce(error);

    const prompt = 'Test prompt';
    await expect(generateResponse(prompt)).rejects.toThrow('Failed to connect to Ollama API. Please ensure Ollama is running.');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
