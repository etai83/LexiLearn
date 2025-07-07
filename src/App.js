import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout.js';
import Dashboard from './pages/Dashboard.js';
import Upload from './pages/Upload.js';
import Quiz from './pages/Quiz.js';
import QuizReview from './pages/QuizReview.js';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-review" element={<QuizReview />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
