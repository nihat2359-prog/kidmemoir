export type AccountProfile = Readonly<{
  avatarUrl: string | null;
  email: string;
  firstName: string;
  language: string;
  lastName: string;
  theme: "light" | "dark" | "system";
  timezone: string;
}>;

export type AccountSettings = Readonly<{
  aiEnabled: boolean;
  dateFormat: string;
  emailNotifications: boolean;
  language: string;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  theme: "light" | "dark" | "system";
  timeFormat: "12h" | "24h";
  timezone: string;
}>;

export type AccountChild = Readonly<{
  avatarUrl: string | null;
  birthDate: string;
  firstName: string;
  id: string;
  isDefault: boolean;
  lastName: string | null;
  summary: Readonly<{
    lastMemoryCreatedAt: string | null;
    memories: number;
    photos: number;
    videos: number;
  }>;
}>;

export type SubscriptionUsage = Readonly<{
  aiTokens: number;
  audio: number;
  mediaBytes: number;
  photos: number;
  videos: number;
}>;

export type AccountSubscription = Readonly<{
  billingCycle: string;
  cancelledAt: string | null;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  lastPaymentAt: string | null;
  nextPaymentAt: string | null;
  plan: "free" | "premium";
  premiumStartedAt: string | null;
  providerSubscriptionId: string | null;
  renewsAt: string | null;
  status: SubscriptionState;
  usage: SubscriptionUsage;
}>;
import type { SubscriptionState } from "@/features/billing/types/billing.types";
