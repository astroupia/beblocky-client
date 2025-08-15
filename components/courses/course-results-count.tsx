"use client";

import { motion } from "framer-motion";

interface CourseResultsCountProps {
  filteredCount: number;
  totalCount: number;
  loading?: boolean;
  error?: string | null;
}

export function CourseResultsCount({
  filteredCount,
  totalCount,
  loading = false,
  error = null,
}: CourseResultsCountProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-sm sm:text-base text-muted-foreground">
        {totalCount > 0 ? (
          <>
            Showing {filteredCount} of {totalCount} available courses
          </>
        ) : !loading && !error ? (
          "No active courses available"
        ) : null}
      </p>
    </motion.div>
  );
}
