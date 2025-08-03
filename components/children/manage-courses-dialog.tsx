"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Trash2,
  Clock,
  Star,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { IStudent, ICourse } from "@/types/dashboard";

interface ManageCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: IStudent | null;
  availableCourses: ICourse[];
  onAddCourse: (childId: string, courseId: string) => Promise<void>;
  onRemoveCourse: (childId: string, courseId: string) => Promise<void>;
}

export function ManageCoursesDialog({
  open,
  onOpenChange,
  child,
  availableCourses,
  onAddCourse,
  onRemoveCourse,
}: ManageCoursesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterEnrollment, setFilterEnrollment] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  if (!child) return null;

  const enrolledCourseIds = child.enrolledCourses || [];

  const filteredCourses = availableCourses.filter((course) => {
    const matchesSearch =
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesLanguage =
      filterLanguage === "all" ||
      course.courseLanguage.toLowerCase() === filterLanguage;

    const isEnrolled = enrolledCourseIds.includes(course._id);
    const matchesEnrollment =
      filterEnrollment === "all" ||
      (filterEnrollment === "enrolled" && isEnrolled) ||
      (filterEnrollment === "available" && !isEnrolled);

    return matchesSearch && matchesLanguage && matchesEnrollment;
  });

  const handleAddCourse = async (courseId: string) => {
    setLoading(courseId);
    try {
      await onAddCourse(child._id, courseId);
    } catch (error) {
      console.error("Error adding course:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    setLoading(courseId);
    try {
      await onRemoveCourse(child._id, courseId);
    } catch (error) {
      console.error("Error removing course:", error);
    } finally {
      setLoading(null);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Manage Courses for {child.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Enrolled Courses</p>
                    <p className="text-2xl font-bold">
                      {enrolledCourseIds.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Available Courses</p>
                    <p className="text-2xl font-bold">
                      {availableCourses.length - enrolledCourseIds.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterLanguage} onValueChange={setFilterLanguage}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="c++">C++</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterEnrollment}
              onValueChange={setFilterEnrollment}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Enrollment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {availableCourses.length}{" "}
            courses
          </p>

          {/* Courses List */}
          <div className="max-h-96 overflow-y-auto">
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledCourseIds.includes(course._id);
                const isLoading = loading === course._id;

                return (
                  <motion.div key={course._id} variants={itemVariants}>
                    <Card
                      className={`transition-all duration-200 hover:shadow-md ${
                        isEnrolled
                          ? "bg-green-50 border-green-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {course.courseTitle}
                              </h3>
                              {isEnrolled && (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Enrolled
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {course.courseLanguage}
                              </span>
                              <Badge variant="outline" className="capitalize">
                                {course.subType}
                              </Badge>
                            </div>

                            {course.courseDescription && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {course.courseDescription}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {course.lessons.length} lessons
                              </span>
                              {course.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  {course.rating}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="ml-4">
                            {isEnrolled ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveCourse(course._id)}
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {isLoading ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddCourse(course._id)}
                                disabled={isLoading}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {isLoading ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Enroll
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
