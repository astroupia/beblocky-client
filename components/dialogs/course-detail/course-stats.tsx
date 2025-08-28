import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, Target } from "lucide-react";

interface CourseStatsProps {
  rating: number;
  totalHours: number;
  studentsCount: number;
  difficulty: string;
}

export function CourseStats({
  rating,
  totalHours,
  studentsCount,
  difficulty,
}: CourseStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-3">
        <CardContent className="p-0 text-center">
          <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
          <div className="text-lg font-bold">{rating}</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </CardContent>
      </Card>

      <Card className="p-3">
        <CardContent className="p-0 text-center">
          <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold">{totalHours}h</div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </CardContent>
      </Card>

      <Card className="p-3">
        <CardContent className="p-0 text-center">
          <Users className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold">{studentsCount}</div>
          <div className="text-xs text-muted-foreground">Students</div>
        </CardContent>
      </Card>

      <Card className="p-3">
        <CardContent className="p-0 text-center">
          <Target className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <div className="text-lg font-bold">{difficulty}</div>
          <div className="text-xs text-muted-foreground">Level</div>
        </CardContent>
      </Card>
    </div>
  );
}
