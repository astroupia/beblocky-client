"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";

export function EarlyBirdPromotion() {
  return (
    <motion.div
      className="mb-6 sm:mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 sm:p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold text-orange-800 dark:text-orange-200 mb-1">
                🎉 Early Bird Special - Limited Time!
              </h3>
              <p className="text-sm sm:text-base text-orange-700 dark:text-orange-300">
                Get <strong>5 students for the price of 1</strong> when you
                subscribe in the next 2 months! Perfect for families with
                multiple children. Don't miss this incredible opportunity to
                give all your kids access to premium coding education at an
                unbeatable price.
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-orange-800 dark:text-orange-200">
                80% OFF
              </div>
              <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                Limited Time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
