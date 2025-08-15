"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Crown, Smartphone, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface CourseEmptyStateProps {
  type: "no-results" | "no-courses";
  onUpgrade?: () => void;
}

export function CourseEmptyState({ type, onUpgrade }: CourseEmptyStateProps) {
  if (type === "no-results") {
    return (
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
    );
  }

  return (
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
              Upgrade your plan to access our complete library of coding courses
              designed for young learners
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
              onClick={onUpgrade}
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
  );
}
