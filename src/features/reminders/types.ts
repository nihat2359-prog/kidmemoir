export type ReminderItem = Readonly<{
  childId: string;
  childName: string;
  description: string | null;
  eventId: string | null;
  id: string;
  reminderAt: string;
  repeatType: string;
  status: "scheduled" | "completed" | "cancelled";
  title: string;
}>;
export type ReminderData = Readonly<{
  children: readonly Readonly<{ id: string; name: string }>[];
  items: readonly ReminderItem[];
  referenceTime: string;
}>;
export type ReminderInput = Readonly<{
  childId: string;
  date: string;
  description: string;
  id?: string;
  repeatType: "none" | "daily" | "weekly" | "monthly" | "yearly";
  time: string;
  title: string;
}>;
