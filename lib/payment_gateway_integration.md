# Payment & Subscription Integration Guide

This guide explains how to integrate with the Payment and Subscription modules for the BeBlocky API.

## Table of Contents

- [Overview](#overview)
- [Payment Module](#payment-module)
- [Stripe Integration](#stripe-integration)
- [Subscription Module](#subscription-module)
- [Integration Flow](#integration-flow)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)

## Overview

The payment system supports two payment providers:

1. **ArifPay** - Ethiopian payment gateway (primary)
2. **Stripe** - International payment gateway

Both systems integrate with a subscription management system that handles recurring billing and plan management.

## Payment Module

### Base URL

```
POST /payment
GET /payment/:userId
POST /payment/responseStatus
```

### 1. Create Payment Session

**Endpoint:** `POST /payment`

**Description:** Creates a new payment session using ArifPay

**Request Body:**

```typescript
{
  userId: string;           // User ID (string from better-auth)
  amount: number;           // Payment amount
  cancelUrl: string;        // URL to redirect on cancellation
  successUrl: string;       // URL to redirect on success
  errorUrl: string;         // URL to redirect on error
  notifyUrl: string;        // Webhook URL for status updates
  phone: number;            // User's phone number (REQUIRED - Ethiopian format: 251912345678)
  email?: string;           // User's email (optional)
  nonce?: string;           // Payment nonce (optional)
  paymentMethods?: PaymentMethod[]; // Allowed payment methods
  expireDate: Date;         // Payment session expiry date
  items: Item[];            // Array of items to purchase
  lang?: string;            // Language preference (optional)
  transactionStatus?: PaymentStatus; // Initial status (optional)
  transactionId?: string;   // Transaction ID (optional)
  sessionId?: string;       // Session ID (optional)
}

// Item structure
{
  name: string;             // Item name
  quantity: number;         // Item quantity
  price: number;            // Item price
  description?: string;     // Item description (optional)
  image?: string;           // Item image URL (optional)
}
```

**Payment Methods Available:**

```typescript
enum PaymentMethod {
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
```

**Note:** The API automatically maps these payment methods to ArifPay's expected format:

- `AWASH` → `AWASH_BIRR`
- `CBE` → `CBE_BIRR`
- `BOA` → `BOA_BIRR`
- Others remain the same

**Response:**

```typescript
{
  sessionId: string; // Payment session ID
  transactionId: string; // Transaction ID
  paymentUrl: string; // URL to redirect user for payment
  cancelUrl: string; // Cancel URL
}
```

**Example Request:**

```javascript
const response = await fetch("/payment", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: "user_123456789",
    amount: 1000,
    cancelUrl: "https://yourapp.com/cancel",
    successUrl: "https://yourapp.com/success",
    errorUrl: "https://yourapp.com/error",
    notifyUrl: "https://yourapp.com/webhook",
    phone: 251912345678, // REQUIRED - Ethiopian phone number format
    email: "user@example.com",
    paymentMethods: ["TELEBIRR", "AWASH", "AWASH_WALLET", "CBE", "AMOLE"],
    expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    items: [
      {
        name: "Premium Subscription",
        quantity: 1,
        price: 1000,
        description: "Monthly premium access",
      },
    ],
  }),
});
```

### 2. Get User Payments

**Endpoint:** `GET /payment/:userId`

**Description:** Retrieves all payments for a specific user

**Response:**

```typescript
{
  statusCode: number;
  message: string;
  data: PaymentDocument[] | null;
}
```

**Example:**

```javascript
const response = await fetch("/payment/user_123456789");
const payments = await response.json();
```

### 3. Payment Status Update (Webhook)

**Endpoint:** `POST /payment/responseStatus`

**Description:** Webhook endpoint for payment status updates from ArifPay

**Request Body:**

```typescript
{
  uuid?: string;            // Unique identifier
  nonce?: string;           // Payment nonce
  phone?: number;           // User's phone number
  transactionStatus?: PaymentStatus; // Payment status
  paymentStatus?: string;   // Payment status string
  totalAmount?: number;     // Total amount
  transaction?: {           // Transaction details
    transactionId: string;
    transactionStatus: string;
  };
  notificationUrl?: string; // Notification URL
  sessionId?: string;       // Session ID
}
```

**Payment Status Values:**

```typescript
enum PaymentStatus {
  PENDING = "pending",
  FAILED = "failed",
  CANCELED = "canceled",
  EXPIRED = "expired",
  UNAUTHORIZED = "unauthorized",
  SUCCESS = "SUCCESS",
}
```

## Stripe Integration

### Base URL

```
POST /stripe/stripe-checkout
```

### Create Stripe Checkout Session

**Endpoint:** `POST /stripe/stripe-checkout`

**Description:** Creates a Stripe checkout session for international payments

**Request Body:**

```typescript
{
  items: {
    price: string; // Stripe price ID
    quantity: number; // Quantity
  }
  successUrl: string; // Success redirect URL
  cancelUrl: string; // Cancel redirect URL
  userId: string; // User ID
}
```

**Response:**

```typescript
{
  sessionId: string; // Stripe session ID
  url: string; // Checkout URL
}
```

**Example Request:**

```javascript
const response = await fetch("/stripe/stripe-checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    items: {
      price: "price_H5ggYwtDq4fbrJ",
      quantity: 1,
    },
    successUrl: "https://yourapp.com/success",
    cancelUrl: "https://yourapp.com/cancel",
    userId: "user_123456789",
  }),
});
```

## Subscription Module

### Base URL

```
POST /subscriptions
GET /subscriptions
GET /subscriptions/:id
GET /subscriptions/user/:userId
PATCH /subscriptions/:id
DELETE /subscriptions/:id
GET /subscriptions/status/:status
GET /subscriptions/plan/:planName
GET /subscriptions/active/all
GET /subscriptions/expiring
```

### 1. Create Subscription

**Endpoint:** `POST /subscriptions`

**Description:** Creates a new subscription for a user

**Request Body:**

```typescript
{
  userId: string;           // User ID (string from better-auth)
  planName: SubscriptionPlan; // Subscription plan
  status?: SubscriptionStatus; // Subscription status (optional)
  startDate: Date;          // Subscription start date
  endDate: Date;            // Subscription end date
  autoRenew?: boolean;      // Auto-renewal flag (optional)
  price: number;            // Subscription price
  currency?: string;        // Currency (optional, default: USD)
  billingCycle: BillingCycle; // Billing cycle
  features?: string[];      // Plan features (optional)
  lastPaymentDate?: Date;   // Last payment date (optional)
  nextBillingDate?: Date;   // Next billing date (optional)
  trialEndsAt?: Date;       // Trial end date (optional)
  cancelAtPeriodEnd?: boolean; // Cancel at period end (optional)
}
```

**Subscription Plans:**

```typescript
enum SubscriptionPlan {
  FREE = "Free",
  STARTER = "Starter",
  BUILDER = "Builder",
  PRO_BUNDLE = "Pro-Bundle",
  ORGANIZATION = "Organization",
}
```

**Subscription Status:**

```typescript
enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  TRIAL = "trial",
}
```

**Billing Cycles:**

```typescript
enum BillingCycle {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}
```

**Example Request:**

```javascript
const response = await fetch("/subscriptions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: "user_123456789",
    planName: "Starter",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    price: 29.99,
    billingCycle: "monthly",
    features: ["Basic access", "Email support"],
    autoRenew: true,
  }),
});
```

### 2. Get All Subscriptions

**Endpoint:** `GET /subscriptions`

**Description:** Retrieves all subscriptions

### 3. Get Subscription by ID

**Endpoint:** `GET /subscriptions/:id`

**Description:** Retrieves a specific subscription by ID

### 4. Get User Subscriptions

**Endpoint:** `GET /subscriptions/user/:userId`

**Description:** Retrieves all subscriptions for a specific user

### 5. Update Subscription

**Endpoint:** `PATCH /subscriptions/:id`

**Description:** Updates a subscription

**Request Body:** Same as CreateSubscriptionDto (all fields optional)

### 6. Delete Subscription

**Endpoint:** `DELETE /subscriptions/:id`

**Description:** Deletes a subscription

### 7. Get Subscriptions by Status

**Endpoint:** `GET /subscriptions/status/:status`

**Description:** Retrieves subscriptions by status (active, canceled, expired, trial)

### 8. Get Subscriptions by Plan

**Endpoint:** `GET /subscriptions/plan/:planName`

**Description:** Retrieves subscriptions by plan name

### 9. Get Active Subscriptions

**Endpoint:** `GET /subscriptions/active/all`

**Description:** Retrieves all active subscriptions

### 10. Get Expiring Subscriptions

**Endpoint:** `GET /subscriptions/expiring?days=7`

**Description:** Retrieves subscriptions expiring within specified days

## Integration Flow

### Complete Payment to Subscription Flow

1. **Create Payment Session**

   ```javascript
   // Step 1: Create payment session
   const paymentResponse = await fetch("/payment", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       userId: "user_123456789",
       amount: 29.99,
       cancelUrl: "https://yourapp.com/cancel",
       successUrl: "https://yourapp.com/success",
       errorUrl: "https://yourapp.com/error",
       notifyUrl: "https://yourapp.com/webhook",
       expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
       items: [
         {
           name: "Starter Plan",
           quantity: 1,
           price: 29.99,
         },
       ],
     }),
   });

   const { paymentUrl, sessionId } = await paymentResponse.json();
   ```

2. **Redirect User to Payment**

   ```javascript
   // Step 2: Redirect user to payment page
   window.location.href = paymentUrl;
   ```

3. **Handle Payment Success**

   ```javascript
   // Step 3: On success page, create subscription
   const subscriptionResponse = await fetch("/subscriptions", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       userId: "user_123456789",
       planName: "Starter",
       startDate: new Date(),
       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       price: 29.99,
       billingCycle: "monthly",
       autoRenew: true,
     }),
   });

   const subscription = await subscriptionResponse.json();
   ```

### Stripe Integration Flow

1. **Create Stripe Checkout**

   ```javascript
   const stripeResponse = await fetch("/stripe/stripe-checkout", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       items: {
         price: "price_H5ggYwtDq4fbrJ",
         quantity: 1,
       },
       successUrl: "https://yourapp.com/success",
       cancelUrl: "https://yourapp.com/cancel",
       userId: "user_123456789",
     }),
   });

   const { url } = await stripeResponse.json();
   window.location.href = url;
   ```

## Error Handling

### Common Error Responses

**400 Bad Request - Missing Phone:**

```json
{
  "statusCode": 400,
  "message": "Missing required fields: phone",
  "error": "Validation failed"
}
```

**400 Bad Request - Payment Creation Failed:**

```json
{
  "statusCode": 400,
  "message": "Failed to create payment session after multiple attempts",
  "error": {
    "details": "Missing required fields: phone",
    "code": "PAYMENT_CREATION_FAILED",
    "userId": "user_123456789"
  }
}
```

**400 Bad Request - General Validation:**

```json
{
  "statusCode": 400,
  "message": "Invalid payment data",
  "error": "Validation failed"
}
```

**404 Not Found:**

```json
{
  "statusCode": 404,
  "message": "Payment not found",
  "data": null
}
```

**500 Internal Server Error:**

```json
{
  "statusCode": 500,
  "message": "Failed to create payment session",
  "error": "Payment gateway error"
}
```

### Frontend Error Handling

```javascript
try {
  const response = await fetch("/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
  // Handle success
} catch (error) {
  console.error("Payment error:", error.message);
  // Handle error (show user-friendly message)
}
```

## Environment Variables

### Required Environment Variables

```bash
# ArifPay Configuration
PAYMENT_BENEFICIARIES={"accountNumber":"1234567890","bankCode":"1234"}

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/beblocky

# API Configuration
PORT=3000
NODE_ENV=development
```

### Optional Environment Variables

```bash
# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Best Practices

1. **Always include the phone field** - ArifPay requires a valid Ethiopian phone number
2. **Use correct phone number format** - Ethiopian format: `251912345678` (country code + 9 digits)
3. **Always validate payment responses** before creating subscriptions
4. **Implement proper error handling** for all payment operations
5. **Use webhooks** for payment status updates rather than polling
6. **Store payment session IDs** for tracking and reconciliation
7. **Implement retry logic** for failed payment operations
8. **Use HTTPS** for all payment-related communications
9. **Validate user permissions** before allowing subscription operations
10. **Implement proper logging** for debugging payment issues
11. **Handle payment method mapping** - The API automatically maps payment methods to ArifPay format

## Testing

### Test Payment Flow

1. Use test credentials for ArifPay and Stripe
2. Test all payment methods and scenarios
3. Verify webhook handling
4. Test subscription creation after successful payment
5. Test error scenarios and edge cases

### Test Data

```javascript
// Test payment data
const testPayment = {
  userId: "test_user_123",
  amount: 100,
  phone: 251912345678, // REQUIRED - Ethiopian phone number
  cancelUrl: "http://localhost:3000/cancel",
  successUrl: "http://localhost:3000/success",
  errorUrl: "http://localhost:3000/error",
  notifyUrl: "http://localhost:3000/webhook",
  email: "test@example.com",
  paymentMethods: ["TELEBIRR", "AWASH", "CBE"],
  expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  items: [
    {
      name: "Test Item",
      quantity: 1,
      price: 100,
      description: "Test item for payment",
    },
  ],
};
```

## Debugging & Troubleshooting

### Common Issues

#### 1. **Missing Phone Field Error**

```
❌ [ArifPay Debug] Attempt 1 failed: Missing required fields: phone
```

**Solution:** Always include the `phone` field in your payment request with a valid Ethiopian phone number format.

#### 2. **Invalid Payment Methods**

The API automatically maps payment methods to ArifPay format:

- `AWASH` → `AWASH_BIRR`
- `CBE` → `CBE_BIRR`
- `BOA` → `BOA_BIRR`

#### 3. **Duplicate Session ID Error**

```
MongoServerError: E11000 duplicate key error collection: beblocky.payments index: sessionId_1 dup key: { sessionId: null }
```

**Solution:** This has been fixed in the latest version. The API now prevents saving failed payments with null session IDs.

### Debug Endpoints

#### Test Configuration

```bash
GET /payment/test/config
```

Returns:

```json
{
  "status": "success",
  "message": "Configuration loaded successfully",
  "beneficiaries": {
    "accountNumber": "1000651652956",
    "bank": "CBETETAA",
    "amount": 2
  },
  "hasArifPayKey": true,
  "hasBeneficiaries": true
}
```

### Debug Logs

The API now includes comprehensive debug logging. Check your server console for:

- `🔍 [ArifPay Debug] Request Payload:` - Shows the exact payload sent to ArifPay
- `🔍 [ArifPay Debug] Beneficiaries:` - Shows the beneficiaries configuration
- `❌ [ArifPay Debug] Attempt X failed:` - Shows detailed error information

### Environment Variables Check

Ensure these environment variables are set correctly:

```bash
ARIFPAY_API_KEY=your_arifpay_api_key
PAYMENT_BENEFICIARIES={"accountNumber":"1000651652956","bank":"CBETETAA","amount":2}
```

This guide provides everything needed to integrate the payment and subscription systems with your frontend application.
