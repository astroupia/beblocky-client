"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { encryptEmail } from "@/lib/utils";
import type { ICourse } from "@/types/dashboard";

interface CourseCardProps {
  course: ICourse;
  index: number;
  showProgress?: boolean;
}

export function CourseCard({
  course,
  index,
  showProgress = true,
}: CourseCardProps) {
  const { data: session } = useSession();

  const handleCardClick = () => {
    if (session?.user?.email) {
      const encryptedEmail = encryptEmail(session.user.email);
      const courseUrl = `https://ide.beblocky.com/courses/${course._id}/learn/user/${encryptedEmail}`;
      window.open(courseUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className="h-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <Badge
              variant={course.status === "Active" ? "default" : "secondary"}
            >
              {course.status}
            </Badge>
          </div>
          <CardTitle className="text-lg line-clamp-1">
            {course.courseTitle}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.courseDescription}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Language</span>
              <Badge variant="outline">{course.courseLanguage}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>
            {showProgress && course.progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
