"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/lib/images/logo.png";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthHeaderProps {
  mode: "signin" | "signup";
}

export function AuthHeader({ mode }: AuthHeaderProps) {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image src={logo} alt="Beblocky Logo" width={180} height={180} />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={mode === "signin" ? "/sign-up" : "/sign-in"}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
