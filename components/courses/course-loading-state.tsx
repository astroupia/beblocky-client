"use client";

import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseLoadingStateProps {
  loading: boolean;
  sessionLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CourseLoadingState({
  loading,
  sessionLoading = false,
  error = null,
  onRetry,
}: CourseLoadingStateProps) {
  // Loading State
  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <div className="text-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">
            {sessionLoading ? "Loading session..." : "Loading courses..."}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <div className="text-center">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Failed to load courses
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            {error}
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
