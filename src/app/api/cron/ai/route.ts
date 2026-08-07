import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAiEnvironment } from "@/features/ai/config/aiConfig";
import { runAiWorker } from "@/features/ai/services/aiWorker";
import { reportException } from "@/lib/monitoring";
import { enforceRateLimit, requestFingerprint } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: NextRequest): boolean {
  const expected = `Bearer ${getAiEnvironment().CRON_SECRET}`;
  const received = request.headers.get("authorization") ?? "";
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return (
    expectedBytes.length === receivedBytes.length &&
    timingSafeEqual(expectedBytes, receivedBytes)
  );
}

async function handle(request: NextRequest) {
  if (!authorized(request))
    return NextResponse.json({ success: false }, { status: 401 });

  const rateLimit = enforceRateLimit(requestFingerprint(request), {
    limit: 12,
    namespace: "ai-worker",
    windowMs: 60_000,
  });
  if (!rateLimit.allowed)
    return NextResponse.json(
      { success: false },
      {
        headers: { "Retry-After": String(rateLimit.retryAfter) },
        status: 429,
      },
    );

  try {
    const results = await runAiWorker(5);
    return NextResponse.json({ processed: results.length, success: true });
  } catch (error) {
    reportException(error, { operation: "ai_worker" });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
