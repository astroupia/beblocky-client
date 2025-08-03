"use client";

import type React from "react";

import { AppSidebar, type SidebarNavItem } from "./app-sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "home",
    roles: ["student", "parent", "teacher", "admin"],
  },
  {
    title: "Courses",
    href: "/courses",
    icon: "courses",
    roles: ["student", "parent", "teacher", "admin"],
  },
  {
    title: "Progress",
    href: "/progress",
    icon: "progress",
    label: "New",
    roles: ["parent", "teacher", "admin"],
  },
  {
    title: "Goal",
    href: "/goals",
    icon: "progress",
    label: "New",
    roles: ["student"],
  },
  {
    title: "Upgrade",
    href: "/upgrade",
    icon: "upgrade",
    label: "Pro",
    roles: ["student", "parent"],
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar items={sidebarItems} />

      {/* Main Content */}
      <motion.main
        className="flex-1 overflow-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
}
