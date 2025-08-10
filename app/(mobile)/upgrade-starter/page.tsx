"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Smartphone, ArrowRight, Lock, Sparkles } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  audience: string;
  description: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  note?: string;
}

const starterPlan: PricingPlan = {
  id: "starter",
  name: "Starter",
  audience: "Ages 6–10",
  description: "Full mobile experience with engaging puzzles and characters",
  monthlyPrice: 6.99,
  annualPrice: 59.99,
  features: [
    "Full mobile app access",
    "More puzzles & characters",
    "Progress tracking",
    "Parental dashboard",
    "Email support",
  ],
  icon: <Smartphone className="h-6 w-6" />,
  gradient:
    "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50",
  note: "Competes directly with Kodable, codeSpark",
};

export default function UpgradeStarterPage() {
  const isAnnual = false; // For this page, we'll default to monthly pricing for simplicity

  const getPrice = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return plan.monthlyPrice;
    return isAnnual ? `$${plan.annualPrice}` : `$${plan.monthlyPrice}`;
  };

  const getPeriod = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return "";
    return isAnnual ? "/year" : "/month";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="text-center mb-10 max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Unlock the Starter Plan
        </h1>
        <p className="text-muted-foreground text-lg mx-auto">
          Get the full mobile experience with engaging puzzles and characters
          for your child.
        </p>
      </motion.div>

      {/* Starter Plan Card */}
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <Card
          className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 relative ring-2 ring-primary`}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-3 py-1">
              Recommended
            </Badge>
          </div>

          <CardHeader className="text-center pb-4">
            <div
              className={`h-16 w-16 rounded-full bg-gradient-to-br ${starterPlan.gradient} flex items-center justify-center mx-auto mb-4 text-primary`}
            >
              {starterPlan.icon}
            </div>
            <CardTitle className="text-xl mb-2">{starterPlan.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              {starterPlan.audience}
            </p>
            <p className="text-xs text-muted-foreground">
              {starterPlan.description}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">
                  {getPrice(starterPlan)}
                </span>
                <span className="text-muted-foreground">
                  {getPeriod(starterPlan)}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {starterPlan.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-start gap-2 text-sm"
                >
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 group shadow-lg"
              size="lg"
              // onClick={() => router.push('/checkout?plan=starter')} // Example: Link to a checkout page
            >
              <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Upgrade to Starter Plan
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {starterPlan.note && (
              <p className="text-xs text-muted-foreground mt-3 text-center italic">
                {starterPlan.note}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Note */}
      <motion.div
        className="mt-10 text-center text-sm text-muted-foreground flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Lock className="h-4 w-4" />
        Your information is secure and encrypted.
      </motion.div>
    </div>
  );
}
