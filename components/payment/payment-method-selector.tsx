"use client";

import type React from "react";
import { useState, useCallback } from "react";
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

interface StripePaymentData {
  phoneNumber: string;
  userId: string;
  amount: number;
  planName: string;
  billingCycle: string;
  email?: string;
}

interface ArifPayPaymentData {
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
      // Keep phone number for both payment methods now
    },
    [onProviderChange]
  );

  const handleContinue = async () => {
    if (!selectedProvider) return;
    console.log(
      "🧭 [Payment] Continue clicked with provider:",
      selectedProvider
    );

    if (selectedProvider === PaymentProvider.ARIFPAY) {
      const cleanPhone = phoneNumber.replace(/\s+/g, "");
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
    } else if (selectedProvider === PaymentProvider.STRIPE) {
      const cleanPhone = phoneNumber.replace(/\s+/g, "");
      if (!cleanPhone.trim()) {
        setPhoneError("Phone number is required for payment verification");
        return;
      }
      if (!validatePhoneNumber(cleanPhone, true)) {
        setPhoneError("Please enter a valid phone number with country code");
        return;
      }

      try {
        setIsProcessing(true);
        setPhoneError("");

        if (!userId || !amount || !planName || !billingCycle) {
          setPhoneError(
            "Missing required payment information. Please try again."
          );
          return;
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const arifPayData: ArifPayPaymentData = {
          phoneNumber: cleanPhone,
          userId,
          amount,
          planName,
          billingCycle,
          email: userEmail,
        };
        console.log("🧭 [Payment] Submitting ARIFPAY payload:", arifPayData);
        // Call onSelect with data only ONCE during continue for ARIFPAY
        onSelect(selectedProvider, arifPayData);

        if (onPaymentInitiated) {
          onPaymentInitiated("https://payment.example.com/checkout");
        }
      } catch (error) {
        setPhoneError("Failed to initiate payment. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else if (selectedProvider === PaymentProvider.STRIPE) {
      const cleanPhone = phoneNumber.replace(/\s+/g, "");
      if (!cleanPhone.trim()) {
        setPhoneError("Phone number is required for payment verification");
        return;
      }
      if (!validatePhoneNumber(cleanPhone, true)) {
        setPhoneError("Please enter a valid phone number with country code");
        return;
      }

      try {
        setIsProcessing(true);
        setPhoneError("");

        if (!userId || !amount || !planName || !billingCycle) {
          setPhoneError(
            "Missing required payment information. Please try again."
          );
          return;
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const stripeData = {
          phoneNumber: cleanPhone,
          userId,
          amount,
          planName,
          billingCycle,
          email: userEmail,
        };

        console.log("🧭 [Payment] Submitting STRIPE payload:", stripeData);
        // For Stripe, call onSelect with provider and phone data
        onSelect(selectedProvider, stripeData);

        if (onPaymentInitiated) {
          onPaymentInitiated("https://stripe.example.com/checkout");
        }
      } catch (error) {
        setPhoneError("Failed to initiate payment. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full max-h-[unset] w-full max-w-full px-4 sm:px-0">
      <PaymentHeader />

      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <PhoneInput
              phoneNumber={phoneNumber}
              phoneError={phoneError}
              focusedInput={focusedInput}
              onPhoneChange={handlePhoneChange}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
              validatePhoneNumber={validatePhoneNumber}
              isInternational={selectedProvider === PaymentProvider.STRIPE}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <RadioGroup
        value={selectedProvider}
        onValueChange={(value) => handleSelect(value as PaymentProvider)}
        className="space-y-3 sm:space-y-4"
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

      <AnimatePresence>
        {selectedProvider && (
          <ContinueButton
            selectedProvider={selectedProvider}
            loading={loading}
            isProcessing={isProcessing}
            phoneNumber={phoneNumber}
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
