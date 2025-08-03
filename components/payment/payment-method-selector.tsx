"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Smartphone, Globe, Check, Phone } from "lucide-react";
import { motion } from "framer-motion";

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
  onSelect: (provider: PaymentProvider, phoneNumber?: string) => void;
  selectedProvider?: PaymentProvider;
  loading?: boolean;
  userEmail?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: PaymentProvider.ARIFPAY,
    name: "Local Payment",
    description: "Pay with Ethiopian payment methods",
    icon: <Smartphone className="h-5 w-5" />,
    features: ["Telebirr", "Awash Bank", "CBE", "Amole", "Instant processing"],
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
  selectedProvider,
  loading = false,
  userEmail,
}: PaymentMethodSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<PaymentProvider | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Validate Ethiopian phone number format
  const validatePhoneNumber = (phone: string): boolean => {
    // Ethiopian phone number format: 251912345678 (country code + 9 digits)
    const phoneRegex = /^251[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");
  };

  const handleContinue = () => {
    if (selectedProvider === PaymentProvider.ARIFPAY) {
      if (!phoneNumber.trim()) {
        setPhoneError("Phone number is required for local payment");
        return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        setPhoneError(
          "Please enter a valid Ethiopian phone number (e.g., 251912345678)"
        );
        return;
      }
      onSelect(selectedProvider, phoneNumber);
    } else {
      onSelect(selectedProvider);
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
        onValueChange={(value) => onSelect(value as PaymentProvider)}
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
                Phone Number (Required for Local Payment)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="251912345678"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="pl-10"
                  maxLength={12}
                />
              </div>
              {phoneError && (
                <p className="text-sm text-destructive">{phoneError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter your Ethiopian phone number with country code (e.g.,
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
              onClick={() => method.available && onSelect(method.id)}
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
              (selectedProvider === PaymentProvider.ARIFPAY &&
                !phoneNumber.trim())
            }
            onClick={handleContinue}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
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
