import { NextRequest, NextResponse } from "next/server";
import { lemonBillingService } from "@/features/billing/services/lemonBillingService";
import { enforceRateLimit, requestFingerprint } from "@/lib/security/rateLimit";

const MAX_WEBHOOK_BYTES = 1_000_000;

export async function POST(request: NextRequest) {
  const rateLimit = enforceRateLimit(requestFingerprint(request), {
    limit: 180,
    namespace: "lemon-webhook",
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed)
    return NextResponse.json(
      { accepted: false },
      {
        headers: { "Retry-After": String(rateLimit.retryAfter) },
        status: 429,
      },
    );
  let claimedEventKey: string | null = null;
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_WEBHOOK_BYTES)
    return NextResponse.json({ accepted: false }, { status: 413 });
  const signature = request.headers.get("x-signature");
  const eventName = request.headers.get("x-event-name");
  if (!signature || !eventName)
    return NextResponse.json({ accepted: false }, { status: 401 });
  try {
    const payload = await request.text();
    if (Buffer.byteLength(payload, "utf8") > MAX_WEBHOOK_BYTES)
      return NextResponse.json({ accepted: false }, { status: 413 });
    if (!lemonBillingService.verifyWebhookSignature({ payload, signature }))
      return NextResponse.json({ accepted: false }, { status: 401 });
    const event = lemonBillingService.parseWebhook(payload);
    if (event.eventName !== eventName)
      return NextResponse.json({ accepted: false }, { status: 400 });
    const claim = await lemonBillingService.claimWebhookEvent(event, payload);
    if (claim.state !== "claimed") {
      return claim.state === "completed"
        ? NextResponse.json({ accepted: true, duplicate: true })
        : NextResponse.json({ accepted: false }, { status: 409 });
    }
    const eventKey = claim.eventKey;
    claimedEventKey = eventKey;
    await lemonBillingService.syncSubscription(event);
    await lemonBillingService.completeWebhookEvent(eventKey);
    return NextResponse.json({ accepted: true });
  } catch (error) {
    if (claimedEventKey) {
      await lemonBillingService
        .releaseWebhookEvent(claimedEventKey)
        .catch((releaseError: unknown) =>
          console.error(
            "Lemon webhook idempotency release failed",
            releaseError,
          ),
        );
    }
    console.error("Lemon webhook processing failed", error);
    return NextResponse.json({ accepted: false }, { status: 500 });
  }
}
