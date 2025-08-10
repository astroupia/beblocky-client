"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Shield, Check } from "lucide-react";

interface PhoneInputProps {
  phoneNumber: string;
  phoneError: string;
  focusedInput: boolean;
  onPhoneChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  validatePhoneNumber: (phone: string) => boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneNumber,
  phoneError,
  focusedInput,
  onPhoneChange,
  onFocus,
  onBlur,
  validatePhoneNumber,
}) => (
  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
    <CardContent className="p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <Label className="text-base font-semibold">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Required for local payment processing
            </p>
          </div>
        </div>

        <div className="relative">
          <motion.div
            className={`relative transition-all duration-200 ${
              focusedInput ? "scale-[1.02]" : "scale-100"
            }`}
          >
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="2519 00 0000 00"
              value={phoneNumber}
              onChange={(e) => onPhoneChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              className={`pl-10 h-12 text-lg transition-all duration-200 ${
                focusedInput ? "ring-2 ring-primary/20 border-primary/50" : ""
              } ${phoneError ? "border-destructive ring-destructive/20" : ""}`}
              maxLength={12}
              required
            />
            {phoneNumber && validatePhoneNumber(phoneNumber) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {phoneError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive mt-2 flex items-center gap-2"
              >
                <div className="h-1 w-1 rounded-full bg-destructive" />
                {phoneError}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Enter your Ethiopian phone number with country code 251
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PhoneInput;
