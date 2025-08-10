"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Crown, Sparkles, Smartphone, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePayment } from "@/hooks/use-payment";
import { useSubscription } from "@/hooks/use-subscription";
import {
  PaymentMethodSelector,
  PaymentProvider,
} from "@/components/payment/payment-method-selector";
import { ArifPayPaymentData } from "@/lib/api/payment";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types/subscription";
import { useSession } from "@/lib/auth-client";
import { EarlyBirdPromotion } from "@/components/upgrade/early-bird-promotion";
import { CurrencyStudentSelector } from "@/components/upgrade/currency-student-selector";
import { PricingPlans } from "@/components/upgrade/pricing-plans";
import { SchoolPlan } from "@/components/upgrade/school-plan";
import { FAQSection } from "@/components/upgrade/faq-section";

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

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    audience: "Ages 6–10",
    description: "Perfect for getting started with basic coding concepts",
    monthlyPrice: "Free",
    annualPrice: "Free",
    features: [
      "Limited access to mobile app levels",
      "Basic blocks (similar to Scratch/Blockly)",
      "Intro level content",
      "Community support",
    ],
    icon: <Sparkles className="h-6 w-6" />,
    gradient:
      "from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50",
    note: "Similar to Scratch / Blockly / intro levels",
  },
  {
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
  },
  {
    id: "builder",
    name: "Builder",
    audience: "Ages 8–14",
    description: "Transition to real coding with web technologies",
    monthlyPrice: 9.99,
    annualPrice: 89.99,
    features: [
      "Full web access",
      "HTML & CSS courses",
      "Intro Python programming",
      "Real coding projects",
      "Code editor access",
      "Priority support",
    ],
    popular: true,
    icon: <Globe className="h-6 w-6" />,
    gradient:
      "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50",
    note: "Competes with Tynker, CodeCombat, etc.",
  },
  {
    id: "pro",
    name: "Pro Bundle",
    audience: "Families / Siblings",
    description: "Complete family coding solution with premium features",
    monthlyPrice: 13.99,
    annualPrice: 119.99,
    features: [
      "Mobile + Web access",
      "New projects monthly",
      "Bonus badges & rewards",
      "Multiple child accounts",
      "Advanced progress tracking",
      "Premium support",
    ],
    icon: <Crown className="h-6 w-6" />,
    gradient:
      "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50",
    note: "Bundle encourages upsell; undercuts Tynker Premium",
  },
];

// Currency conversion rates
const currencyRates = {
  USD: 1,
  ETB: 160,
  KES: 129.2,
  NGN: 1531.87,
};

const currencySymbols = {
  USD: "$",
  ETB: "ETB ",
  KES: "KES ",
  NGN: "₦",
};

export default function UpgradePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPaymentProvider, setSelectedPaymentProvider] =
    useState<PaymentProvider | null>(null);
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof currencyRates>("USD");
  const [studentCount, setStudentCount] = useState(1);

  const { toast } = useToast();
  const {
    loading: paymentLoading,
    createArifPayPayment,
    createStripePayment,
  } = usePayment({
    onSuccess: (response: any) => {
      // Redirect to payment URL
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else if (response?.url) {
        window.location.href = response.url;
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { hasActiveSubscription } = useSubscription();

  const convertPrice = (price: number | string): string => {
    if (typeof price === "string") return price;

    const convertedPrice = price * currencyRates[selectedCurrency];
    const symbol = currencySymbols[selectedCurrency];

    if (selectedCurrency === "USD") {
      return `${symbol}${convertedPrice.toFixed(2)}`;
    } else {
      return `${symbol}${Math.round(convertedPrice)}`;
    }
  };

  const getPrice = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return plan.monthlyPrice;
    const basePrice = plan.monthlyPrice as number;
    const totalPrice = basePrice * studentCount;
    return convertPrice(totalPrice);
  };

  const getPeriod = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return "";
    return "/month per student";
  };

  const getSavings = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return null;
    const monthlyTotal = (plan.monthlyPrice as number) * 12;
    const annualPrice = plan.annualPrice as number;
    const savings = monthlyTotal - annualPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const handleChoosePlan = (planId: string) => {
    if (planId === "free") {
      toast({
        title: "Free Plan Selected",
        description: "You're already on the free plan!",
      });
      return;
    }

    setSelectedPlan(planId);
    setShowPaymentSelector(true);
  };

  const handlePaymentMethodSelect = async (
    provider: PaymentProvider,
    paymentData?: ArifPayPaymentData
  ) => {
    if (!selectedPlan || selectedPlan === "free") {
      toast({
        title: "Invalid Plan",
        description: "Please select a valid plan to continue.",
        variant: "destructive",
      });
      return;
    }

    setSelectedPaymentProvider(provider);

    try {
      if (provider === "arifpay") {
        const plan = pricingPlans.find((p) => p.id === selectedPlan)!;
        const amount =
          typeof plan.monthlyPrice === "number"
            ? plan.monthlyPrice * studentCount
            : 0;
        await createArifPayPayment(
          selectedPlan,
          "Plan",
          amount,
          paymentData!.phoneNumber,
          false
        );
        // Close the dialog after successful payment initiation
        setShowPaymentSelector(false);
      } else if (provider === "stripe") {
        const priceId = getStripePriceId(selectedPlan, false);
        await createStripePayment(selectedPlan, "Plan", priceId, false);
        // Close the dialog after successful payment initiation
        setShowPaymentSelector(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const getStripePriceId = (planId: string, isAnnual: boolean): string => {
    // This would be replaced with actual Stripe price IDs
    const priceIds: Record<string, { monthly: string; annual: string }> = {
      starter: {
        monthly: "price_starter_monthly",
        annual: "price_starter_annual",
      },
      builder: {
        monthly: "price_builder_monthly",
        annual: "price_builder_annual",
      },
      pro: {
        monthly: "price_pro_monthly",
        annual: "price_pro_annual",
      },
    };

    const plan = priceIds[planId];
    if (!plan) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    return isAnnual ? plan.annual : plan.monthly;
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3 justify-center">
              <Crown className="h-8 w-8 text-primary" />
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Unlock the full potential of coding education for your children
            </p>
          </div>
        </div>
      </motion.div>

      {/* Early Bird Promotion */}
      <EarlyBirdPromotion />

      {/* Currency Toggle and Student Counter */}
      <CurrencyStudentSelector
        selectedCurrency={selectedCurrency}
        onCurrencyChange={(value: keyof typeof currencyRates) =>
          setSelectedCurrency(value)
        }
        studentCount={studentCount}
        onStudentCountChange={setStudentCount}
      />

      {/* Pricing Plans */}
      <PricingPlans
        pricingPlans={pricingPlans}
        getPrice={getPrice}
        getPeriod={getPeriod}
        onChoosePlan={handleChoosePlan}
      />

      {/* School Plan */}
      <SchoolPlan />

      {/* Payment Method Selector Dialog */}
      <Dialog open={showPaymentSelector} onOpenChange={setShowPaymentSelector}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 overflow-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Choose Payment Method</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <PaymentMethodSelector
              onProviderChange={(p) => setSelectedPaymentProvider(p)}
              onSelect={handlePaymentMethodSelect}
              loading={paymentLoading}
              selectedProvider={selectedPaymentProvider || undefined}
              userId={session?.user?.id || ""}
              planName={selectedPlan}
              billingCycle="monthly"
              amount={
                typeof pricingPlans.find((p) => p.id === selectedPlan)
                  ?.monthlyPrice === "number"
                  ? (pricingPlans.find((p) => p.id === selectedPlan)
                      ?.monthlyPrice as number) * studentCount
                  : 0
              }
              userEmail={session?.user?.email}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
