"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Smartphone } from "lucide-react";

// Import extracted components
import PaymentHeader from "./payment-header";
import PhoneInput from "./phone-input";
import PaymentCard, { PaymentProvider } from "./payment-card";
import ContinueButton from "./continue-button";

interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
  available: boolean;
  processingTime: string;
  popularityBadge?: string;
}

interface PaymentMethodSelectorProps {
  onProviderChange?: (provider: PaymentProvider) => void;
  onSelect: (
    provider: PaymentProvider,
    paymentData?: ArifPayPaymentData | StripePaymentData
  ) => void;
  onPaymentInitiated?: (paymentUrl: string) => void;
  selectedProvider?: PaymentProvider;
  loading?: boolean;
  userEmail?: string;
  userId: string;
  planName: string;
  billingCycle: string;
  amount: number;
}

export interface StripePaymentData {
  phoneNumber: string;
  userId: string;
  amount: number;
  planName: string;
  billingCycle: string;
  email?: string;
}

export interface ArifPayPaymentData {
  phoneNumber: string;
  userId: string;
  amount: number;
  planName: string;
  billingCycle: string;
  email?: string;
}

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
    processingTime: "Instant",
    popularityBadge: "Most Popular",
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
    processingTime: "1-2 minutes",
  },
];

export { PaymentProvider };

export function PaymentMethodSelector({
  onProviderChange,
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
  const [hoveredMethod, setHoveredMethod] = useState<PaymentProvider | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const phoneSectionRef = useRef<HTMLDivElement | null>(null);

  // Normalize plan name so we always send the selected plan label
  const normalizedPlanName = (() => {
    if (!planName) return "";
    const idToName: Record<string, string> = {
      free: "Free",
      starter: "Starter",
      builder: "Builder",
      pro: "Pro Bundle",
      "pro-bundle": "Pro Bundle",
      probundle: "Pro Bundle",
    };
    const raw = planName.trim();
    const stripped = raw.endsWith(" Plan") ? raw.slice(0, -5) : raw;
    const lower = stripped.toLowerCase();
    return idToName[lower] || stripped;
  })();

  const validatePhoneNumber = useCallback(
    (phone: string, isInternational: boolean = false): boolean => {
      if (isInternational) {
        // International phone validation - basic format check
        const internationalRegex = /^\+?[1-9]\d{1,14}$/;
        return internationalRegex.test(phone.replace(/\s+/g, ""));
      } else {
        // Ethiopian phone validation
        const phoneRegex = /^251[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ""));
      }
    },
    []
  );

  const handlePhoneChange = useCallback((value: string) => {
    const cleanValue = value.replace(/[^\d]/g, "");
    setPhoneNumber(cleanValue);
    setPhoneError("");
  }, []);

  const handleSelect = useCallback(
    (provider: PaymentProvider) => {
      console.log("🧭 [Payment] Provider selected:", provider);
      // Only inform parent that provider changed; don't trigger payment
      onProviderChange?.(provider);
      // Auto-scroll to phone input when ArifPay is selected (mobile and desktop)
      if (
        provider === PaymentProvider.ARIFPAY &&
        typeof window !== "undefined"
      ) {
        setTimeout(() => {
          if (containerRef.current && phoneSectionRef.current) {
            const container = containerRef.current;
            const target = phoneSectionRef.current;
            const top = target.offsetTop - 16;
            container.scrollTo({ top, behavior: "smooth" });
          } else if (phoneSectionRef.current) {
            phoneSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 150);
      }
    },
    [onProviderChange]
  );

  const handleContinue = async () => {
    if (!selectedProvider) return;
    console.log(
      "🧭 [Payment] Continue clicked with provider:",
      selectedProvider
    );

    try {
      setIsProcessing(true);
      setPhoneError("");

      if (!userId || !amount || !planName || !billingCycle) {
        setPhoneError(
          "Missing required payment information. Please try again."
        );
        return;
      }

      const cleanPhone = phoneNumber.replace(/\s+/g, "");

      if (selectedProvider === PaymentProvider.ARIFPAY) {
        if (!cleanPhone.trim()) {
          setPhoneError("Phone number is required for local payment");
          return;
        }
        if (!validatePhoneNumber(cleanPhone, false)) {
          setPhoneError(
            "Please enter a valid Ethiopian phone number (format: 251912345678)"
          );
          return;
        }

        const arifPayData: ArifPayPaymentData = {
          phoneNumber: cleanPhone,
          userId,
          amount,
          planName: normalizedPlanName,
          billingCycle,
          email: userEmail,
        };
        console.log("🧭 [Payment] Submitting ARIFPAY payload:", arifPayData);
        onSelect(selectedProvider, arifPayData);

        if (onPaymentInitiated) {
          onPaymentInitiated("https://payment.example.com/checkout");
        }
      } else if (selectedProvider === PaymentProvider.STRIPE) {
        // No phone number required for international payments
        const stripeData: StripePaymentData = {
          phoneNumber: "", // Empty string for international payments
          userId,
          amount,
          planName: normalizedPlanName,
          billingCycle,
          email: userEmail,
        };

        console.log("🧭 [Payment] Submitting STRIPE payload:", stripeData);
        onSelect(selectedProvider, stripeData);

        if (onPaymentInitiated) {
          onPaymentInitiated("https://stripe.example.com/checkout");
        }
      }
    } catch (error) {
      console.error("🧭 [Payment] Error during payment initiation:", error);
      setPhoneError("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="space-y-4 sm:space-y-6 h-full max-h-[unset] w-full max-w-full overflow-y-auto scrollbar-hide"
    >
      <PaymentHeader />

      <RadioGroup
        value={selectedProvider}
        onValueChange={(value) => handleSelect(value as PaymentProvider)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
      >
        {paymentMethods.map((method, index) => (
          <PaymentCard
            key={method.id}
            method={method}
            selected={selectedProvider === method.id}
            hovered={hoveredMethod === method.id}
            onHoverStart={() => setHoveredMethod(method.id)}
            onHoverEnd={() => setHoveredMethod(null)}
            index={index}
          />
        ))}
      </RadioGroup>

      {/* Phone Input - Only for ArifPay (Local Payment) */}
      <AnimatePresence>
        {selectedProvider === PaymentProvider.ARIFPAY && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
            ref={phoneSectionRef}
          >
            <PhoneInput
              phoneNumber={phoneNumber}
              phoneError={phoneError}
              focusedInput={focusedInput}
              onPhoneChange={handlePhoneChange}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              validatePhoneNumber={validatePhoneNumber}
              isInternational={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProvider && (
          <ContinueButton
            selectedProvider={selectedProvider}
            loading={loading}
            isProcessing={isProcessing}
            phoneNumber={
              selectedProvider === PaymentProvider.ARIFPAY ? phoneNumber : ""
            }
            onClick={handleContinue}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          display: none;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
}
