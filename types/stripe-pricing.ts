// Stripe Pricing Types and Constants
// This file contains all Stripe price IDs and related types to avoid mistakes

export enum StripePlan {
  STARTER = "starter",
  BUILDER = "builder", 
  PRO_BUNDLE = "pro"
}

export enum StripeBillingCycle {
  MONTHLY = "monthly",
  ANNUAL = "annual"
}

export interface StripePriceConfig {
  priceId: string;
  amount: number;
  currency: string;
  billingCycle: StripeBillingCycle;
  plan: StripePlan;
}

// Stripe Price IDs - DO NOT CHANGE THESE VALUES
export const STRIPE_PRICE_IDS = {
  [StripePlan.STARTER]: {
    [StripeBillingCycle.MONTHLY]: "price_1RsJs2HV96pYRflDnFDyFqDC", // $6.99/month
    [StripeBillingCycle.ANNUAL]: "price_1RsJs2HV96pYRflDogCR9iJB", // $59.99/year
  },
  [StripePlan.BUILDER]: {
    [StripeBillingCycle.MONTHLY]: "price_1RsJumHV96pYRflDWJ1cr5oQ", // $6.99/month
    [StripeBillingCycle.ANNUAL]: "price_1RsJvBHV96pYRflD6Sm8L5E4", // $89.88/year
  },
  [StripePlan.PRO_BUNDLE]: {
    [StripeBillingCycle.MONTHLY]: "price_1RsJxXHV96pYRflDmXhgrab0", // $13.99/month
    [StripeBillingCycle.ANNUAL]: "price_1RsJxsHV96pYRflDYEo4PouB", // $119.99/year
  },
} as const;

// Price amounts for reference and validation
export const STRIPE_PRICE_AMOUNTS = {
  [StripePlan.STARTER]: {
    [StripeBillingCycle.MONTHLY]: 6.99,
    [StripeBillingCycle.ANNUAL]: 59.99,
  },
  [StripePlan.BUILDER]: {
    [StripeBillingCycle.MONTHLY]: 6.99,
    [StripeBillingCycle.ANNUAL]: 89.88,
  },
  [StripePlan.PRO_BUNDLE]: {
    [StripeBillingCycle.MONTHLY]: 13.99,
    [StripeBillingCycle.ANNUAL]: 119.99,
  },
} as const;

// Helper function to get Stripe price ID
export function getStripePriceId(
  plan: StripePlan,
  billingCycle: StripeBillingCycle
): string {
  const priceId = STRIPE_PRICE_IDS[plan]?.[billingCycle];
  if (!priceId) {
    throw new Error(`Invalid plan or billing cycle: ${plan} ${billingCycle}`);
  }
  return priceId;
}

// Helper function to get price amount
export function getStripePriceAmount(
  plan: StripePlan,
  billingCycle: StripeBillingCycle
): number {
  const amount = STRIPE_PRICE_AMOUNTS[plan]?.[billingCycle];
  if (amount === undefined) {
    throw new Error(`Invalid plan or billing cycle: ${plan} ${billingCycle}`);
  }
  return amount;
}

// Type for the price IDs object
export type StripePriceIds = typeof STRIPE_PRICE_IDS;

// Type for the price amounts object  
export type StripePriceAmounts = typeof STRIPE_PRICE_AMOUNTS;

// Validation function to ensure all price IDs are properly configured
export function validateStripePriceIds(): boolean {
  const plans = Object.values(StripePlan);
  const billingCycles = Object.values(StripeBillingCycle);
  
  for (const plan of plans) {
    for (const billingCycle of billingCycles) {
      const priceId = STRIPE_PRICE_IDS[plan]?.[billingCycle];
      if (!priceId || !priceId.startsWith('price_')) {
        console.error(`Invalid price ID for ${plan} ${billingCycle}: ${priceId}`);
        return false;
      }
    }
  }
  
  return true;
}
