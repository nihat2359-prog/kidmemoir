import type { OnThisDayMemory } from "@/features/on-this-day/types/onThisDay.types";

export type DashboardChild = Readonly<{
  avatarUrl: string | null;
  birthDate: string;
  firstName: string;
  id: string;
  lastName: string | null;
}>;

export type DashboardMemory = Readonly<{
  hasAudio: boolean;
  hasVideo: boolean;
  photoUrl: string | null;
  createdAt: string;
  description: string | null;
  id: string;
  occurredAt: string;
  title: string;
}>;

export type DashboardReminder = Readonly<{
  description: string | null;
  id: string;
  reminderAt: string;
  title: string;
}>;

export type DashboardInsight = Readonly<{
  createdAt: string;
  summary: string;
}>;

export type DashboardSummary = Readonly<{
  audio: number;
  memories: number;
  photos: number;
  videos: number;
}>;

export type DashboardData = Readonly<{
  child: DashboardChild | null;
  insight: DashboardInsight | null;
  onThisDay: readonly OnThisDayMemory[];
  profileFirstName: string;
  recentMemories: DashboardMemory[];
  reminders: DashboardReminder[];
  summary: DashboardSummary;
}>;
