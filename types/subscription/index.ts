// import { Types } from "mongoose";

export enum SubscriptionPlan {
  FREE = "Free",
  STARTER = "Starter",
  BUILDER = "Builder",
  PRO_BUNDLE = "Pro-Bundle",
  ORGANIZATION = "Organization",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  EXPIRED = "expired",
  TRIAL = "trial",
}

export enum BillingCycle {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

export interface ISubscription {
  userId: string;
  planName: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
  paymentHistory: string[];
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriptionDto {
  userId: string;
  planName: SubscriptionPlan;
  status?: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew?: boolean;
  price: number;
  currency?: string;
  billingCycle: BillingCycle;
  features?: string[];
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  trialEndsAt?: Date;
  cancelAtPeriodEnd?: boolean;
}

export type IUpdateSubscriptionDto = Partial<ICreateSubscriptionDto>;
