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
import { Github, Mail, Eye, EyeOff, User, Users } from "lucide-react";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { parentApi } from "@/lib/api/parent";
import { studentApi } from "@/lib/api/student";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const session = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"parent" | "student" | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (session.data?.user) {
      console.log("User already authenticated, redirecting to /courses");
      window.location.href = "/courses";
    }
  }, [session.data]);

  // Cleanup stored role on component unmount
  useEffect(() => {
    return () => {
      // Only clear if user is not authenticated (sign-up was abandoned)
      if (!session.data?.user) {
        localStorage.removeItem("signup_user_role");
        console.log("🎯 [SignUp] Cleaned up stored role on unmount");
      }
    };
  }, [session.data?.user]);

  // Show loading while checking authentication status
  if (session.isPending) {
    return (
      <AuthLayout mode="signup">
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
      <AuthLayout mode="signup">
        <div className="text-center px-4">
          <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </AuthLayout>
    );
  }

  const createUserProfiles = async (userId: string) => {
    setIsCreatingProfile(true);
    try {
      // Get the stored role from localStorage
      const storedRole = localStorage.getItem("signup_user_role");
      const roleToUse = storedRole || userType;

      console.log("🎯 [SignUp] Creating user profiles for userId:", userId);
      console.log("🎯 [SignUp] Stored role from localStorage:", storedRole);
      console.log("🎯 [SignUp] Current userType:", userType);
      console.log("🎯 [SignUp] Final role to use:", roleToUse);
      console.log(
        "🎯 [SignUp] User role:",
        roleToUse === "parent" ? "PARENT" : "STUDENT"
      );

      if (roleToUse === "parent") {
        // Create parent profile using /parents/from-user endpoint
        try {
          console.log("🎯 [SignUp] Calling /parents/from-user endpoint");
          const parentResult = await parentApi.createParentFromUser(userId);
          console.log(
            "🎯 [SignUp] Parent creation API response:",
            parentResult
          );
          toast.success("Parent profile created successfully!");

          // Clear the stored role after successful creation
          localStorage.removeItem("signup_user_role");
        } catch (error) {
          console.error("Failed to create parent profile:", error);
          toast.warning(
            "Account created successfully! Parent profile setup failed. You can complete this later."
          );
        }
      } else if (roleToUse === "student") {
        // Create student profile using /students/from-user endpoint
        try {
          console.log("🎯 [SignUp] Calling /students/from-user endpoint");
          const studentResult = await studentApi.createStudentFromUser(userId);
          console.log(
            "🎯 [SignUp] Student creation API response:",
            studentResult
          );
          toast.success("Student profile created successfully!");

          // Clear the stored role after successful creation
          localStorage.removeItem("signup_user_role");
        } catch (error) {
          console.error("Failed to create student profile:", error);
          toast.warning(
            "Account created successfully! Student profile setup failed. You can complete this later."
          );
        }
      } else {
        console.error("🎯 [SignUp] Invalid role:", roleToUse);
        toast.warning("Account created successfully! Role setup failed.");
      }
    } catch (error) {
      console.error("Failed to create user profiles:", error);

      // Provide specific error messages based on the error type
      if (error instanceof Error) {
        if (
          error.message.includes("500") ||
          error.message.includes("Internal server error")
        ) {
          toast.warning(
            "Account created successfully! Profile setup is temporarily unavailable. You can complete this later from your profile settings."
          );
        } else if (error.message.includes("404")) {
          toast.warning(
            "Account created successfully! Profile setup failed - please contact support."
          );
        } else {
          toast.warning(
            "Account created successfully! Profile setup failed. You can complete this later."
          );
        }
      } else {
        toast.warning(
          "Account created successfully! Profile setup failed. You can complete this later."
        );
      }

      // Don't throw error here - user registration was successful
      // Just log it and continue
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      setError("Please select your account type (Parent or Student)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      console.log(
        "🎯 [SignUp] Starting sign-up process for email:",
        formData.email
      );
      console.log("🎯 [SignUp] Final user type selected:", userType);
      console.log(
        "🎯 [SignUp] Final user role:",
        userType === "parent" ? "PARENT" : "STUDENT"
      );

      // Store the selected role for use after account creation
      localStorage.setItem("signup_user_role", userType);
      console.log("🎯 [SignUp] Stored user role in localStorage:", userType);

      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
      });

      console.log("Sign-up result:", result);

      if ("error" in result && result.error?.message) {
        throw new Error(result.error.message);
      }

      // If signup was successful and we have a user ID, create user profile
      // The user data is nested in result.data.user
      if (
        "data" in result &&
        result.data?.user &&
        typeof result.data.user === "object" &&
        "id" in result.data.user
      ) {
        console.log(
          "🎯 [SignUp] User created successfully, creating profile for role:",
          userType === "parent" ? "PARENT" : "STUDENT"
        );
        console.log("🎯 [SignUp] User object:", result.data.user);

        // Add a small delay to ensure user data is saved in database
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await createUserProfiles(result.data.user.id as string);
      } else {
        console.log(
          "No user ID found in result, skipping teacher profile creation"
        );
        console.log("Result structure:", Object.keys(result || {}));
        if ("data" in result && result.data) {
          console.log("Data structure:", Object.keys(result.data));
        }
      }

      toast.success("Account created successfully! Welcome to the platform.");

      // Use window.location.href for more reliable redirects in deployed environments
      window.location.href = "/courses";

      // Fallback: if window.location.href doesn't work, try router.push
      setTimeout(() => {
        if (window.location.pathname !== "/courses") {
          router.push("/courses");
        }
      }, 1000);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    if (!userType) {
      setError("Please select your account type before continuing with GitHub");
      return;
    }

    console.log(
      "🎯 [SignUp] GitHub sign-up initiated for user type:",
      userType
    );
    console.log(
      "🎯 [SignUp] GitHub sign-up user role:",
      userType === "parent" ? "PARENT" : "STUDENT"
    );

    setIsLoading(true);
    setError("");

    try {
      // Store the selected role for use after GitHub auth
      localStorage.setItem("signup_user_role", userType);
      console.log("🎯 [SignUp] Stored user role for GitHub sign-up:", userType);

      // For social auth, we just need to redirect to the auth endpoint
      // We'll need to handle the user type selection after GitHub auth
      window.location.href = "/api/auth/github";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign up with GitHub"
      );
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="signup">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Create your account
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Join thousands of educators and learners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {/* GitHub Sign Up */}
            <Button
              onClick={handleGithubSignUp}
              disabled={isLoading || !userType}
              variant="outline"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white border-slate-900 hover:border-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* User Type Selection */}
            {!userType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">I am a...</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your role to get started
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
                      onClick={() => {
                        console.log("🎯 [SignUp] User selected: PARENT");
                        setUserType("parent");
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                          <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Parent</h3>
                        <p className="text-sm text-muted-foreground">
                          I want my children to learn coding through this
                          platform
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
                      onClick={() => {
                        console.log("🎯 [SignUp] User selected: STUDENT");
                        setUserType("student");
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                          <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Student</h3>
                        <p className="text-sm text-muted-foreground">
                          I want to learn coding and programming skills
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Email Sign Up Form */}
            {userType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        userType === "parent"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-purple-100 dark:bg-purple-900/20"
                      }`}
                    >
                      {userType === "parent" ? (
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <span className="font-medium">
                      {userType === "parent" ? "Parent" : "Student"} Account
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log(
                        "🎯 [SignUp] User changing account type from:",
                        userType
                      );
                      setUserType(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Change
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

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
                        placeholder="Create a password"
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pr-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-slate-600 dark:text-slate-300"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isCreatingProfile}
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
                    ) : isCreatingProfile ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Setting up profiles...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
