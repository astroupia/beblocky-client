"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);

      if (event.error?.message?.includes("Invalid email")) {
        toast.error("Please enter a valid email address");
      } else if (event.error?.message?.includes("OAuth")) {
        toast.error("Authentication failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Global promise rejection caught:", event.reason);

      if (event.reason?.message?.includes("Invalid email")) {
        toast.error("Please enter a valid email address");
      } else if (event.reason?.message?.includes("OAuth")) {
        toast.error("Authentication failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
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
