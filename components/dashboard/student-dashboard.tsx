"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Coins,
  Target,
  Clock,
  Calendar,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/shared/stats-card";
import { GoalsPlaceholder } from "@/components/shared/goals-placeholder";
import { LanguageLogo } from "@/components/shared/language-logos";
import { CourseCard } from "@/components/shared/course-card";
import type { IStudentDashboardProps } from "@/types/dashboard";

export function StudentDashboard({
  courses,
  stats,
  selectedTab = "overview",
}: IStudentDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatsCard
            title="Enrolled Courses"
            value={stats.totalCourses}
            description="Active learning paths"
            icon={BookOpen}
            gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800"
            iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
            textColor="text-blue-700 dark:text-blue-300"
            delay={0.1}
          />

          <StatsCard
            title="Coding Streak"
            value={`${stats.codingStreak} days`}
            description="Keep it up!"
            icon={Target}
            gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800"
            iconColor="bg-gradient-to-br from-green-500 to-green-600"
            textColor="text-green-700 dark:text-green-300"
            delay={0.2}
          />

          <StatsCard
            title="Total Coins"
            value={stats.totalCoins}
            description="Earned through learning"
            icon={Coins}
            gradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800"
            iconColor="bg-gradient-to-br from-purple-500 to-purple-600"
            textColor="text-purple-700 dark:text-purple-300"
            delay={0.3}
          />

          <StatsCard
            title="Time Spent"
            value={`${Math.floor(stats.timeSpent / 60)}h ${
              stats.timeSpent % 60
            }m`}
            description="Total learning time"
            icon={Clock}
            gradient="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800"
            iconColor="bg-gradient-to-br from-orange-500 to-orange-600"
            textColor="text-orange-700 dark:text-orange-300"
            delay={0.4}
          />
        </motion.div>

        {/* Content based on selected tab */}
        {selectedTab === "overview" && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.averageProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.averageProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course, index) => (
                    <motion.div
                      key={course._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <LanguageLogo
                            language={course.courseLanguage}
                            className="text-white"
                            size={20}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.courseTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course.courseLanguage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.subType}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals Section */}
            <GoalsPlaceholder />
          </motion.div>
        )}

        {selectedTab === "courses" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  showProgress={true}
                />
              ))}
            </div>
          </motion.div>
        )}

        {selectedTab === "children" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Student Dashboard
                </h3>
                <p className="text-muted-foreground">
                  This tab is not available for students.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
