"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
