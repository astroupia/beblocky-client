import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Globe, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ICourse } from "@/types/course";

interface CourseDetailsProps {
  course: ICourse;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const features = [
    "Interactive coding exercises",
    "Step-by-step tutorials",
    "Real-world projects",
    "Progress tracking",
    "Certificate of completion",
  ];

  const difficulty =
    course.courseLanguage === "HTML"
      ? "Beginner"
      : course.courseLanguage === "Python"
        ? "Intermediate"
        : "Advanced";

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-4">
        <CardContent className="p-0">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            What You&apos;ll Learn
          </h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardContent className="p-0">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Course Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Language</span>
              <Badge variant="outline">{course.courseLanguage}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Subscription
              </span>
              <Badge variant="secondary">{course.subType}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Difficulty</span>
              <span className="text-sm font-medium">{difficulty}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <span className="text-sm">{formatDate(course.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
