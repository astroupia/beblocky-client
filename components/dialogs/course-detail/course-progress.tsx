import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress?: number;
}

export function CourseProgress({ progress }: CourseProgressProps) {
  if (!progress) return null;

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Your Progress</h3>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
