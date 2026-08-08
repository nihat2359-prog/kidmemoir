export const ANALYTICS_CONSENT_COOKIE = "KIDMEMOIR_ANALYTICS_CONSENT";
export type AnalyticsConsent = "denied" | "granted" | null;
export function getConsentSnapshot(): AnalyticsConsent {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
}
export function getConsentServerSnapshot(): AnalyticsConsent {
  return null;
}
export function subscribeConsent(callback: () => void) {
  window.addEventListener("kidmemoir:consent", callback);
  return () => window.removeEventListener("kidmemoir:consent", callback);
}
