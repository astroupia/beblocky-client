"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordDialog } from "@/components/dialogs/forgot-password-dialog";
import { signIn, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (session.data?.user) {
      console.log("User already authenticated, redirecting to /courses");
      window.location.href = "/courses";
    }
  }, [session.data]);

  // Show loading while checking authentication status
  if (session.isPending) {
    return (
      <AuthLayout mode="signin">
        <div className="text-center px-4">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </AuthLayout>
    );
  }

  // Don't render the form if already authenticated
  if (session.data?.user) {
    return (
      <AuthLayout mode="signin">
        <div className="text-center px-4">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting sign-in process for email:", formData.email);

      const result = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      console.log("Sign-in result:", result);

      if ("error" in result && result.error?.message) {
        // Handle specific authentication errors with toast
        const errorMessage = result.error.message;

        if (
          errorMessage.includes("Invalid email") ||
          errorMessage.includes("invalid email")
        ) {
          toast.error("Please enter a valid email address");
        } else if (
          errorMessage.includes("Invalid password") ||
          errorMessage.includes("invalid password")
        ) {
          toast.error("Invalid password. Please try again.");
        } else if (
          errorMessage.includes("User not found") ||
          errorMessage.includes("user not found")
        ) {
          toast.error("No account found with this email address.");
        } else if (
          errorMessage.includes("Email not verified") ||
          errorMessage.includes("email not verified")
        ) {
          toast.error("Please verify your email address before signing in.");
        } else {
          toast.error(errorMessage);
        }

        throw new Error(errorMessage);
      }

      console.log("Sign-in successful, redirecting to /");

      // After successful sign-in, check subscription and redirect accordingly
      toast.success("Signed in successfully!");

      // Redirect to dashboard
      router.push("/");
    } catch (error) {
      console.error("Sign-in failed:", error);

      // Don't set error state if we already handled it with toast
      if (error instanceof Error && !error.message.includes("Invalid email")) {
        setError("Sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // For social auth, we just need to redirect to the auth endpoint
      window.location.href = "/api/auth/github";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with GitHub"
      );
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="signin">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {/* GitHub Sign In */}
            <Button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white border-slate-900 hover:border-slate-800 transition-all duration-300"
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pr-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-slate-600 dark:text-slate-300"
                  >
                    Remember me
                  </Label>
                </div>
                <ForgotPasswordDialog />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
