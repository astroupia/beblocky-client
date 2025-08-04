"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export function DebugEnv() {
  const [envInfo, setEnvInfo] = useState<{
    NEXT_PUBLIC_API_URL: string | undefined;
    nodeEnv: string | undefined;
  }>({
    NEXT_PUBLIC_API_URL: undefined,
    nodeEnv: undefined,
  });

  const { data: session } = useSession();

  useEffect(() => {
    setEnvInfo({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔧 Debug Info</h3>
      <div className="space-y-1">
        <div>
          <strong>NEXT_PUBLIC_API_URL:</strong>{" "}
          {envInfo.NEXT_PUBLIC_API_URL || "undefined"}
        </div>
        <div>
          <strong>NODE_ENV:</strong> {envInfo.nodeEnv}
        </div>
        <div>
          <strong>Auth Status:</strong> {session ? "authenticated" : "unauthenticated"}
        </div>
        <div>
          <strong>User ID:</strong> {session?.user?.id || "Not logged in"}
        </div>
        <div>
          <strong>User Email:</strong> {session?.user?.email || "N/A"}
        </div>
      </div>
    </div>
  );
}
