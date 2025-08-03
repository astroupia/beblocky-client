"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  textColor: string;
  showProgress?: boolean;
  progressValue?: number;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  iconColor,
  textColor,
  showProgress = false,
  progressValue,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className={`p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 group`}
      >
        <div className="flex items-center justify-between space-y-0 pb-2">
          <CardTitle className={`text-sm font-medium ${textColor}`}>
            {title}
          </CardTitle>
          <div
            className={`h-8 w-8 rounded-lg ${iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
        <div
          className={`text-2xl font-bold ${textColor
            .replace("300", "200")
            .replace("700", "800")}`}
        >
          {value}
        </div>
        {showProgress && progressValue !== undefined && (
          <Progress value={progressValue} className="mt-2 h-2" />
        )}
        <p
          className={`text-xs ${textColor
            .replace("300", "400")
            .replace("700", "600")}`}
        >
          {description}
        </p>
      </Card>
    </motion.div>
  );
}
