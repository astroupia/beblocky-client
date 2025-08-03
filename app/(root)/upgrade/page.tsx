"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Users,
  Smartphone,
  Globe,
  Award,
  Shield,
  ArrowLeft,
  Sparkles,
  Crown,
  Building,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePayment } from "@/hooks/use-payment";
import { useSubscription } from "@/hooks/use-subscription";
import {
  PaymentMethodSelector,
  PaymentProvider,
} from "@/components/payment/payment-method-selector";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types/subscription";
import { useSession } from "@/lib/auth-client";

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

export default function UpgradePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPaymentProvider, setSelectedPaymentProvider] =
    useState<PaymentProvider | null>(null);

  const { toast } = useToast();
  const {
    loading: paymentLoading,
    createArifPayPayment,
    createStripePayment,
  } = usePayment({
    onSuccess: (response) => {
      // Redirect to payment URL
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else if (response.url) {
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

  const getPrice = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return plan.monthlyPrice;
    return isAnnual ? `$${plan.annualPrice}` : `$${plan.monthlyPrice}`;
  };

  const getPeriod = (plan: PricingPlan) => {
    if (typeof plan.monthlyPrice === "string") return "";
    return isAnnual ? "/year" : "/month";
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
      // Handle free plan - redirect to dashboard
      window.location.href = "/dashboard";
      return;
    }

    // Check if user already has this plan
    const planName =
      planId === "starter"
        ? "Starter"
        : planId === "builder"
        ? "Builder"
        : planId === "pro"
        ? "Pro-Bundle"
        : "Free";

    if (hasActiveSubscription(planName as SubscriptionPlan)) {
      toast({
        title: "Already Subscribed",
        description: `You already have an active ${planName} subscription.`,
      });
      return;
    }

    setSelectedPlan(planId);
    setShowPaymentSelector(true);
  };

  const handlePaymentMethodSelect = async (
    provider: PaymentProvider,
    phoneNumber?: string
  ) => {
    if (!selectedPlan || selectedPlan === "free") return;

    setSelectedPaymentProvider(provider);

    try {
      const planName =
        selectedPlan === "starter"
          ? "Starter"
          : selectedPlan === "builder"
          ? "Builder"
          : selectedPlan === "pro"
          ? "Pro-Bundle"
          : "Free";

      const amount = isAnnual
        ? (pricingPlans.find((p) => p.id === selectedPlan)
            ?.annualPrice as number)
        : (pricingPlans.find((p) => p.id === selectedPlan)
            ?.monthlyPrice as number);

      if (provider === PaymentProvider.ARIFPAY) {
        if (!phoneNumber) {
          toast({
            title: "Error",
            description: "Phone number is required for local payment",
            variant: "destructive",
          });
          return;
        }
        await createArifPayPayment(
          selectedPlan,
          planName,
          amount,
          phoneNumber,
          isAnnual
        );
      } else {
        // For Stripe, you'll need to provide the actual Stripe price IDs
        const stripePriceId = getStripePriceId(selectedPlan, isAnnual);
        await createStripePayment(
          selectedPlan,
          planName,
          stripePriceId,
          isAnnual
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const getStripePriceId = (planId: string, isAnnual: boolean): string => {
    // These would be your actual Stripe price IDs
    const stripePriceIds: Record<string, { monthly: string; annual: string }> =
      {
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

    const plan = stripePriceIds[planId];
    return isAnnual ? plan?.annual || "" : plan?.monthly || "";
  };

  return (
    <div className="container mx-auto p-6">
      {/* Loading State */}
      {sessionLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {!sessionLoading && (
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border rounded-lg p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3 justify-center md:justify-start">
                  <Crown className="h-8 w-8 text-primary" />
                  Choose Your Learning Plan
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Unlock your child's coding potential with our comprehensive
                  learning plans designed for every age and skill level
                </p>
              </div>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              className={`text-sm ${
                !isAnnual ? "font-medium" : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={`text-sm ${
                isAnnual ? "font-medium" : "text-muted-foreground"
              }`}
            >
              Annual
            </span>
            <Badge variant="secondary" className="ml-2">
              Save up to 30%
            </Badge>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={plan.id} variants={itemVariants}>
                <Card
                  className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                    plan.popular ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`h-16 w-16 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-4 text-primary`}
                    >
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">
                      {plan.audience}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold">
                          {getPrice(plan)}
                        </span>
                        <span className="text-muted-foreground">
                          {getPeriod(plan)}
                        </span>
                      </div>
                      {isAnnual && getSavings(plan) && (
                        <p className="text-sm text-green-600 mt-1">
                          Save {getSavings(plan)}%
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
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
                      className={`w-full ${
                        plan.popular ? "bg-primary hover:bg-primary/90" : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleChoosePlan(plan.id)}
                      disabled={paymentLoading}
                    >
                      {paymentLoading && selectedPlan === plan.id ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </div>
                      ) : plan.id === "free" ? (
                        "Get Started"
                      ) : (
                        "Choose Plan"
                      )}
                    </Button>

                    {plan.note && (
                      <p className="text-xs text-muted-foreground mt-3 text-center italic">
                        {plan.note}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* School Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-800">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white">
                    <Building className="h-8 w-8" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">School Plan</h3>
                    <p className="text-muted-foreground mb-4">
                      Perfect for schools and organizations with multiple seats,
                      progress tracking, and dashboard access
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Multiple seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Progress tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Dashboard access</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Custom pricing
                    </p>
                    <Button className="gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Sales
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Reach out for volume licenses / LMS integrations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you choose the perfect plan for your
              child's learning journey.
            </p>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
          </motion.div>
        </div>
      )}

      {/* Payment Method Selector Modal */}
      {showPaymentSelector && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentSelector(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Complete Your Purchase</h3>
              <p className="text-muted-foreground text-sm">
                {selectedPlan && (
                  <>
                    {pricingPlans.find((p) => p.id === selectedPlan)?.name} Plan
                    -{isAnnual ? " Annual" : " Monthly"} billing
                  </>
                )}
              </p>
            </div>

            <PaymentMethodSelector
              onSelect={handlePaymentMethodSelect}
              selectedProvider={selectedPaymentProvider || undefined}
              loading={paymentLoading}
              userEmail={session?.user?.email}
            />

            {session?.user && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Logged in as: {session.user.email}
                </p>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowPaymentSelector(false)}
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
