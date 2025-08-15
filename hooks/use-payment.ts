import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  paymentApi,
  PaymentMethod,
  createArifPayPayload,
} from "@/lib/api/payment";
import { subscriptionApi } from "@/lib/api/subscription";
import type { PaymentRequest, StripeCheckoutRequest } from "@/lib/api/payment";
import {
  SubscriptionPlan,
  BillingCycle,
  SubscriptionStatus,
} from "@/types/subscription";
import type { ICreateSubscriptionDto } from "@/types/subscription";

interface UsePaymentOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export function usePayment(options: UsePaymentOptions = {}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArifPayPayment = async (
    planId: string,
    planName: string,
    amount: number,
    phoneNumber: string,
    isAnnual: boolean = false,
    currency: "USD" | "ETB" | "KES" | "NGN" = "USD"
  ) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      const billingCycle = isAnnual ? "yearly" : "monthly";

      // Use the createArifPayPayload function to ensure correct structure
      const paymentData = createArifPayPayload(
        session.user.id,
        amount,
        phoneNumber,
        planName,
        billingCycle,
        session.user.email,
        currency
      );

      // Override URLs with our specific URLs
      paymentData.cancelUrl = `${baseUrl}/upgrade?status=canceled`;
      paymentData.successUrl = `${baseUrl}/upgrade/success?plan=${planId}&billing=${billingCycle}`;
      paymentData.errorUrl = `${baseUrl}/upgrade?status=error`;
      paymentData.notifyUrl = `${baseUrl}/api/payment/webhook`;

      console.log("🔍 [Payment API] Sending ARIFPAY payload:", paymentData);
      const response = await paymentApi.createArifPayPayment(paymentData);

      console.log("🔍 [Payment Hook] ArifPay response:", response);

      // Check if response is valid
      if (!response || !response.sessionId || !response.paymentUrl) {
        throw new Error("Invalid response from ArifPay API");
      }

      // Store payment session info for later use
      localStorage.setItem(
        "payment_session",
        JSON.stringify({
          sessionId: response.sessionId,
          planId,
          planName,
          amount,
          billingCycle,
          timestamp: Date.now(),
        })
      );

      options.onSuccess?.(response);

      // Redirect to ArifPay checkout
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment creation failed";
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStripePayment = async (
    planId: string,
    planName: string,
    stripePriceId: string,
    isAnnual: boolean = false,
    phoneNumber?: string
  ) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;
      const billingCycle = isAnnual ? "yearly" : "monthly";

      const checkoutData: StripeCheckoutRequest = {
        userId: session.user.id,
        items: [
          {
            name: `${planName} Plan`,
            price: stripePriceId,
            quantity: 1,
            description: `${billingCycle} subscription`,
          },
        ],
        successUrl: `${baseUrl}/upgrade/success?plan=${planId}&billing=${billingCycle}`,
        cancelUrl: `${baseUrl}/upgrade?status=canceled`,
        errorUrl: `${baseUrl}/upgrade?status=error`,
        notifyUrl: `${baseUrl}/api/payment/webhook`,
        phone:
          phoneNumber && phoneNumber.trim()
            ? parseInt(phoneNumber.replace(/\s+/g, ""))
            : 251911234567, // Use provided phone or default
        expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        mode: "subscription", // Set mode to subscription for recurring payments
      };

      const response = await paymentApi.createStripeCheckout(checkoutData);

      console.log("🔍 [Payment Hook] Stripe response:", response);

      // Check if response is valid
      if (!response || !response.sessionId || !response.url) {
        throw new Error("Invalid response from Stripe API");
      }

      // Store payment session info for later use
      localStorage.setItem(
        "payment_session",
        JSON.stringify({
          sessionId: response.sessionId,
          planId,
          planName,
          billingCycle,
          timestamp: Date.now(),
        })
      );

      options.onSuccess?.(response);

      // Redirect to Stripe checkout
      if (response.url) {
        window.location.href = response.url;
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Stripe payment creation failed";
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (
    planName: SubscriptionPlan,
    price: number,
    billingCycle: BillingCycle,
    features: string[] = []
  ) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    setLoading(true);
    setError(null);

    try {
      const startDate = new Date();
      const endDate = new Date();

      // Calculate end date based on billing cycle
      switch (billingCycle) {
        case "monthly":
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case "quarterly":
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case "yearly":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      const subscriptionData: ICreateSubscriptionDto = {
        userId: session.user.id,
        planName,
        status: SubscriptionStatus.ACTIVE,
        startDate,
        endDate,
        autoRenew: true,
        price,
        currency: "USD",
        billingCycle,
        features,
        lastPaymentDate: startDate,
        nextBillingDate: endDate,
      };

      const subscription =
        await subscriptionApi.createSubscription(subscriptionData);

      // Clear payment session from localStorage
      localStorage.removeItem("payment_session");

      options.onSuccess?.(subscription);
      return subscription;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Subscription creation failed";
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentSession = () => {
    const sessionData = localStorage.getItem("payment_session");
    return sessionData ? JSON.parse(sessionData) : null;
  };

  const clearPaymentSession = () => {
    localStorage.removeItem("payment_session");
  };

  return {
    loading,
    error,
    createArifPayPayment,
    createStripePayment,
    createSubscription,
    getPaymentSession,
    clearPaymentSession,
  };
}
