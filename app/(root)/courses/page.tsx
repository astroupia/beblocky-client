"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Crown,
  Smartphone,
  Globe,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CourseDetailsDialog } from "@/components/dialogs/course-detail-dialog";
import { EnrollmentDialog } from "@/components/dialogs/enrollment-dialog";
import type { ICourse } from "@/types/course";
import { CourseSubscriptionType } from "@/types/course";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { LanguageLogo } from "@/components/shared/language-logos";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/use-subscription";
import { CourseStatus } from "@/types/course";
import { lessonApi } from "@/lib/api/lesson";
import { canAccessCourse } from "@/lib/utils/subscription-hierarchy";
import { userApi } from "@/lib/api/user";
import { studentApi } from "@/lib/api/student";
import { progressApi } from "@/lib/api/progress";
import { courseApi } from "@/lib/api/course";
import { toast } from "sonner";
import { encryptEmail } from "@/lib/utils";

export default function CoursesPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { courses, loading, error, refetch } = useCourses();
  const { subscription } = useSubscription();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState<ICourse | null>(
    null
  );
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<string[]>([]);
  const [courseDurations, setCourseDurations] = useState<
    Record<string, number>
  >({});
  const [courseStudents, setCourseStudents] = useState<Record<string, number>>(
    {}
  );
  const [userRole, setUserRole] = useState<string>("student");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [enrollmentMap, setEnrollmentMap] = useState<Record<string, boolean>>(
    {}
  );

  // Determine user type based on role
  const userType: "student" | "parent" =
    userRole === "parent" ? "parent" : "student";

  // Filter only active courses
  const activeCourses = useMemo(() => {
    if (!courses) return [];
    console.log(
      "🔍 [activeCourses] All courses before status filtering:",
      courses
    );
    courses.forEach((course, index) => {
      console.log(`🔍 [activeCourses] Course ${index} status:`, {
        title: course.courseTitle,
        status: course.status,
        isActive: course.status === CourseStatus.ACTIVE,
        statusValue: CourseStatus.ACTIVE,
      });
    });
    return courses.filter((course) => course.status === CourseStatus.ACTIVE);
  }, [courses]);

  // Group courses by plan (all active courses)
  const coursesByPlan = useMemo(() => {
    if (!activeCourses) return {};

    const grouped = activeCourses.reduce(
      (acc: Record<string, ICourse[]>, course) => {
        const plan = course.subType || CourseSubscriptionType.FREE;
        if (!acc[plan]) {
          acc[plan] = [];
        }
        acc[plan].push(course);
        return acc;
      },
      {}
    );

    return grouped;
  }, [activeCourses]);

  // Filter courses within each plan
  const filteredCoursesByPlan = useMemo(() => {
    console.log("🔍 [filteredCoursesByPlan] Starting filtering with:", {
      searchTerm,
      selectedLanguage,
      selectedPlan,
      coursesByPlanKeys: Object.keys(coursesByPlan),
    });

    const filtered: Record<string, ICourse[]> = {};

    Object.entries(coursesByPlan).forEach(([plan, planCourses]) => {
      console.log(
        `🔍 [filteredCoursesByPlan] Processing plan "${plan}" with ${planCourses.length} courses`
      );

      const filteredCourses = planCourses.filter((course) => {
        const matchesSearch =
          course.courseTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.courseDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesLanguage =
          selectedLanguage === "all" ||
          course.courseLanguage === selectedLanguage;
        const matchesPlan =
          selectedPlan === "all" || course.subType === selectedPlan;

        const passes = matchesSearch && matchesLanguage && matchesPlan;

        if (!passes) {
          console.log(
            `🔍 [filteredCoursesByPlan] Course "${course.courseTitle}" filtered out:`,
            {
              matchesSearch,
              matchesLanguage,
              matchesPlan,
              courseSubType: course.subType,
              selectedPlan,
            }
          );
        }

        return passes;
      });

      console.log(
        `🔍 [filteredCoursesByPlan] Plan "${plan}" after filtering: ${filteredCourses.length} courses`
      );

      if (filteredCourses.length > 0) {
        filtered[plan] = filteredCourses;
      }
    });

    console.log("🔍 [filteredCoursesByPlan] Final filtered result:", filtered);
    return filtered;
  }, [coursesByPlan, searchTerm, selectedLanguage, selectedPlan]);

  const planConfig = {
    [CourseSubscriptionType.FREE]: {
      name: "Free Plan",
      description: "Perfect for getting started with basic coding concepts",
      icon: <Sparkles className="h-5 w-5" />,
      gradient:
        "from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50",
      color: "text-gray-600",
      badgeVariant: "secondary" as const,
    },
    [CourseSubscriptionType.STARTER]: {
      name: "Starter Plan",
      description:
        "Full mobile experience with engaging puzzles and characters",
      icon: <Smartphone className="h-5 w-5" />,
      gradient:
        "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
      color: "text-blue-600",
      badgeVariant: "default" as const,
    },
    [CourseSubscriptionType.BUILDER]: {
      name: "Builder Plan",
      description: "Transition to real coding with web technologies",
      icon: <Globe className="h-5 w-5" />,
      gradient:
        "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
      color: "text-green-600",
      badgeVariant: "default" as const,
    },
    [CourseSubscriptionType.PRO]: {
      name: "Pro Bundle",
      description: "Complete learning experience with advanced features",
      icon: <Crown className="h-5 w-5" />,
      gradient:
        "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
      color: "text-purple-600",
      badgeVariant: "default" as const,
    },
    // Add fallback for any unknown plan types
    unknown: {
      name: "Other",
      description: "Additional courses",
      icon: <Sparkles className="h-5 w-5" />,
      gradient:
        "from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50",
      color: "text-gray-600",
      badgeVariant: "secondary" as const,
    },
    [CourseSubscriptionType.ORGANIZATION]: {
      name: "Organization",
      description: "Enterprise solutions for schools and organizations",
      icon: <Building className="h-5 w-5" />,
      gradient:
        "from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50",
      color: "text-orange-600",
      badgeVariant: "default" as const,
    },
  };

  const togglePlanExpansion = (plan: string) => {
    setExpandedPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  // Initialize expanded plans with all available plans
  useEffect(() => {
    const availablePlans = Object.keys(coursesByPlan);
    if (availablePlans.length > 0) {
      setExpandedPlans(availablePlans);
    }
  }, [coursesByPlan]);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user?.id) return;

      try {
        const userData = await userApi.getUserById(session.user.id);
        setUserRole(userData.role || "student");
        // Resolve student id for enrollment checks (only for students)
        if (userData.role === "student") {
          try {
            const student = await studentApi.getStudentByUserId(
              session.user.id
            );
            setStudentId(student._id);
          } catch {
            setStudentId(null);
          }
        } else {
          setStudentId(null);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole("student");
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  // Fetch lesson data for all courses
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!activeCourses || activeCourses.length === 0) return;

      const durations: Record<string, number> = {};
      const students: Record<string, number> = {};

      for (const course of activeCourses) {
        try {
          // Fetch lesson data for duration
          const lessons = await lessonApi.getLessonsByCourse(course._id);
          const totalMinutes = lessons.reduce(
            (sum, lesson) => sum + (Number(lesson.duration) || 0),
            0
          );
          const hours =
            totalMinutes > 0 ? Math.max(1, Math.round(totalMinutes / 60)) : 2;
          durations[course._id] = hours;

          // Calculate students count
          const count = Array.isArray((course as any).students)
            ? ((course as any).students as string[]).length
            : 0;
          students[course._id] = count;
        } catch (error) {
          console.warn("Failed to fetch data for course:", course._id, error);
          durations[course._id] = 2;
          students[course._id] = 0;
        }
      }

      setCourseDurations(durations);
      setCourseStudents(students);
    };

    fetchCourseData();
  }, [activeCourses]);

  // Resolve per-course enrollment status using silent progress check
  useEffect(() => {
    const resolveEnrollment = async () => {
      if (!studentId || !activeCourses || activeCourses.length === 0) return;
      const entries = await Promise.all(
        activeCourses.map(async (course) => {
          try {
            const progress = await progressApi.getStudentCourseProgressSilently(
              studentId,
              course._id
            );
            return [course._id, !!progress] as const;
          } catch {
            return [course._id, false] as const;
          }
        })
      );
      const map: Record<string, boolean> = {};
      for (const [id, enrolled] of entries) map[id] = enrolled;
      setEnrollmentMap(map);
    };
    resolveEnrollment();
  }, [studentId, activeCourses]);

  const handleCourseClick = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const openIdeForCourse = (courseId: string) => {
    if (!session?.user?.email) return;
    const encryptedEmail = encryptEmail(session.user.email);
    const courseUrl = `https://ide.beblocky.com/courses/${courseId}/learn/user/${encryptedEmail}`;
    window.open(courseUrl, "_blank");
  };

  const handleEnroll = async (courseId: string) => {
    const course = activeCourses.find((c) => c._id === courseId);
    if (!course) return;

    // If we already know it's enrolled, go straight to IDE
    if (enrollmentMap[courseId]) {
      openIdeForCourse(courseId);
      return;
    }

    // Double check silently in case the map hasn't resolved yet
    if (studentId) {
      try {
        const progress = await progressApi.getStudentCourseProgressSilently(
          studentId,
          courseId
        );
        if (progress) {
          setEnrollmentMap((prev) => ({ ...prev, [courseId]: true }));
          openIdeForCourse(courseId);
          return;
        }
      } catch {}
    }

    // Not enrolled yet – open enrollment dialog
    setEnrollmentCourse(course);
    setIsEnrollmentDialogOpen(true);
  };

  const handleAddToPlan = (courseId: string) => {
    console.log("Adding course to plan:", courseId);
    // Redirect to upgrade page
    router.push("/upgrade");
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
    activeCoursesCount: activeCourses?.length,
    filteredCount: Object.values(filteredCoursesByPlan).flat().length,
    userPlan: subscription?.planName || "Free",
    shouldShowUpgradePrompt:
      !loading && !error && (!activeCourses || activeCourses.length === 0),
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Loading State */}
      {(sessionLoading || loading) && (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <div className="text-center">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              {sessionLoading ? "Loading session..." : "Loading courses..."}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Failed to load courses
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Content - Only show when not loading and no error */}
      {!sessionLoading && !loading && !error && (
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-4 sm:p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  Explore Courses
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  Discover amazing coding courses designed for young learners
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col gap-3 sm:gap-4"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full">
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

              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
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
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm sm:text-base text-muted-foreground">
              {activeCourses && activeCourses.length > 0 ? (
                <>
                  Showing {Object.values(filteredCoursesByPlan).flat().length}{" "}
                  of {activeCourses.length} available courses
                </>
              ) : !loading && !error ? (
                "No active courses available"
              ) : null}
            </p>
          </motion.div>

          {/* Courses by Plan */}
          <div className="space-y-6 sm:space-y-8">
            {Object.entries(filteredCoursesByPlan).map(
              ([plan, planCourses]) => {
                const config =
                  planConfig[plan as CourseSubscriptionType] ||
                  planConfig["unknown"];
                const isExpanded = expandedPlans.includes(plan);

                console.log(
                  `🔍 [Rendering] Plan: ${plan}, Config found: ${!!config}, Courses: ${
                    planCourses.length
                  }`
                );

                return (
                  <motion.div
                    key={plan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card
                      className={`bg-gradient-to-r ${config.gradient} border-0 shadow-lg`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg bg-white/80 dark:bg-black/20 ${config.color}`}
                            >
                              {config.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold">
                                {config.name}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {config.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={config.badgeVariant}
                              className="text-sm"
                            >
                              {planCourses.length} courses
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePlanExpansion(plan)}
                              className="p-2"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {planCourses.map((course) => (
                                  <motion.div
                                    key={course._id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    <Card
                                      className="h-full shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white/80 dark:bg-black/20 backdrop-blur-sm"
                                      onClick={() => handleCourseClick(course)}
                                    >
                                      <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <LanguageLogo
                                              language={course.courseLanguage}
                                              className="text-white"
                                              size={20}
                                            />
                                          </div>
                                          <Badge
                                            variant={config.badgeVariant}
                                            className="text-xs"
                                          >
                                            {course.subType}
                                          </Badge>
                                        </div>
                                        <CardTitle
                                          className="text-sm sm:text-base font-semibold group-hover:text-primary transition-colors line-clamp-2"
                                          onClick={() =>
                                            handleCourseClick(course)
                                          }
                                        >
                                          {course.courseTitle}
                                        </CardTitle>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                          {course.courseDescription}
                                        </p>
                                      </CardHeader>

                                      <CardContent className="pt-0">
                                        <div className="space-y-3">
                                          <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                                              <span>
                                                {course.courseLanguage}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                                              <span className="font-medium">
                                                {course.rating?.toFixed(1) ||
                                                  "4.5"}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                              <span>
                                                {courseDurations[course._id] ||
                                                  2}
                                                h
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                              <span>
                                                {courseStudents[course._id] ||
                                                  0}{" "}
                                                students
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                            <Button
                                              size="sm"
                                              className="flex-1"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleCourseClick(course);
                                              }}
                                            >
                                              View Details
                                            </Button>
                                            {userType === "parent"
                                              ? // Parent logic: Show Add to Plan only if course is not covered by subscription
                                                (() => {
                                                  const userPlan =
                                                    subscription?.planName ||
                                                    null;
                                                  const isCovered =
                                                    canAccessCourse(
                                                      userPlan as any,
                                                      course.subType
                                                    );
                                                  return !isCovered ? (
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToPlan(
                                                          course._id
                                                        );
                                                      }}
                                                    >
                                                      Add to Plan
                                                    </Button>
                                                  ) : null;
                                                })()
                                              : // Student logic: show Enrolled if progress exists, otherwise Enroll if accessible
                                                (() => {
                                                  const userPlan =
                                                    subscription?.planName ||
                                                    null;
                                                  const canAccess =
                                                    canAccessCourse(
                                                      userPlan as any,
                                                      course.subType
                                                    );
                                                  const isEnrolled =
                                                    !!enrollmentMap[course._id];

                                                  if (isEnrolled) {
                                                    return (
                                                      <Badge
                                                        variant="secondary"
                                                        className="px-3 py-1"
                                                      >
                                                        Enrolled
                                                      </Badge>
                                                    );
                                                  }

                                                  return canAccess ? (
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEnroll(
                                                          course._id
                                                        );
                                                      }}
                                                    >
                                                      Enroll
                                                    </Button>
                                                  ) : null;
                                                })()}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* Empty State */}
          {Object.keys(filteredCoursesByPlan).length === 0 &&
            courses &&
            courses.length > 0 && (
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

          {/* No Courses Available - Upgrade Prompt */}
          {!loading &&
            !error &&
            (!activeCourses || activeCourses.length === 0) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-6 sm:p-12">
                    <div className="mb-4 sm:mb-6">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mx-auto mb-3 sm:mb-4">
                        <Crown className="h-8 w-8 sm:h-10 sm:w-10" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4 text-center">
                        Unlock More Courses
                      </h2>
                      <p className="text-sm sm:text-lg text-muted-foreground mb-4 sm:mb-6 text-center">
                        Upgrade your plan to access our complete library of
                        coding courses designed for young learners
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-black/20">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-1">
                          Mobile Apps
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Interactive coding games
                        </p>
                      </div>
                      <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-black/20">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-1">
                          Web Development
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          HTML, CSS, JavaScript
                        </p>
                      </div>
                      <div className="text-center p-3 sm:p-4 rounded-lg bg-white/50 dark:bg-black/20">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-1">
                          Advanced Projects
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Real-world applications
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => router.push("/upgrade")}
                        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      >
                        <Crown className="h-4 w-4" />
                        Upgrade Now
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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

      {/* Enrollment Dialog */}
      <EnrollmentDialog
        course={enrollmentCourse}
        isOpen={isEnrollmentDialogOpen}
        onClose={() => {
          setIsEnrollmentDialogOpen(false);
          setEnrollmentCourse(null);
        }}
        onEnrollmentSuccess={() => {
          if (enrollmentCourse) {
            setEnrollmentMap((prev) => ({
              ...prev,
              [enrollmentCourse._id]: true,
            }));
          }
        }}
      />
    </div>
  );
}
