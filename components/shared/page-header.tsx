"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  showBackBtn?: boolean;
  title?: string;
}

export function PageHeader({ showBackBtn = false, title }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {showBackBtn && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
    </div>
  );
}
