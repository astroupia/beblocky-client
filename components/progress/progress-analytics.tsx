"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Target,
  Award,
} from "lucide-react";
import { format, subDays } from "date-fns";
import type { IStudent } from "@/types/student";
import type { ICourse } from "@/types/course";

interface ProgressAnalyticsProps {
  student: IStudent;
  courses: Array<{
    course: ICourse;
    progress: {
      percentage: number;
      completedLessons: number;
      totalLessons: number;
    };
  }>;
}

export function ProgressAnalytics({
  student,
  courses,
}: ProgressAnalyticsProps) {
  // Mock data for analytics - in real app this would come from API
  const weeklyProgress = [
    { day: "Mon", minutes: 45, lessons: 2 },
    { day: "Tue", minutes: 60, lessons: 3 },
    { day: "Wed", minutes: 30, lessons: 1 },
    { day: "Thu", minutes: 75, lessons: 4 },
    { day: "Fri", minutes: 90, lessons: 3 },
    { day: "Sat", minutes: 120, lessons: 5 },
    { day: "Sun", minutes: 40, lessons: 2 },
  ];

  const monthlyStats = {
    totalMinutes: 1200,
    totalLessons: 45,
    averageDaily: 40,
    streakDays: student.codingStreak,
    improvement: 15, // percentage improvement from last month
  };

  const learningPatterns = {
    mostActiveDay: "Saturday",
    mostActiveTime: "2:00 PM - 4:00 PM",
    averageSessionLength: 35, // minutes
    preferredSubjects: ["Python", "JavaScript"],
  };

  const achievements = [
    {
      title: "Week Warrior",
      description: "Coded 7 days in a row",
      earned: true,
      date: new Date(),
    },
    {
      title: "Python Pioneer",
      description: "Completed 10 Python lessons",
      earned: true,
      date: subDays(new Date(), 3),
    },
    {
      title: "Speed Learner",
      description: "Completed 5 lessons in one day",
      earned: false,
      progress: 80,
    },
    {
      title: "Consistency King",
      description: "30-day coding streak",
      earned: false,
      progress: 50,
    },
  ];

  const getProgressTrend = () => {
    // Mock calculation - would be based on historical data
    return monthlyStats.improvement > 0 ? "up" : "down";
  };

  const maxMinutes = Math.max(...weeklyProgress.map((d) => d.minutes));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Minutes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  This Month
                </p>
                <p className="text-2xl font-bold">
                  {monthlyStats.totalMinutes}m
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getProgressTrend() === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  getProgressTrend() === "up"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {monthlyStats.improvement}%
              </span>
              <span className="text-sm text-muted-foreground">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Completed */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Lessons Done
                </p>
                <p className="text-2xl font-bold">
                  {monthlyStats.totalLessons}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Avg {Math.round(monthlyStats.totalLessons / 30)} per day
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Streak
                </p>
                <p className="text-2xl font-bold">{monthlyStats.streakDays}</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Last active: {format(student.lastCodingActivity, "MMM d")}
            </p>
          </CardContent>
        </Card>

        {/* Average Session */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Session
                </p>
                <p className="text-2xl font-bold">
                  {learningPatterns.averageSessionLength}m
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Optimal length: 30-45m
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">
                      {day.minutes} minutes
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {day.lessons} lessons
                    </span>
                  </div>
                  <Progress
                    value={(day.minutes / maxMinutes) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Most Active Day</p>
                <Badge variant="outline" className="text-sm">
                  {learningPatterns.mostActiveDay}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Peak Learning Time</p>
                <Badge variant="outline" className="text-sm">
                  {learningPatterns.mostActiveTime}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Preferred Subjects</p>
              <div className="flex flex-wrap gap-2">
                {learningPatterns.preferredSubjects.map((subject) => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg border ${
                  achievement.earned
                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : "bg-muted/50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    achievement.earned
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-muted"
                  }`}
                >
                  <Award
                    className={`h-4 w-4 ${
                      achievement.earned
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{achievement.title}</h4>
                    {achievement.earned && (
                      <Badge variant="secondary" className="text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}%
                        </span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  )}
                </div>
                {achievement.earned && achievement.date && (
                  <div className="text-xs text-muted-foreground">
                    {format(achievement.date, "MMM d")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
