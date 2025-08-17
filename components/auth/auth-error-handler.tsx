"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function AuthErrorHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      // Clear the error from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      newUrl.searchParams.delete("error_description");
      window.history.replaceState({}, "", newUrl.toString());

      // Handle different error types with user-friendly messages
      let errorMessage = "Authentication failed. Please try again.";

      switch (error) {
        case "invalid_code":
          errorMessage =
            "Authentication code is invalid or expired. Please try signing in again.";
          break;
        case "unable_to_get_user_info":
          errorMessage =
            "Unable to retrieve user information. Please check your account permissions and try again.";
          break;
        case "access_denied":
          errorMessage =
            "Access was denied. Please allow the required permissions and try again.";
          break;
        case "server_error":
          errorMessage = "Server error occurred. Please try again later.";
          break;
        case "temporarily_unavailable":
          errorMessage =
            "Authentication service is temporarily unavailable. Please try again later.";
          break;
        case "invalid_request":
          errorMessage = "Invalid authentication request. Please try again.";
          break;
        case "unauthorized_client":
          errorMessage =
            "Authentication client is not authorized. Please contact support.";
          break;
        case "unsupported_response_type":
          errorMessage =
            "Unsupported response type. Please try a different sign-in method.";
          break;
        case "invalid_scope":
          errorMessage = "Invalid permissions requested. Please try again.";
          break;
        case "invalid_credentials":
          errorMessage =
            "Invalid credentials. Please check your account and try again.";
          break;
        case "account_not_linked":
          errorMessage =
            "This account is not linked to your profile. Please use the same sign-in method you used to create your account.";
          break;
        case "email_already_exists":
          errorMessage =
            "An account with this email already exists. Please sign in with your existing account.";
          break;
        case "email_not_verified":
          errorMessage = "Please verify your email address before signing in.";
          break;
        default:
          if (errorDescription) {
            errorMessage = errorDescription;
          }
          break;
      }

      // Show error as toast
      toast.error(errorMessage, {
        duration: 5000,
        action: {
          label: "Try Again",
          onClick: () => {
            // Redirect to sign-in page
            router.push("/sign-in");
          },
        },
      });

      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    }
  }, [searchParams, router]);

  return null;
}
