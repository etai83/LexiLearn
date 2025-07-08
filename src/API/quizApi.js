import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const generateQuiz = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quiz/generate`, formData);
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
