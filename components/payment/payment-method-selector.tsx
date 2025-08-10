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
    paymentData?: ArifPayPaymentData
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

  const validatePhoneNumber = useCallback((phone: string): boolean => {
    const phoneRegex = /^251[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  }, []);

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
      if (provider !== PaymentProvider.ARIFPAY) {
        setPhoneNumber("");
        setPhoneError("");
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
      console.log("🧭 [Payment] Initiating STRIPE payment flow");
      // For Stripe, call onSelect with provider only (no payment data)
      onSelect(selectedProvider);

      console.log("🧭 [Payment] Submitting STRIPE payload for plan:", {
        planName,
        amount,
        billingCycle,
      });
      if (onPaymentInitiated) {
        onPaymentInitiated("https://stripe.example.com/checkout");
      }
    }
  };

  return (
    <div className="space-y-6 h-full max-h-[unset] w-full max-w-full">
      <PaymentHeader />

      <AnimatePresence>
        {selectedProvider === PaymentProvider.ARIFPAY && (
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      <RadioGroup
        value={selectedProvider}
        onValueChange={(value) => handleSelect(value as PaymentProvider)}
        className="space-y-4"
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
