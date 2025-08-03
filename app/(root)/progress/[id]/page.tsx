"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StudentInfo } from "@/components/shared/student-info";
import { Overview } from "@/components/shared/weekly-report";
import {
  Clock,
  Coins,
  Trophy,
  ArrowLeft,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { studentApi } from "@/lib/api/student";
import { useToast } from "@/hooks/use-toast";
import type { IStudent } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProgressData {
  hoursSpent: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  weeklyData: Array<{
    day: string;
    hours: number;
    lessons: number;
  }>;
}

export default function StudentProgressPage() {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<IStudent | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadData(params.id as string);
    }
  }, [params.id]);

  const loadData = async (studentId: string) => {
    try {
      setLoading(true);
      const [userData, progressData] = await Promise.all([
        studentApi.getUser(studentId),
        studentApi.getStudentProgress(studentId),
      ]);

      if (!userData) {
        toast({
          title: "Error",
          description: "Student not found.",
          variant: "destructive",
        });
        return;
      }

      setUser(userData);
      setProgress(progressData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load student data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading student progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !progress) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Student not found</h2>
          <p className="text-muted-foreground">
            The student you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const hoursSpent = progress.hoursSpent || 0;
  const hours = Math.floor(hoursSpent);
  const minutes = Math.round((hoursSpent - hours) * 60);
  const achievements = progress.achievements || [];

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Progress
              </Button>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                {user?.name}'s Progress
              </h1>
              <p className="text-muted-foreground mt-2">
                Detailed learning analytics and achievements
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 space-y-6">
            {/* Time Spending Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Time Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl">
                        <span className="font-bold">{hours}</span>
                        <span>h</span>
                      </p>
                      <p className="text-3xl">
                        <span className="font-bold">{minutes}</span>
                        <span>m</span>
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total learning time
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold">Weekly Data</h3>
                    <Overview />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-primary/10">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Hours Spent
                      </p>
                      <p className="text-2xl font-bold">
                        {hoursSpent.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-primary/10">
                      <Coins className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coins Earned
                      </p>
                      <p className="text-2xl font-bold">{user.coins}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3 bg-primary/10">
                      <Trophy className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Achievements
                      </p>
                      <p className="text-2xl font-bold">
                        {achievements.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievements & Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Trophy className="text-primary" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Coding Streak</p>
                      <p className="text-lg font-bold">
                        {user.codingStreak} days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10">
                      <BookOpen className="text-primary" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Courses Enrolled</p>
                      <p className="text-lg font-bold">
                        {user.enrolledCourses.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Coins className="text-primary" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Total Coins</p>
                      <p className="text-lg font-bold">
                        {user.totalCoinsEarned}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievements List */}
                {achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Achievements</h4>
                    <div className="space-y-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="rounded-full p-2 bg-primary/10">
                            <Trophy className="text-primary" size={16} />
                          </div>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-6">
              <StudentInfo user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
