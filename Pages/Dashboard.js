import React, { useState, useEffect } from "react";
import { Quiz, Document, User } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Target, 
  Plus,
  Calendar,
  Award,
  ChevronRight,
  BarChart3,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalDocuments: 0,
    weeklyProgress: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const [quizzesData, documentsData] = await Promise.all([
        Quiz.filter({ created_by: userData.email }, '-created_date', 50),
        Document.filter({ created_by: userData.email }, '-created_date', 20)
      ]);

      setQuizzes(quizzesData);
      setDocuments(documentsData);

      // Calculate stats
      const totalQuizzes = quizzesData.length;
      const averageScore = totalQuizzes > 0 
        ? quizzesData.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / totalQuizzes 
        : 0;
      
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weeklyQuizzes = quizzesData.filter(quiz => 
        new Date(quiz.created_date) >= weekStart
      ).length;

      setStats({
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        totalDocuments: documentsData.length,
        weeklyProgress: weeklyQuizzes
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 4) return "bg-green-100 text-green-800";
    if (score >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Prepare chart data from latest 10 quizzes
  const getChartData = () => {
    return quizzes
      .slice(0, 10) // Take latest 10 quizzes
      .reverse() // Reverse to show chronological order
      .map((quiz, index) => ({
        quiz: `Quiz ${index + 1}`,
        score: quiz.score || 0,
        maxScore: quiz.total_questions || 5,
        percentage: Math.round(((quiz.score || 0) / (quiz.total_questions || 5)) * 100),
        date: format(new Date(quiz.created_date), "MMM d"),
        title: quiz.title
      }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.title}</p>
          <p className="text-sm text-slate-600">{data.date}</p>
          <p className="text-sm">
            Score: <span className="font-semibold text-blue-600">{data.score}/{data.maxScore}</span>
            <span className="text-slate-500 ml-2">({data.percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-slate-600">
            Track your reading comprehension progress and continue improving your skills.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalQuizzes}</div>
              <p className="text-xs text-blue-600 mt-1">
                {stats.totalDocuments} documents uploaded
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Average Score</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats.averageScore}/5
              </div>
              <div className="mt-2">
                <Progress 
                  value={(stats.averageScore / 5) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.weeklyProgress}</div>
              <p className="text-xs text-purple-600 mt-1">
                quizzes completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Best Streak</CardTitle>
              <Award className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {Math.max(...quizzes.map(q => q.score || 0), 0)}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                highest score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        {quizzes.length > 0 && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Score Progress
              </CardTitle>
              <CardDescription>Your performance over the last 10 quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="quiz" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: '#1d4ed8', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span>Quiz Scores</span>
                </div>
                <div className="text-slate-500">
                  Scale: 0-5 points per quiz
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Quizzes */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900">Recent Quizzes</CardTitle>
                  <CardDescription>Your latest reading comprehension practice</CardDescription>
                </div>
                <Link to={createPageUrl("Upload")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Quiz
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {quizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No quizzes yet</h3>
                    <p className="text-slate-500 mb-4">
                      Upload your first PDF document to start practicing reading comprehension
                    </p>
                    <Link to={createPageUrl("Upload")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quizzes.slice(0, 5).map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{quiz.title}</h4>
                            <p className="text-sm text-slate-500">
                              {format(new Date(quiz.created_date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getScoreBadge(quiz.score || 0)}>
                            {quiz.score || 0}/5
                          </Badge>
                          <Link to={createPageUrl(`QuizReview?id=${quiz.id}`)}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("Upload")}>
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload New Document
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline" disabled>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                  <Badge variant="secondary" className="ml-auto">Soon</Badge>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Insights */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Progress Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Reading Accuracy</span>
                      <span className="font-medium">{Math.round((stats.averageScore / 5) * 100)}%</span>
                    </div>
                    <Progress value={(stats.averageScore / 5) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-600 mb-2">This week's activity</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">
                        {stats.weeklyProgress} quiz{stats.weeklyProgress !== 1 ? 'es' : ''} completed
                      </span>
                    </div>
                  </div>

                  {quizzes.length > 1 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-slate-600 mb-2">Recent trend</p>
                      <div className="flex items-center gap-2">
                        {quizzes.length >= 2 && (
                          <>
                            {(quizzes[0]?.score || 0) > (quizzes[1]?.score || 0) ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">Improving</span>
                              </>
                            ) : (quizzes[0]?.score || 0) < (quizzes[1]?.score || 0) ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                                <span className="text-sm text-red-600 font-medium">Keep practicing</span>
                              </>
                            ) : (
                              <>
                                <Target className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600 font-medium">Consistent</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}