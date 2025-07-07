import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Clock, Target } from "lucide-react";

export default function Dashboard() {
  // Sample data for demonstration
  const stats = {
    totalQuizzes: 12,
    averageScore: 85.5,
    weeklyProgress: 3,
    totalTimeSpent: 240
  };

  const recentQuizzes = [
    { id: 1, title: "Spanish Vocabulary", score: 90, timeSpent: 15, date: "2025-01-06" },
    { id: 2, title: "French Grammar", score: 78, timeSpent: 22, date: "2025-01-05" },
    { id: 3, title: "German Phrases", score: 88, timeSpent: 18, date: "2025-01-04" }
  ];

  const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${bgColor} rounded-md p-3 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to LexiLearn</h1>
        <p className="text-gray-600 mt-1">Track your language learning progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Quizzes"
          value={stats.totalQuizzes}
          icon={<BookOpen className="w-6 h-6" />}
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          bgColor="bg-green-500"
        />
        <StatCard
          title="This Week"
          value={stats.weeklyProgress}
          icon={<Clock className="w-6 h-6" />}
          bgColor="bg-yellow-500"
        />
        <StatCard
          title="Time Spent"
          value={`${Math.floor(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`}
          icon={<Target className="w-6 h-6" />}
          bgColor="bg-red-500"
        />
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Quizzes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quiz.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quiz.score}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quiz.timeSpent}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(quiz.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/quiz/${quiz.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/upload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Upload Document
          </Link>
          <Link
            to="/quiz"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
