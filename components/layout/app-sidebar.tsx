"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { SearchBar } from "./search-bar";
import { UserButton } from "./user-button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { userApi } from "@/lib/api/user";
import type { IUser } from "@/lib/api/user";
import Logo from "@/lib/images/logo.png";
import IconLogo from "@/lib/images/icon-logo.png";

export type SidebarNavItem = {
  title: string;
  label?: string;
  href: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
  useInclude?: boolean;
  roles?: string[]; // Array of roles that can see this item
};

const Icons = {
  home: Home,
  courses: BookOpen,
  children: Users,
  progress: TrendingUp,
  settings: Settings,
  upgrade: CreditCard,
};

interface Props {
  items: SidebarNavItem[];
}

export function AppSidebar({ items }: Props) {
  const path = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);

  // Fetch user data to get the actual role
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        return;
      }

      try {
        const userDataResponse = await userApi.getUserById(session.user.id);
        setUserData(userDataResponse);
      } catch (error) {
        console.error("Failed to fetch user data for sidebar:", error);
      }
    };

    fetchUserData();
  }, [session?.user?.id]);

  // Get role from fetched user data
  const role = userData?.role || "student";

  // Helper to check active link
  const checkActive = (item: SidebarNavItem) => {
    return item.useInclude
      ? path?.includes(item.href ?? "")
      : path === item.href;
  };

  return (
    <div className="flex h-screen">
      <div
        className={cn(
          "flex flex-col bg-card border-r border-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Section */}
        <motion.div
          className="relative p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2",
                isCollapsed && "justify-center"
              )}
            >
              <Image
                src={isCollapsed ? IconLogo : Logo}
                alt="BeBlocky Logo"
                width={isCollapsed ? 40 : 150}
                height={isCollapsed ? 40 : 150}
              />
              {!isCollapsed && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse"
                >
                  BETA
                </Badge>
              )}
            </Link>
          </div>
        </motion.div>

        {/* Search Bar & Theme Toggle */}
        <div className={cn("px-6 pb-4 space-y-4", isCollapsed && "px-2")}>
          {!isCollapsed && <SearchBar />}
          <div
            className={cn(
              "flex items-center justify-between",
              isCollapsed && "justify-center"
            )}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium text-muted-foreground">
                Theme
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-2", isCollapsed ? "px-2" : "px-4")}>
          {items.map((item, index) => {
            // Role-based filtering
            if (item.roles && !item.roles.includes(role)) {
              return null;
            }

            const Icon = Icons[item.icon];
            const isActive = checkActive(item);

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary/10 text-primary border-r-4 border-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                      item.disabled && "cursor-not-allowed opacity-50",
                      isCollapsed && "justify-center px-2"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.label && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Button */}
        <div
          className={cn(
            "border-t border-border overflow-hidden",
            isCollapsed && "px-2"
          )}
        >
          <UserButton isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Collapse Button - Outside Sidebar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-2 rounded-md hover:bg-accent transition-colors border border-border bg-card"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
