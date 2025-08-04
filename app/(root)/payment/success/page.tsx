"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const planName = searchParams.get("plan");
  const billingCycle = searchParams.get("billing");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Show success message
    toast({
      title: "Payment Successful! 🎉",
      description: `Your ${planName} subscription has been activated.`,
      duration: 5000,
    });

    // Simulate processing time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [planName, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Processing your payment...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-green-600 mb-2">
              Payment Successful!
            </CardTitle>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Welcome to BeBlocky
              </span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {planName && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Subscription Plan
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-base">
                    {planName.charAt(0).toUpperCase() + planName.slice(1)}
                  </Badge>
                  {billingCycle && (
                    <span className="text-sm text-muted-foreground">
                      • {billingCycle}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-1">
              <p>✅ Your subscription has been activated</p>
              <p>✅ You now have access to premium features</p>
              <p>✅ Start coding with BeBlocky!</p>
            </div>

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/courses">Start Learning</Link>
              </Button>
            </div>

            {sessionId && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Transaction ID: {sessionId.slice(-8)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
