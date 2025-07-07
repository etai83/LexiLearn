
import React, { useState, useEffect } from "react";
import { Quiz as QuizEntity } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import QuestionCard from "../components/quiz/QuestionCard";
import QuizResults from "../components/quiz/QuizResults";

export default function Quiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [isHebrew, setIsHebrew] = useState(false); // New state for Hebrew language detection

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    
    if (quizId) {
      loadQuiz(quizId);
    } else {
      setError("Quiz not found");
      setIsLoading(false);
    }

    // Track time spent
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const loadQuiz = async (quizId) => {
    try {
      const quizData = await QuizEntity.filter({ id: quizId });
      if (quizData.length > 0) {
        const loadedQuiz = quizData[0];
        setQuiz(loadedQuiz);
        // Detect Hebrew based on the first question's content
        if (loadedQuiz.questions && loadedQuiz.questions.length > 0) {
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

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    const correctAnswers = quiz.questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct_answer ? 1 : 0);
    }, 0);

    const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const updatedQuestions = quiz.questions.map((question, index) => ({
      ...question,
      user_answer: answers[index] || null
    }));

    const results = {
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent: finalTimeSpent,
      questions: updatedQuestions,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100)
    };

    try {
      await QuizEntity.update(quiz.id, {
        score: correctAnswers,
        time_spent: finalTimeSpent,
        completed_at: new Date().toISOString(),
        questions: updatedQuestions
      });

      setResults(results);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / quiz.questions.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
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

  if (isCompleted && results) {
    return <QuizResults results={results} quiz={quiz} isHebrew={isHebrew} />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const canGoNext = currentQuestionIndex < quiz.questions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900" dir="auto">{quiz.title}</h1>
              <p className="text-slate-600" dir={isHebrew ? 'rtl' : 'ltr'}>
                {isHebrew ? 'בוחן הבנת הנקרא' : 'Reading Comprehension Quiz'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {formatTime(timeSpent)}
              </div>
              <Badge variant="outline">
                {currentQuestionIndex + 1} of {quiz.questions.length}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600" dir={isHebrew ? 'rtl' : 'ltr'}>
              <span>{isHebrew ? 'התקדמות' : 'Progress'}</span>
              <span>
                {isHebrew ? 'הושלמו' : ''} {Math.round(getProgressPercentage())}% {isHebrew ? '' : 'complete'}
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" dir={isHebrew ? 'rtl' : 'ltr'}>
              <BookOpen className="w-5 h-5" />
              {isHebrew ? 'שאלה' : 'Question'} {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              selectedAnswer={answers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              isHebrew={isHebrew}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center" dir={isHebrew ? 'rtl' : 'ltr'}>
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={!canGoPrevious}
          >
            <ArrowLeft className={`w-4 h-4 ${isHebrew ? 'ml-2' : 'mr-2'}`} />
            {isHebrew ? 'הקודם' : 'Previous'}
          </Button>

          <div className="flex gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              disabled={!allQuestionsAnswered}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <CheckCircle className={`w-4 h-4 ${isHebrew ? 'ml-2' : 'mr-2'}`} />
              {isHebrew ? 'הגש בוחן' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={goToNextQuestion}
              disabled={!canGoNext || !answers[currentQuestionIndex]}
            >
              {isHebrew ? 'הבא' : 'Next'}
              <ArrowRight className={`w-4 h-4 ${isHebrew ? 'mr-2' : 'ml-2'}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
