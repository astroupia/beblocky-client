// Payment Types based on payment_gateway_integration.md
export enum PaymentMethod {
  TELEBIRR = "TELEBIRR",
  AWASH = "AWASH",
  AWASH_WALLET = "AWASH_WALLET",
  PSS = "PSS",
  CBE = "CBE",
  AMOLE = "AMOLE",
  BOA = "BOA",
  KACHA = "KACHA",
  TELEBIRR_USSD = "TELEBIRR_USSD",
  HELLOCASH = "HELLOCASH",
  MPESSA = "MPESSA",
}

export enum PaymentStatus {
  PENDING = "pending",
  FAILED = "failed",
  CANCELED = "canceled",
  EXPIRED = "expired",
  UNAUTHORIZED = "unauthorized",
  SUCCESS = "SUCCESS",
}

export interface PaymentItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
  image?: string;
}

export interface Beneficiary {
  accountNumber: string;
  bank: string;
  amount: number;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  cancelUrl: string;
  phone: number;
  email: string;
  errorUrl: string;
  notifyUrl: string;
  successUrl: string;
  paymentMethods: PaymentMethod[];
  expireDate: string; // Changed to string to match the format
  items: PaymentItem[];
  lang: string;
  // Removed: nonce, beneficiaries, transactionStatus, transactionId, sessionId
}

export interface PaymentResponse {
  sessionId: string;
  transactionId?: string;
  paymentUrl: string;
  cancelUrl?: string;
}

// ArifPay specific response structure
export interface ArifPayApiResponse {
  error: boolean;
  msg: string;
  data: {
    sessionId: string;
    paymentUrl: string;
    cancelUrl?: string;
  };
}

export interface PaymentDocument {
  _id: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  items: PaymentItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ArifPayPaymentData {
  phoneNumber: string;
  userId: string;
  amount: number;
  planName: string;
  billingCycle: string;
  email?: string;
}

// Stripe Types
export interface StripeCheckoutRequest {
  userId: string;
  items: {
    name: string;
    price: string;
    quantity: number;
    description?: string;
  }[];
  successUrl: string;
  cancelUrl: string;
  errorUrl: string;
  notifyUrl: string;
  phone: number;
  expireDate: string;
  mode?: "payment" | "subscription"; // Add mode parameter for subscription support
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

export interface UpdatePaymentStatusRequest {
  uuid?: string;
  nonce?: string;
  phone?: number;
  transactionStatus?: PaymentStatus;
  paymentStatus?: string;
  totalAmount?: number;
  transaction?: {
    transactionId: string;
    transactionStatus: string;
  };
  notificationUrl?: string;
  sessionId?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Simple API client for payment operations
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function simpleFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("🌐 [Payment API] Making request to:", url);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    console.log("🌐 [Payment API] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [Payment API] Error Response:", errorText);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ [Payment API] Success Response:", data);
    return data;
  } catch (error) {
    console.error("❌ [Payment API] Request failed:", error);
    throw error;
  }
}

export class PaymentApi {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const data = await simpleFetch<any>(endpoint, options);

      // If the response is already an array, wrap it in the expected format
      if (Array.isArray(data)) {
        console.log(
          "✅ [Payment API] Wrapping array response in expected format"
        );
        return {
          data: data as T,
          success: true,
          message: "Payments fetched successfully",
        } as ApiResponse<T>;
      }

      // If the response has the expected ApiResponse structure, return it as is
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        "success" in data
      ) {
        console.log("✅ [Payment API] Response has ApiResponse structure");
        return data as ApiResponse<T>;
      }

      // If the response has ArifPay structure (error, msg, data), extract the data
      if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        "msg" in data &&
        "data" in data
      ) {
        console.log("✅ [Payment API] Response has ArifPay structure");
        return {
          data: data.data as T,
          success: !data.error,
          message: data.msg,
        } as ApiResponse<T>;
      }

      // If the response is the data directly (like Stripe response), wrap it
      console.log(
        "✅ [Payment API] Wrapping direct response in ApiResponse format"
      );
      return {
        data: data as T,
        success: true,
        message: "Request successful",
      } as ApiResponse<T>;
    } catch (error) {
      console.error("❌ [Payment API] Request failed:", error);
      throw error;
    }
  }

  // POST /payment - Create new payment (ArifPay)
  static async createPayment(
    paymentData: PaymentRequest
  ): Promise<ApiResponse<PaymentResponse>> {
    console.log(
      "🚀 [Payment API] Creating payment with payload:",
      JSON.stringify(paymentData, null, 2)
    );
    return this.request<PaymentResponse>("/payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  // GET /payment/:userId - Get user's payments
  static async getUserPayments(
    userId: string
  ): Promise<ApiResponse<PaymentDocument[]>> {
    return this.request<PaymentDocument[]>(`/payment/${userId}`, {
      method: "GET",
    });
  }

  // POST /stripe/stripe-checkout - Create Stripe checkout session
  static async createStripeCheckout(
    checkoutData: StripeCheckoutRequest
  ): Promise<ApiResponse<StripeCheckoutResponse>> {
    return this.request<StripeCheckoutResponse>("/stripe/stripe-checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
  }

  // POST /payment/responseStatus - Update payment status (webhook)
  static async updatePaymentStatus(
    statusData: UpdatePaymentStatusRequest
  ): Promise<ApiResponse<void>> {
    return this.request<void>("/payment/responseStatus", {
      method: "POST",
      body: JSON.stringify(statusData),
    });
  }
}

// Helper functions for payment URLs
export const createPaymentUrls = (planName: string, billingCycle: string) => {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://code.beblocky.com";

  return {
    cancelUrl: `${baseUrl}/payment/cancel`,
    successUrl: `${baseUrl}/payment/success?plan=${planName}&billing=${billingCycle}`,
    errorUrl: `${baseUrl}/payment/error`,
    notifyUrl: `${API_BASE_URL}/payment/responseStatus`, // Backend webhook
  };
};

// Helper function to create ArifPay payment payload
export const createArifPayPayload = (
  userId: string,
  amount: number,
  phoneNumber: string,
  planName: string,
  billingCycle: string,
  email?: string,
  currency: "USD" | "ETB" | "KES" | "NGN" = "USD"
): PaymentRequest => {
  // Validate required parameters
  if (!userId || !amount || !phoneNumber || !planName || !billingCycle) {
    throw new Error(
      `Missing required parameters: userId=${!!userId}, amount=${!!amount}, phoneNumber=${!!phoneNumber}, planName=${!!planName}, billingCycle=${!!billingCycle}`
    );
  }

  // Validate phone number format
  const cleanPhoneNumber = phoneNumber.replace(/\s+/g, "");
  if (!/^251[0-9]{9}$/.test(cleanPhoneNumber)) {
    console.warn(
      `⚠️ [ArifPay] Invalid phone number format: ${phoneNumber}. Expected format: 251xxxxxxxxx`
    );
  }

  // Ensure email is provided
  if (!email) {
    console.warn(`⚠️ [ArifPay] Email not provided for user: ${userId}`);
  }

  const urls = createPaymentUrls(planName, billingCycle);

  // Safely format plan name with fallback
  const formattedPlanName =
    planName && planName.length > 0
      ? `${planName.charAt(0).toUpperCase()}${planName.slice(1)}`
      : "Premium";

  // Convert amount to ETB for local payments (ArifPay)
  const currencyRates = {
    USD: 1,
    ETB: 160,
    KES: 129.2,
    NGN: 1531.87,
  };

  // For local payments (ArifPay), always convert to ETB
  // The amount parameter is expected to be in USD, so we convert it to ETB
  const etbAmount = Math.round(amount * currencyRates.ETB);

  console.log(
    `🔍 [ArifPay] Converting amount: ${amount} USD to ${etbAmount} ETB`
  );

  const payload = {
    userId,
    amount: etbAmount, // Total amount in ETB
    cancelUrl: urls.cancelUrl,
    phone: parseInt(cleanPhoneNumber),
    email: email || `user_${userId}@beblocky.com`, // Ensure email is always provided
    errorUrl: urls.errorUrl,
    notifyUrl: urls.notifyUrl,
    successUrl: urls.successUrl,
    paymentMethods: [
      PaymentMethod.TELEBIRR,
      PaymentMethod.AWASH,
      PaymentMethod.AWASH_WALLET,
      PaymentMethod.PSS,
      PaymentMethod.CBE,
      PaymentMethod.AMOLE,
      PaymentMethod.BOA,
      PaymentMethod.KACHA,
      PaymentMethod.TELEBIRR_USSD,
      PaymentMethod.HELLOCASH,
      PaymentMethod.MPESSA,
    ],
    expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        name: `${formattedPlanName} Plan`,
        quantity: 1,
        price: etbAmount, // Price in ETB for the items array
        description: `${formattedPlanName} ${billingCycle} subscription for BeBlocky`,
        image:
          "https://code.beblocky.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon-logo.55ac8515.png&w=96&q=75",
      },
    ],
    lang: "EN",
  };

  console.log(
    "🔍 [ArifPay Payload] Generated payload:",
    JSON.stringify(payload, null, 2)
  );
  return payload;
};

// Helper function to handle payment flow
export const initiatePaymentFlow = async (
  provider: "arifpay" | "stripe",
  paymentData: any
): Promise<string> => {
  try {
    if (provider === "arifpay") {
      console.log("🔄 [Payment Flow] Initiating ArifPay payment...");
      const response = await paymentApi.createPayment(paymentData);
      console.log("✅ [Payment Flow] ArifPay payment created:", response);

      // Return the payment URL for redirect
      return response.paymentUrl;
    } else if (provider === "stripe") {
      console.log("🔄 [Payment Flow] Initiating Stripe payment...");
      const response = await paymentApi.createStripeCheckout(paymentData);
      console.log("✅ [Payment Flow] Stripe checkout created:", response);

      // Return the checkout URL for redirect
      return response.url;
    }

    throw new Error(`Unsupported payment provider: ${provider}`);
  } catch (error) {
    console.error("❌ [Payment Flow] Payment initiation failed:", error);
    throw error;
  }
};

// Instance methods for backward compatibility
export const paymentApi = {
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    const response = await PaymentApi.createPayment(paymentData);
    return response.data;
  },

  async getUserPayments(userId: string): Promise<PaymentDocument[]> {
    const response = await PaymentApi.getUserPayments(userId);
    return response.data;
  },

  async createStripeCheckout(
    checkoutData: StripeCheckoutRequest
  ): Promise<StripeCheckoutResponse> {
    console.log(
      "🔍 [Payment API Instance] Calling createStripeCheckout with:",
      checkoutData
    );
    const response = await PaymentApi.createStripeCheckout(checkoutData);
    console.log("🔍 [Payment API Instance] Raw response:", response);
    console.log("🔍 [Payment API Instance] Response data:", response.data);
    return response.data;
  },

  async createArifPayPayment(
    paymentData: PaymentRequest
  ): Promise<PaymentResponse> {
    // Use the same endpoint as createPayment for ArifPay
    const response = await PaymentApi.createPayment(paymentData);
    return response.data;
  },

  async updatePaymentStatus(
    statusData: UpdatePaymentStatusRequest
  ): Promise<void> {
    await PaymentApi.updatePaymentStatus(statusData);
  },
};
