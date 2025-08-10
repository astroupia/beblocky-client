"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { PaymentProvider } from "./payment-card";

interface ContinueButtonProps {
  selectedProvider?: PaymentProvider;
  loading: boolean;
  isProcessing: boolean;
  phoneNumber: string;
  onClick: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  selectedProvider,
  loading,
  isProcessing,
  phoneNumber,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="bg-background/95 backdrop-blur-sm pt-6 pb-4 border-t border-border/50"
  >
    <Button
      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 group shadow-lg"
      size="lg"
      disabled={
        loading ||
        isProcessing ||
        (selectedProvider === PaymentProvider.ARIFPAY && !phoneNumber.trim())
      }
      onClick={onClick}
    >
      <AnimatePresence mode="wait">
        {loading || isProcessing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <div className="absolute inset-0 h-5 w-5 rounded-full border-2 border-transparent border-t-white/50 animate-spin animation-delay-150" />
            </div>
            {isProcessing ? "Creating Payment..." : "Processing..."}
          </motion.div>
        ) : (
          <motion.div
            key="continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Continue with{" "}
            {selectedProvider === PaymentProvider.ARIFPAY
              ? "Local Payment"
              : "International Payment"}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>

    <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-2">
      <Lock className="h-3 w-3" />
      Your payment information is secure and encrypted
    </p>
  </motion.div>
);

export default ContinueButton;
