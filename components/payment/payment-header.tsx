"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const PaymentHeader: React.FC = () => (
  <motion.div
    className="text-center bg-background/95 backdrop-blur-sm pt-4 pb-6 z-10 border-b border-border/50"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
      <Lock className="h-4 w-4" />
      Secure Payment
    </div>
    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      Choose Payment Method
    </h3>
    <p className="text-muted-foreground">
      Select your preferred payment method to continue with your subscription
    </p>
  </motion.div>
);

export default PaymentHeader;
