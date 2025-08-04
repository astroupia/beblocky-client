"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  useEffect(() => {
    toast({
      title: "Payment Failed",
      description:
        "There was an issue processing your payment. Please try again.",
      variant: "destructive",
      duration: 5000,
    });

    // Set error details if available
    if (errorMessage) {
      setErrorDetails(errorMessage);
    } else if (errorCode) {
      setErrorDetails(`Error code: ${errorCode}`);
    }
  }, [errorCode, errorMessage, toast]);

  const getErrorMessage = () => {
    if (errorCode === "insufficient_funds") {
      return "Insufficient funds in your account.";
    }
    if (errorCode === "invalid_card") {
      return "Invalid card details provided.";
    }
    if (errorCode === "network_error") {
      return "Network connection issue. Please check your internet connection.";
    }
    return (
      errorDetails || "An unexpected error occurred during payment processing."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-red-600 mb-2">
              Payment Failed
            </CardTitle>
            <p className="text-muted-foreground">{getErrorMessage()}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Common solutions:
              </p>
              <div className="text-sm space-y-1 text-left">
                <p>• Check your internet connection</p>
                <p>• Verify your payment details</p>
                <p>• Ensure sufficient funds/credit</p>
                <p>• Try a different payment method</p>
                <p>• Contact your bank if needed</p>
              </div>
            </div>

            {errorDetails && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 font-mono">{errorDetails}</p>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/upgrade">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="text-xs text-muted-foreground">
                Still having issues?
              </p>
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href="/support">Contact Support</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href="tel:+251911234567">
                    <Phone className="mr-1 h-3 w-3" />
                    Call Us
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentErrorContent />
    </Suspense>
  );
}
