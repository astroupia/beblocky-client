import { NextRequest, NextResponse } from "next/server";
import { paymentApi } from "@/lib/api/payment";
import { subscriptionApi } from "@/lib/api/subscription";
import { PaymentStatus } from "@/lib/api/payment";
import { SubscriptionPlan } from "@/types/subscription";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Payment webhook received:", body);

    // Extract payment status data
    const {
      uuid,
      nonce,
      phone,
      transactionStatus,
      paymentStatus,
      totalAmount,
      transaction,
      notificationUrl,
      sessionId,
    } = body;

    // Update payment status
    await paymentApi.updatePaymentStatus({
      uuid,
      nonce,
      phone,
      transactionStatus,
      paymentStatus,
      totalAmount,
      transaction,
      notificationUrl,
      sessionId,
    });

    // If payment was successful, create subscription
    if (
      transactionStatus === PaymentStatus.SUCCESS ||
      paymentStatus === "SUCCESS"
    ) {
      // Get payment session from database or cache
      // For now, we'll log the success
      console.log("Payment successful for session:", sessionId);

      // TODO: Implement subscription creation logic here
      // This would typically involve:
      // 1. Fetching the payment session from your database
      // 2. Creating a subscription based on the payment data
      // 3. Updating user's subscription status
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Payment webhook endpoint" });
}
