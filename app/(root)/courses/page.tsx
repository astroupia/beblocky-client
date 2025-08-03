"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { CourseDetailsDialog } from "@/components/dialogs/course-detail-dialog";
import type { ICourse } from "@/types/dashboard";
import { CourseSubscriptionType } from "@/types/dashboard";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { LanguageLogo } from "@/components/shared/language-logos";

export default function CoursesPage() {
  console.log("🎯 [CoursesPage] Component rendering...");

  const { data: session, isPending: sessionLoading } = useSession();
  const { courses, loading, error, refetch } = useCourses();

  console.log("🎯 [CoursesPage] Session:", session);
  console.log("🎯 [CoursesPage] Session loading:", sessionLoading);
  console.log("🎯 [CoursesPage] Hook returned:", { courses, loading, error });
  console.log("🎯 [CoursesPage] Courses length:", courses?.length);
  console.log("🎯 [CoursesPage] Courses data:", courses);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userType: "student" | "parent" = "parent";

  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "all" || course.courseLanguage === selectedLanguage;
    const matchesLevel =
      selectedLevel === "all" || course.subType === selectedLevel;

    return matchesSearch && matchesLanguage && matchesLevel;
  });

  console.log("🎯 [CoursesPage] Filtered courses:", filteredCourses);
  console.log("🎯 [CoursesPage] Search term:", searchTerm);
  console.log("🎯 [CoursesPage] Selected language:", selectedLanguage);
  console.log("🎯 [CoursesPage] Selected level:", selectedLevel);

  const handleCourseClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const handleEnroll = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
    // Handle enrollment logic
  };

  const handleAddToPlan = (courseId: string) => {
    console.log("Adding course to plan:", courseId);
    // Handle add to plan logic
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  console.log("🎯 [CoursesPage] Rendering with state:", {
    sessionLoading,
    loading,
    error,
    coursesCount: courses?.length,
    filteredCount: filteredCourses.length,
  });

  return (
    <div className="container mx-auto p-6">
      {/* Loading State */}
      {(sessionLoading || loading) && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {sessionLoading ? "Loading session..." : "Loading courses..."}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load courses
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading and no error */}
      {!sessionLoading && !loading && !error && (
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                  Explore Courses
                </h1>
                <p className="text-muted-foreground mt-2">
                  Discover amazing coding courses designed for young learners
                </p>
              </div>
              <Button className="gap-2">
                <BookOpen className="h-4 w-4" />
                View All
              </Button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Scratch">Scratch</SelectItem>
                <SelectItem value="React Native">React Native</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value={CourseSubscriptionType.FREE}>
                  Free
                </SelectItem>
                <SelectItem value={CourseSubscriptionType.STARTER}>
                  Starter
                </SelectItem>
                <SelectItem value={CourseSubscriptionType.BUILDER}>
                  Builder
                </SelectItem>
                <SelectItem value={CourseSubscriptionType.PRO}>
                  Pro Bundle
                </SelectItem>
                <SelectItem value={CourseSubscriptionType.ORGANIZATION}>
                  Organization
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              Showing {filteredCourses.length} of {courses?.length || 0} courses
            </p>
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course._id} variants={itemVariants}>
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <LanguageLogo
                          language={course.courseLanguage}
                          className="text-white"
                          size={24}
                        />
                      </div>
                      <Badge
                        variant={
                          course.subType === CourseSubscriptionType.FREE
                            ? "secondary"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {course.subType}
                      </Badge>
                    </div>
                    <CardTitle
                      className="text-lg font-semibold group-hover:text-primary transition-colors"
                      onClick={() => handleCourseClick(course)}
                    >
                      {course.courseTitle}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.courseDescription}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.courseLanguage}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">
                            {course.rating?.toFixed(1) || "4.5"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>2-3 hours</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>1.2k students</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCourseClick(course)}
                        >
                          View Details
                        </Button>
                        {userType === "parent" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToPlan(course._id)}
                          >
                            Add to Plan
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEnroll(course._id)}
                          >
                            Enroll
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredCourses.length === 0 && courses && courses.length > 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Course Details Dialog */}
      <CourseDetailsDialog
        course={selectedCourse}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userType={userType}
        onEnroll={handleEnroll}
        onAddToPlan={handleAddToPlan}
      />
    </div>
  );
}
