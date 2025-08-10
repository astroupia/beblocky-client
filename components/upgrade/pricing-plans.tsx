"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Sparkles, Smartphone, Globe, Crown } from "lucide-react";

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

interface PricingPlansProps {
  pricingPlans: PricingPlan[];
  getPrice: (plan: PricingPlan) => string;
  getPeriod: (plan: PricingPlan) => string;
  onChoosePlan: (planId: string) => void;
}

export function PricingPlans({
  pricingPlans,
  getPrice,
  getPeriod,
  onChoosePlan,
}: PricingPlansProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {pricingPlans.map((plan) => (
        <motion.div key={plan.id} variants={itemVariants}>
          <Card
            className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
              plan.popular ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
            )}

            <CardHeader className={`pt-6 ${plan.popular ? "mt-8" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${plan.gradient}`}
                >
                  {plan.icon}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.audience}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{getPrice(plan)}</span>
                  <span className="text-muted-foreground">
                    {getPeriod(plan)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onChoosePlan(plan.id)}
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    : ""
                }`}
                disabled={plan.id === "free"}
              >
                {plan.id === "free" ? "Current Plan" : "Choose Plan"}
              </Button>

              {plan.note && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  {plan.note}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
