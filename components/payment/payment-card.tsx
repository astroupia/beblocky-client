"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield } from "lucide-react";

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
  processingTime: string;
  popularityBadge?: string;
}

interface PaymentCardProps {
  method: PaymentMethod;
  selected: boolean;
  hovered: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  index: number;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  method,
  selected,
  hovered,
  onHoverStart,
  onHoverEnd,
  index,
}) => (
  <motion.div
    key={method.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
  >
    {/* Use a label to associate the entire card with the hidden radio item */}
    <label htmlFor={`payment-${method.id}`} className="block">
      <Card
        className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
          selected
            ? "ring-2 ring-primary border-primary shadow-lg"
            : "hover:border-primary/30 hover:shadow-sm"
        } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary transform ${
              hovered ? "scale-110" : "scale-100"
            } transition-transform duration-500`}
          />
        </div>

        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RadioGroupItem
                value={method.id}
                id={`payment-${method.id}`}
                disabled={!method.available}
                className="sr-only"
              />

              {/* Icon */}
              <motion.div
                className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary border border-primary/20"
                animate={{
                  scale: selected ? 1.05 : 1,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              >
                {method.icon}
              </motion.div>

              {/* Method Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                  {method.recommended && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {method.popularityBadge || "Recommended"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {method.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {method.processingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                >
                  <Check className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>

        <CardContent className="pt-0 relative px-6">
          <div className="grid grid-cols-4 gap-4">
            {method.features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                className="flex items-center gap-3 text-sm p-4 rounded-lg bg-muted/30"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: featureIndex * 0.05 }}
              >
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                <span className="text-muted-foreground text-sm font-medium">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </label>
  </motion.div>
);

export default PaymentCard;
