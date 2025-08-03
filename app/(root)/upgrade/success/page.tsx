"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Globe,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePayment } from "@/hooks/use-payment";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/lib/api/subscription";

interface PlanInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const planInfo: Record<string, PlanInfo> = {
  starter: {
    id: "starter",
    name: "Starter Plan",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Full mobile experience with engaging puzzles and characters",
  },
  builder: {
    id: "builder",
    name: "Builder Plan",
    icon: <Globe className="h-6 w-6" />,
    description: "Transition to real coding with web technologies",
  },
  pro: {
    id: "pro",
    name: "Pro Bundle",
    icon: <Crown className="h-6 w-6" />,
    description: "Complete family coding solution with premium features",
  },
};

export default function UpgradeSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { createSubscription, getPaymentSession, clearPaymentSession } =
    usePayment();
  const { refreshSubscription } = useSubscription();

  const [loading, setLoading] = useState(true);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);

  const planId = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const plan = planId ? planInfo[planId] : null;

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get payment session from localStorage
        const paymentSession = getPaymentSession();

        if (!paymentSession || !planId) {
          console.error("No payment session found or invalid plan");
          return;
        }

        // Create subscription
        const planName =
          planId === "starter"
            ? "Starter"
            : planId === "builder"
            ? "Builder"
            : planId === "pro"
            ? "Pro-Bundle"
            : "Free";

        const billingCycle = billing === "yearly" ? "yearly" : "monthly";

        // Get plan features based on plan
        const features = getPlanFeatures(planId);

        await createSubscription(
          planName as SubscriptionPlan,
          paymentSession.amount || 0,
          billingCycle as any,
          features
        );

        setSubscriptionCreated(true);

        // Clear payment session
        clearPaymentSession();

        // Refresh subscription data
        refreshSubscription();

        toast({
          title: "Subscription Created!",
          description: `Welcome to ${planName}! Your subscription is now active.`,
        });
      } catch (error) {
        console.error("Error creating subscription:", error);
        toast({
          title: "Error",
          description: "Failed to create subscription. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [
    planId,
    billing,
    createSubscription,
    getPaymentSession,
    clearPaymentSession,
    refreshSubscription,
    toast,
  ]);

  const getPlanFeatures = (planId: string): string[] => {
    switch (planId) {
      case "starter":
        return [
          "Full mobile app access",
          "More puzzles & characters",
          "Progress tracking",
          "Parental dashboard",
          "Email support",
        ];
      case "builder":
        return [
          "Full web access",
          "HTML & CSS courses",
          "Intro Python programming",
          "Real coding projects",
          "Code editor access",
          "Priority support",
        ];
      case "pro":
        return [
          "Mobile + Web access",
          "New projects monthly",
          "Bonus badges & rewards",
          "Multiple child accounts",
          "Advanced progress tracking",
          "Premium support",
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Setting up your subscription...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we activate your plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3 justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
              Payment Successful!
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Thank you for your purchase. Your subscription is now active and
              ready to use.
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Plan Details */}
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {plan.icon}
                    </div>
                    <div>
                      <div>{plan.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        {billing === "yearly" ? "Annual" : "Monthly"} Billing
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium">What&apos;s included:</h4>
                    <ul className="space-y-2">
                      {getPlanFeatures(planId).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Explore your new features</p>
                    <p className="text-sm text-muted-foreground">
                      Start using all the premium features available in your
                      plan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">
                      Set up your children&apos;s accounts
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your children and start their coding journey
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Track progress</p>
                    <p className="text-sm text-muted-foreground">
                      Monitor your children&apos;s learning progress in the
                      dashboard
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link href="/dashboard">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1">
                <Link href="/children">Manage Children</Link>
              </Button>
            </div>

            {/* Support */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-2">
                Need help getting started?
              </p>
              <Button variant="link" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
