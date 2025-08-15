"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CourseHeaderProps {
  title?: string;
  description?: string;
}

export function CourseHeader({
  title = "Explore Courses",
  description = "Discover amazing coding courses designed for young learners",
}: CourseHeaderProps) {
  return (
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
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
