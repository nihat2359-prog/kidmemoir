import "server-only";

import { createHash } from "node:crypto";

function detectOperatingSystem(userAgent: string): string {
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

function detectBrowser(userAgent: string): string {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/OPR\//i.test(userAgent)) return "Opera";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent)) return "Safari";
  return "Browser";
}

export function createDeviceIdentity({
  acceptLanguage,
  userAgent,
  userId,
}: Readonly<{
  acceptLanguage: string | null;
  userAgent: string | null;
  userId: string;
}>) {
  const normalizedUserAgent = userAgent?.trim() || "unknown-user-agent";
  const operatingSystem = detectOperatingSystem(normalizedUserAgent);
  const browser = detectBrowser(normalizedUserAgent);
  const deviceId = createHash("sha256")
    .update(
      `${userId}\u0000${normalizedUserAgent}\u0000${acceptLanguage ?? ""}`,
    )
    .digest("hex");

  return {
    deviceId,
    deviceName: `${browser} on ${operatingSystem}`,
    operatingSystem,
  } as const;
}
