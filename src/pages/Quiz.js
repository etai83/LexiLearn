import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, Trophy, CheckCircle } from "lucide-react";

export default function Quiz() {
  const navigate = useNavigate();
  
  // Sample quiz data
  const quiz = {
    title: "Sample Reading Comprehension Quiz",
    questions: [
      {
        question: "What is the main topic of this passage?",
        options: [
          "Environmental conservation",
          "Technology advancement",
          "Economic development",
          "Social media impact"
        ],
        correct_answer: "Environmental conservation"
      },
      {
        question: "According to the text, what percentage of people support renewable energy?",
        options: ["45%", "67%", "78%", "89%"],
        correct_answer: "78%"
      },
      {
        question: "Which solution is mentioned as most effective?",
        options: [
          "Solar panels",
          "Wind turbines", 
          "Hydroelectric dams",
          "Nuclear power"
        ],
        correct_answer: "Solar panels"
      }
    ]
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((new Date() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correct++;
      }
    });
    
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const submitQuiz = () => {
    setIsSubmitted(true);
    
    // Navigate to results after delay
    setTimeout(() => {
      navigate('/quiz-review');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted!</h2>
        <p className="text-gray-600">Your score: {calculateScore()}%</p>
        <p className="text-gray-600">Redirecting to results...</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              {formatTime(timeElapsed)}
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-medium">
              {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Question {currentQuestionIndex + 1}
        </h2>
        
        <p className="text-gray-900 mb-6 text-lg leading-relaxed">
          {currentQuestion.question}
        </p>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = answers[currentQuestionIndex] === option;
            return (
              <div
                key={optionIndex}
                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-3">
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
              disabled={!answers[currentQuestionIndex]}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
