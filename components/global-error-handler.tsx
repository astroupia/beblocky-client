"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("Invalid email")) {
        toast.error("Please enter a valid email address");
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes("Invalid email")) {
        toast.error("Please enter a valid email address");
      }
    };

    // Add event listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  // This component doesn't render anything
  return null;
}
