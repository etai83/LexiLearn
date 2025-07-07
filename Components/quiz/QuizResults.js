import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  CheckCircle,
  XCircle,
  BarChart3,
  Home,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PropTypes from 'prop-types';

export default function QuizResults({ results, quiz }) {
  const navigate = useNavigate();

  const getPerformanceMessage = () => {
    if (results.percentage >= 80) {
      return {
        title: "Excellent Work!",
        message: "You demonstrated strong reading comprehension skills.",
        color: "text-green-600",
        bgColor: "bg-green-50"
      };
    } else if (results.percentage >= 60) {
      return {
        title: "Good Job!",
        message: "You're making good progress. Keep practicing!",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      };
    } else {
      return {
        title: "Keep Practicing!",
        message: "Reading comprehension improves with regular practice.",
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      };
    }
  };

  const performance = getPerformanceMessage();
  const correctAnswers = results.questions.filter(q => q.user_answer === q.correct_answer).length;
  const incorrectAnswers = results.questions.length - correctAnswers;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full ${performance.bgColor} flex items-center justify-center mx-auto mb-4`}>
            <Trophy className={`w-10 h-10 ${performance.color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{performance.title}</h1>
          <p className="text-slate-600">{performance.message}</p>
        </div>

        {/* Score Summary */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${performance.color}`}>
                  {results.score}/{results.totalQuestions}
                </div>
                <p className="text-sm text-slate-600">Final Score</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {results.percentage}%
                </div>
                <p className="text-sm text-slate-600">Accuracy</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-sm text-slate-600">Time Spent</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Performance</span>
                  <span>{results.percentage}%</span>
                </div>
                <Progress value={results.percentage} className="h-3" />
              </div>
              
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">
                    {correctAnswers} Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-slate-600">
                    {incorrectAnswers} Incorrect
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => navigate(createPageUrl(`QuizReview?id=${quiz.id}`))}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Review Answers
          </Button>
          
          <Button
            onClick={() => navigate(createPageUrl("Upload"))}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Try Another Document
          </Button>
          
          <Button
            onClick={() => navigate(createPageUrl("Dashboard"))}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Quick Question Overview */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle>Question Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {results.questions.map((question, index) => (
                <div key={index} className="text-center">
                  <div className={`w-10 h-10 rounded-full ${question.user_answer === question.correct_answer
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  }`}>
                    {question.user_answer === question.correct_answer ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600">Q{index + 1}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

QuizResults.propTypes = {
  results: PropTypes.shape({
    percentage: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    timeSpent: PropTypes.number.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
      user_answer: PropTypes.string,
      correct_answer: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  quiz: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};