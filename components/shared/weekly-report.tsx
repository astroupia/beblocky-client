"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyData {
  day: string;
  hours: number;
  lessons: number;
}

const mockWeeklyData: WeeklyData[] = [
  { day: "Mon", hours: 0.75, lessons: 2 },
  { day: "Tue", hours: 1.0, lessons: 3 },
  { day: "Wed", hours: 0.5, lessons: 1 },
  { day: "Thu", hours: 1.25, lessons: 4 },
  { day: "Fri", hours: 1.5, lessons: 3 },
  { day: "Sat", hours: 2.0, lessons: 5 },
  { day: "Sun", hours: 0.67, lessons: 2 },
];

export function Overview() {
  const maxHours = Math.max(...mockWeeklyData.map((d) => d.hours));

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          {mockWeeklyData.map((day, index) => (
            <div key={day.day} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium">{day.day}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    {day.hours.toFixed(1)}h
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {day.lessons} lessons
                  </span>
                </div>
                <Progress
                  value={(day.hours / maxHours) * 100}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
