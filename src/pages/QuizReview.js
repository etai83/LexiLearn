import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, BookOpen, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function QuizReview() {
  const navigate = useNavigate();
  
  // Sample review data
  const reviewData = {
    quiz: {
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
          correct_answer: "Environmental conservation",
          explanation: "The passage primarily discusses various environmental conservation methods and their effectiveness."
        },
        {
          question: "According to the text, what percentage of people support renewable energy?",
          options: ["45%", "67%", "78%", "89%"],
          correct_answer: "78%",
          explanation: "The text specifically mentions that 78% of survey respondents support renewable energy initiatives."
        },
        {
          question: "Which solution is mentioned as most effective?",
          options: [
            "Solar panels",
            "Wind turbines", 
            "Hydroelectric dams",
            "Nuclear power"
          ],
          correct_answer: "Solar panels",
          explanation: "According to the research cited, solar panels showed the highest efficiency rating among renewable energy sources."
        }
      ]
    },
    userAnswers: ["Environmental conservation", "67%", "Solar panels"],
    score: 67,
    duration: 180 // 3 minutes in seconds
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctCount = reviewData.userAnswers.filter((answer, index) => 
    answer === reviewData.quiz.questions[index].correct_answer
  ).length;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600 text-lg">
            {reviewData.quiz.title}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center mt-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600">{reviewData.score}%</div>
            <p className="text-gray-600">Final Score</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">
              {correctCount}/{reviewData.quiz.questions.length}
            </div>
            <p className="text-gray-600">Correct Answers</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-600">
              {formatTime(reviewData.duration)}
            </div>
            <p className="text-gray-600">Time Taken</p>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Question Review</h2>
        
        {reviewData.quiz.questions.map((question, index) => {
          const userAnswer = reviewData.userAnswers[index];
          const isCorrect = userAnswer === question.correct_answer;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow border-l-4 border-l-gray-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Question {index + 1}
                </h3>
                {isCorrect ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Correct
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Incorrect
                  </div>
                )}
              </div>
              
              <p className="text-gray-900 font-medium mb-4">{question.question}</p>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => {
                  const isUserAnswer = option === userAnswer;
                  const isCorrectAnswer = option === question.correct_answer;
                  
                  let bgColor = "bg-gray-50";
                  let textColor = "text-gray-900";
                  let icon = null;
                  
                  if (isCorrectAnswer) {
                    bgColor = "bg-green-100";
                    textColor = "text-green-800";
                    icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = "bg-red-100";
                    textColor = "text-red-800";
                    icon = <XCircle className="w-5 h-5 text-red-600" />;
                  }
                  
                  return (
                    <div key={optionIndex} className={`p-3 rounded-lg ${bgColor}`}>
                      <div className="flex items-center gap-3">
                        {icon}
                        <span className={`${textColor} ${isCorrectAnswer ? 'font-medium' : ''}`}>
                          {option}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {question.explanation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                  <p className="text-blue-800">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <BookOpen className="w-4 h-4" />
            Print Results
          </button>
          
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
