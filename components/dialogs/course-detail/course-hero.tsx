import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { ICourse } from "@/types/course";

interface CourseHeroProps {
  course: ICourse;
}

export function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="relative">
      <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-lg flex items-center justify-center">
        <BookOpen className="h-16 w-16 text-primary" />
      </div>
      <Badge
        className="absolute top-4 right-4"
        variant={course.status === "Active" ? "default" : "secondary"}
      >
        {course.status}
      </Badge>
    </div>
  );
}
