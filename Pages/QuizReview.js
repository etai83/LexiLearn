import React, { useState, useEffect } from "react";
import { Quiz as QuizEntity } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowLeft,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import PropTypes from 'prop-types';

export default function QuizReview() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHebrew, setIsHebrew] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (quizId) {
      loadQuiz(quizId);
    } else {
      setError("Quiz not found");
      setIsLoading(false);
    }
  }, []);

  const loadQuiz = async (quizId) => {
    try {
      const quizData = await QuizEntity.filter({ id: quizId });
      if (quizData.length > 0) {
        const loadedQuiz = quizData[0];
        setQuiz(loadedQuiz);
        // Check if the first question contains Hebrew characters to determine language
        if (loadedQuiz.questions && loadedQuiz.questions.length > 0 && loadedQuiz.questions[0].question) {
          setIsHebrew(/[\u0590-\u05FF]/.test(loadedQuiz.questions[0].question));
        }
      } else {
        setError("Quiz not found");
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      setError("Failed to load quiz");
    }
    setIsLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto" dir={isHebrew ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{isHebrew ? 'סקירת בוחן' : 'Quiz Review'}</h1>
            <p className="text-slate-600" dir="auto">{quiz.title}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className={`w-4 h-4 ${isHebrew ? 'ml-2' : 'mr-2'}`} />
            {isHebrew ? 'חזרה ללוח המחוונים' : 'Back to Dashboard'}
          </Button>
        </div>

        {/* Quiz Summary */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              {isHebrew ? 'סיכום בוחן' : 'Quiz Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(quiz.score, quiz.total_questions)}`}>
                  {quiz.score || 0}/{quiz.total_questions || 5}
                </div>
                <p className="text-sm text-slate-600">{isHebrew ? 'ציון' : 'Score'}</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(((quiz.score || 0) / (quiz.total_questions || 5)) * 100)}%
                </div>
                <p className="text-sm text-slate-600">{isHebrew ? 'דיוק' : 'Accuracy'}</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {formatTime(quiz.time_spent || 0)}
                </div>
                <p className="text-sm text-slate-600">{isHebrew ? 'זמן' : 'Time Spent'}</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {quiz.completed_at ? format(new Date(quiz.completed_at), "MMM d") : "N/A"}
                </div>
                <p className="text-sm text-slate-600">{isHebrew ? 'הושלם בתאריך' : 'Completed'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">{isHebrew ? 'סקירת שאלות' : 'Question Review'}</h2>
          
          {quiz.questions?.map((question, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {isHebrew ? 'שאלה' : 'Question'} {index + 1}
                  </CardTitle>
                  <Badge className={getScoreBadge(
                    question.user_answer === question.correct_answer ? 1 : 0, 1
                  )}>
                    {question.user_answer === question.correct_answer ? (
                      <CheckCircle className="w-3 h-3 ml-1" />
                    ) : (
                      <XCircle className="w-3 h-3 ml-1" />
                    )}
                    {question.user_answer === question.correct_answer ? (isHebrew ? 'נכון' : 'Correct') : (isHebrew ? 'לא נכון' : 'Incorrect')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3" dir="auto">{question.question}</h4>
                  
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => {
                      const optionLetter = isHebrew 
                        ? String.fromCharCode(0x05D0 + optionIndex) // Unicode for Hebrew Aleph 'א'
                        : String.fromCharCode(65 + optionIndex); // ASCII for 'A'
                      
                      // Assuming question.correct_answer and question.user_answer contain the full text of the option
                      const isCorrect = option === question.correct_answer;
                      const isUserAnswer = option === question.user_answer;
                      
                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'bg-green-50 border-green-200'
                              : isUserAnswer
                              ? 'bg-red-50 border-red-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium" dir={isHebrew ? 'rtl' : 'ltr'}>
                              {optionLetter}. {option}
                            </span>
                            <div className="flex items-center gap-2">
                              {isCorrect && (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  {isHebrew ? 'תשובה נכונה' : 'Correct'}
                                </Badge>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <Badge variant="outline" className="bg-red-100 text-red-800">
                                  {isHebrew ? 'התשובה שלך' : 'Your Answer'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">{isHebrew ? 'הסבר' : 'Explanation'}</h5>
                    <p className="text-blue-800" dir="auto">{question.explanation}</p>
                  </div>
                )}

                {/* Supporting Text */}
                {question.supporting_text && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h5 className="font-medium text-slate-900 mb-2">{isHebrew ? 'טקסט תומך' : 'Supporting Text'}</h5>
                    <p className="text-slate-700 italic" dir="auto">&quot;{question.supporting_text}&quot;</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

QuizReview.propTypes = {
  quiz: PropTypes.shape({
    title: PropTypes.string.isRequired,
    score: PropTypes.number,
    total_questions: PropTypes.number,
    time_spent: PropTypes.number,
    completed_at: PropTypes.string,
    questions: PropTypes.arrayOf(PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      correct_answer: PropTypes.string.isRequired,
      user_answer: PropTypes.string,
      explanation: PropTypes.string,
      supporting_text: PropTypes.string,
    })).isRequired,
  }).isRequired,
};