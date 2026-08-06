"use client";
import { TimelineError } from "@/features/timeline/components/TimelineError";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <TimelineError reset={reset} />;
}
