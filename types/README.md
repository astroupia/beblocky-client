# Types Directory

This directory contains TypeScript type definitions and constants used throughout the application.

## Stripe Pricing Types (`stripe-pricing.ts`)

### Overview

The Stripe pricing types provide a type-safe way to manage Stripe price IDs and prevent mistakes when creating payment payloads.

### Key Components

#### Enums

- `StripePlan`: Defines available subscription plans (STARTER, BUILDER, PRO_BUNDLE)
- `StripeBillingCycle`: Defines billing cycles (MONTHLY, ANNUAL)

#### Constants

- `STRIPE_PRICE_IDS`: Contains all Stripe price IDs mapped by plan and billing cycle
- `STRIPE_PRICE_AMOUNTS`: Contains price amounts for reference and validation

#### Helper Functions

- `getStripePriceId(plan, billingCycle)`: Returns the correct price ID for a given plan and billing cycle
- `getStripePriceAmount(plan, billingCycle)`: Returns the price amount for a given plan and billing cycle
- `validateStripePriceIds()`: Validates that all price IDs are properly configured

### Usage Example

```typescript
import {
  StripePlan,
  StripeBillingCycle,
  getStripePriceId,
  getStripePriceAmount,
} from "@/types/stripe-pricing";

// Get price ID for Starter monthly plan
const priceId = getStripePriceId(
  StripePlan.STARTER,
  StripeBillingCycle.MONTHLY
);
// Returns: "price_1RsJs2HV96pYRflDnFDyFqDC"

// Get price amount for Builder annual plan
const amount = getStripePriceAmount(
  StripePlan.BUILDER,
  StripeBillingCycle.ANNUAL
);
// Returns: 89.88
```

### Benefits

- ✅ **Type Safety**: Prevents typos and invalid plan/billing cycle combinations
- ✅ **Centralized Management**: All price IDs are defined in one place
- ✅ **Easy Updates**: Change price IDs in one location
- ✅ **Validation**: Built-in error handling for invalid combinations
- ✅ **Documentation**: Clear comments showing prices and descriptions

### Available Plans and Prices

| Plan       | Billing Cycle | Price ID                         | Amount  |
| ---------- | ------------- | -------------------------------- | ------- |
| Starter    | Monthly       | `price_1RsJs2HV96pYRflDnFDyFqDC` | $6.99   |
| Starter    | Annual        | `price_1RsJs2HV96pYRflDogCR9iJB` | $59.99  |
| Builder    | Monthly       | `price_1RsJumHV96pYRflDWJ1cr5oQ` | $6.99   |
| Builder    | Annual        | `price_1RsJvBHV96pYRflD6Sm8L5E4` | $89.88  |
| Pro Bundle | Monthly       | `price_1RsJxXHV96pYRflDmXhgrab0` | $13.99  |
| Pro Bundle | Annual        | `price_1RsJxsHV96pYRflDYEo4PouB` | $119.99 |

### Migration from Hardcoded Values

Before:

```typescript
// ❌ Error-prone hardcoded values
const priceId = "price_1RsJs2HV96pYRflDnFDyFqDC";
```

After:

```typescript
// ✅ Type-safe approach
const priceId = getStripePriceId(
  StripePlan.STARTER,
  StripeBillingCycle.MONTHLY
);
```

### Validation

The system includes validation to ensure all price IDs are properly configured:

```typescript
import { validateStripePriceIds } from "@/types/stripe-pricing";

// Validate all price IDs (useful for testing)
const isValid = validateStripePriceIds();
if (!isValid) {
  console.error("Invalid Stripe price IDs detected");
}
```
