type MonitoringContext = Readonly<Record<string, string | number | boolean>>;

export type MonitoringAdapter = Readonly<{
  captureException: (error: Error, context?: MonitoringContext) => void;
  trackEvent: (name: string, properties?: MonitoringContext) => void;
}>;

let adapter: MonitoringAdapter | null = null;

export function registerMonitoringAdapter(nextAdapter: MonitoringAdapter) {
  adapter = nextAdapter;
}

export function reportException(
  error: unknown,
  context?: MonitoringContext,
): void {
  const normalized =
    error instanceof Error ? error : new Error("Unknown error");
  adapter?.captureException(normalized, context);
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production")
    console.error("Application error", {
      context,
      message: normalized.message,
      name: normalized.name,
    });
}

export function trackProductEvent(
  name: string,
  properties?: MonitoringContext,
): void {
  adapter?.trackEvent(name, properties);
}
