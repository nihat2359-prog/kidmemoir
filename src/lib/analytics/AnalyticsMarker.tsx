"use client";

import { useEffect } from "react";
import {
  analytics,
  type AnalyticsEventName,
  type AnalyticsPayload,
} from "@/lib/analytics/analytics";

export function AnalyticsMarker({
  dedupeKey,
  event,
  payload,
}: {
  dedupeKey?: string;
  event: AnalyticsEventName;
  payload?: AnalyticsPayload;
}) {
  useEffect(() => {
    const storageKey = dedupeKey ? `analytics:${event}:${dedupeKey}` : null;
    if (storageKey && sessionStorage.getItem(storageKey)) return;
    analytics.track(event, payload);
    if (storageKey) sessionStorage.setItem(storageKey, "1");
  }, [dedupeKey, event, payload]);
  return null;
}
