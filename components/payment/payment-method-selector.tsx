"use client";

/**
 * PaymentMethodSelector Component
 *
 * Updated to support the new ArifPay integration requirements:
 * - Phone number is REQUIRED for ArifPay payments
 * - Enhanced payload structure with beneficiaries data
 * - Updated payment methods list
 * - Improved validation and error handling
 *
 * Usage Example:
 * ```tsx
 * <PaymentMethodSelector
 *   userId="user_123456789"
 *   planName="starter"
 *   billingCycle="monthly"
 *   amount={999}
 *   userEmail="user@example.com"
 *   onPaymentInitiated={(paymentUrl) => {
 *     // Handle payment URL - redirect user to checkout
 *     console.log('Redirecting to:', paymentUrl);
 *     window.location.href = paymentUrl;
 *   }}
 *   onSelect={(provider, paymentData) => {
 *     // Optional: Handle payment selection for custom logic
 *     console.log('Payment provider selected:', provider);
 *   }}
 * />
 * ```
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Globe, Check, Phone } from "lucide-react";
import { motion } from "framer-motion";
import {
  createArifPayPayload,
  initiatePaymentFlow,
  PaymentRequest,
} from "@/lib/api/payment";

export enum PaymentProvider {
  ARIFPAY = "arifpay",
  STRIPE = "stripe",
}

interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
  available: boolean;
}

interface PaymentMethodSelectorProps {
  onSelect?: (
    provider: PaymentProvider,
    paymentData?: ArifPayPaymentData
  ) => void;
  onPaymentInitiated?: (paymentUrl: string) => void;
  selectedProvider?: PaymentProvider;
  loading?: boolean;
  userEmail?: string;
  userId: string; // Required
  planName: string; // Required
  billingCycle: string; // Required
  amount: number; // Required
}

interface ArifPayPaymentData {
  phoneNumber: string;
  userId: string;
  amount: number;
  planName: string;
  billingCycle: string;
  email?: string;
}

/**
 * ArifPay Payment Payload Structure (based on integration guide):
 *
 * POST /payment
 * {
 *   userId: string;
 *   amount: number;
 *   cancelUrl: "https://code.beblocky.com/cancel";
 *   successUrl: "https://code.beblocky.com/success?plan=${planName}&billing=${billingCycle}";
 *   errorUrl: "https://code.beblocky.com/error";
 *   notifyUrl: "https://code.beblocky.com/webhook";
 *   phone: number; // REQUIRED - Ethiopian format: 251912345678
 *   email?: string;
 *   paymentMethods: ["TELEBIRR", "AWASH", "AWASH_WALLET", "CBE", "AMOLE", "BOA", "KACHA", "HELLOCASH"];
 *   expireDate: Date; // 24 hours from now
 *   items: [{
 *     name: string;
 *     quantity: 1;
 *     price: number;
 *     description: string;
 *   }];
 *   beneficiaries: {
 *     accountNumber: "1000651652956";
 *     bank: "CBETETAA";
 *     amount: 2;
 *   }
 * }
 *
 * Helper function to create ArifPay payment payload:
 * ```tsx
 * const createArifPayPayload = (paymentData: ArifPayPaymentData) => ({
 *   userId: paymentData.userId,
 *   amount: paymentData.amount,
 *   cancelUrl: "https://code.beblocky.com/cancel",
 *   successUrl: `https://code.beblocky.com/success?plan=${paymentData.planName}&billing=${paymentData.billingCycle}`,
 *   errorUrl: "https://code.beblocky.com/error",
 *   notifyUrl: "https://code.beblocky.com/webhook",
 *   phone: parseInt(paymentData.phoneNumber), // Convert to number
 *   email: paymentData.email,
 *   paymentMethods: ["TELEBIRR", "AWASH", "AWASH_WALLET", "CBE", "AMOLE", "BOA", "KACHA", "HELLOCASH"],
 *   expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
 *   items: [{
 *     name: `${paymentData.planName.charAt(0).toUpperCase() + paymentData.planName.slice(1)} Plan`,
 *     quantity: 1,
 *     price: paymentData.amount,
 *     description: `${paymentData.planName} subscription - ${paymentData.billingCycle} billing`,
 *   }],
 *   beneficiaries: {
 *     accountNumber: "1000651652956",
 *     bank: "CBETETAA",
 *     amount: 2
 *   }
 * });
 * ```
 */

const paymentMethods: PaymentMethod[] = [
  {
    id: PaymentProvider.ARIFPAY,
    name: "Local Payment",
    description: "Pay with Ethiopian payment methods",
    icon: <Smartphone className="h-5 w-5" />,
    features: [
      "Telebirr",
      "Awash Bank",
      "CBE Bank",
      "Amole",
      "BOA Bank",
      "Kacha",
      "HelloCash",
      "Instant processing",
    ],
    recommended: true,
    available: true,
  },
  {
    id: PaymentProvider.STRIPE,
    name: "International Payment",
    description: "Pay with international cards",
    icon: <CreditCard className="h-5 w-5" />,
    features: [
      "Visa",
      "Mastercard",
      "American Express",
      "Secure processing",
      "Global support",
    ],
    available: true,
  },
];

export function PaymentMethodSelector({
  onSelect,
  onPaymentInitiated,
  selectedProvider,
  loading = false,
  userEmail,
  userId,
  planName,
  billingCycle,
  amount,
}: PaymentMethodSelectorProps) {
  // Debug logging to help identify missing props
  console.log("🔍 [PaymentMethodSelector] Props received:", {
    userId: !!userId,
    planName: !!planName,
    billingCycle: !!billingCycle,
    amount: !!amount,
    actualValues: { userId, planName, billingCycle, amount },
  });
  const [hoveredMethod, setHoveredMethod] = useState<PaymentProvider | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate Ethiopian phone number format (REQUIRED for ArifPay)
  const validatePhoneNumber = (phone: string): boolean => {
    // Ethiopian phone number format: 251912345678 (country code + 9 digits)
    // Must start with 251 followed by exactly 9 digits
    const phoneRegex = /^251[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, "")); // Remove any spaces
  };

  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters except for the initial formatting
    const cleanValue = value.replace(/[^\d]/g, "");
    setPhoneNumber(cleanValue);
    setPhoneError("");
  };

  const handleContinue = async () => {
    if (selectedProvider === PaymentProvider.ARIFPAY) {
      const cleanPhone = phoneNumber.replace(/\s+/g, "");

      if (!cleanPhone.trim()) {
        setPhoneError("Phone number is required for local payment");
        return;
      }
      if (!validatePhoneNumber(cleanPhone)) {
        setPhoneError(
          "Please enter a valid Ethiopian phone number (format: 251912345678)"
        );
        return;
      }

      try {
        setIsProcessing(true);
        setPhoneError(""); // Clear any previous errors

        // Validate required props before creating payload
        if (!userId || !amount || !planName || !billingCycle) {
          console.error("❌ [PaymentMethodSelector] Missing required props:", {
            userId: !!userId,
            amount: !!amount,
            planName: !!planName,
            billingCycle: !!billingCycle,
            actualValues: { userId, amount, planName, billingCycle },
          });
          setPhoneError(
            "Missing required payment information. Please try again."
          );
          return;
        }

        // Create ArifPay payment payload
        const paymentPayload = createArifPayPayload(
          userId,
          amount,
          cleanPhone,
          planName,
          billingCycle,
          userEmail
        );

        console.log(
          "🔄 [PaymentMethodSelector] Creating ArifPay payment...",
          paymentPayload
        );

        // Initiate payment flow
        const paymentUrl = await initiatePaymentFlow("arifpay", paymentPayload);

        console.log(
          "✅ [PaymentMethodSelector] Payment URL received:",
          paymentUrl
        );

        // Call the callback with payment data (for backward compatibility)
        if (onSelect) {
          const arifPayData: ArifPayPaymentData = {
            phoneNumber: cleanPhone,
            userId,
            amount,
            planName,
            billingCycle,
            email: userEmail,
          };
          onSelect(selectedProvider, arifPayData);
        }

        // Call the new callback with payment URL
        if (onPaymentInitiated) {
          onPaymentInitiated(paymentUrl);
        } else {
          // Fallback: redirect directly
          console.log(
            "🔄 [PaymentMethodSelector] Redirecting to payment URL..."
          );
          window.location.href = paymentUrl;
        }
      } catch (error) {
        console.error(
          "❌ [PaymentMethodSelector] Payment initiation failed:",
          error
        );
        setPhoneError("Failed to initiate payment. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else if (selectedProvider === PaymentProvider.STRIPE) {
      try {
        // For Stripe, we need to create the checkout session
        // This would typically be handled by the parent component
        if (onSelect) {
          onSelect(selectedProvider);
        }
      } catch (error) {
        console.error(
          "❌ [PaymentMethodSelector] Stripe payment failed:",
          error
        );
        setPhoneError("Failed to initiate payment. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide w-full max-w-lg">
      <div className="text-center mb-6 sticky top-0 bg-background/95 backdrop-blur-sm pt-4 pb-2 z-10">
        <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
        <p className="text-muted-foreground">
          Select your preferred payment method to continue
        </p>
      </div>

      <RadioGroup
        value={selectedProvider}
        onValueChange={(value) => onSelect?.(value as PaymentProvider)}
        className="space-y-4"
      >
        {selectedProvider === PaymentProvider.ARIFPAY && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-destructive">*</span>{" "}
                (Required for Local Payment)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="2519-"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="pl-10"
                  maxLength={12}
                  required
                />
              </div>
              {phoneError && (
                <p className="text-sm text-destructive">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter your Ethiopian phone number with country code 251 (format:
                251912345678)
              </p>
            </div>
          </motion.div>
        )}
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredMethod(method.id)}
            onHoverEnd={() => setHoveredMethod(null)}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedProvider === method.id
                  ? "ring-2 ring-primary border-primary"
                  : "hover:border-primary/50"
              } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => method.available && onSelect?.(method.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      disabled={!method.available}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {method.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {method.name}
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedProvider === method.id && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  {method.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </RadioGroup>

      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 pb-2"
        >
          <Button
            className="w-full"
            size="lg"
            disabled={
              loading ||
              isProcessing ||
              (selectedProvider === PaymentProvider.ARIFPAY &&
                !phoneNumber.trim())
            }
            onClick={handleContinue}
          >
            {loading || isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isProcessing ? "Creating Payment..." : "Processing..."}
              </div>
            ) : (
              `Continue with ${
                selectedProvider === PaymentProvider.ARIFPAY
                  ? "Local Payment"
                  : "International Payment"
              }`
            )}
          </Button>
        </motion.div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
