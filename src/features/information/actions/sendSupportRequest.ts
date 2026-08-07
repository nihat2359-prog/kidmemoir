"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import {
  MAX_SUPPORT_ATTACHMENT_SIZE,
  SUPPORT_ATTACHMENT_TYPES,
  supportRequestSchema,
  type SupportSubject,
} from "@/features/information/schemas/supportSchema";
import { reportException } from "@/lib/monitoring";

export type SupportFormState = Readonly<{
  fieldErrors?: Partial<
    Record<"attachment" | "email" | "message" | "subject", string>
  >;
  status: "error" | "idle" | "success";
  type?:
    "configuration" | "network" | "rateLimited" | "unauthorized" | "validation";
}>;

const emailEnvironmentSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_").min(10),
  RESEND_FROM_EMAIL: z.string().min(3).max(320),
  SUPPORT_EMAIL_TO: z.string().email(),
});

const requests = new Map<string, number[]>();
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requests.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT) {
    requests.set(key, recent);
    return true;
  }
  requests.set(key, [...recent, now]);
  if (requests.size > 1000) {
    for (const [entryKey, timestamps] of requests) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_WINDOW_MS))
        requests.delete(entryKey);
    }
  }
  return false;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "'": "&#39;",
        '"': "&quot;",
        "<": "&lt;",
        ">": "&gt;",
      })[character] ?? character,
  );
}

function safeFilename(value: string): string {
  const sanitized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f/\\]/g, "_")
    .slice(0, 120);
  return sanitized || "attachment";
}

function hasBytes(buffer: Buffer, expected: readonly number[], offset = 0) {
  return expected.every((byte, index) => buffer[offset + index] === byte);
}

function isValidAttachmentContent(file: File, buffer: Buffer): boolean {
  if (file.type === "image/jpeg") return hasBytes(buffer, [0xff, 0xd8, 0xff]);
  if (file.type === "image/png")
    return hasBytes(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (file.type === "image/webp")
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  if (file.type === "application/pdf")
    return buffer.toString("ascii", 0, 5) === "%PDF-";
  if (file.type === "text/plain") {
    if (buffer.includes(0)) return false;
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

const subjectLabels: Record<SupportSubject, string> = {
  account: "Account management",
  memory: "Memories",
  media: "Media",
  premium: "Premium",
  privacy: "Privacy",
  technical: "Technical issue",
};

export async function sendSupportRequest(
  _previousState: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  const parsed = supportRequestSchema.safeParse({
    email: formData.get("email"),
    locale: formData.get("locale"),
    message: formData.get("message"),
    subject: formData.get("subject"),
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: {
        email: errors.email?.[0],
        message: errors.message?.[0],
        subject: errors.subject?.[0],
      },
      status: "error",
      type: "validation",
    };
  }

  const attachmentEntry = formData.get("attachment");
  const attachment =
    attachmentEntry instanceof File && attachmentEntry.size > 0
      ? attachmentEntry
      : null;
  if (
    attachment &&
    (attachment.size > MAX_SUPPORT_ATTACHMENT_SIZE ||
      !SUPPORT_ATTACHMENT_TYPES.includes(
        attachment.type as (typeof SUPPORT_ATTACHMENT_TYPES)[number],
      ))
  ) {
    return {
      fieldErrors: { attachment: "invalid" },
      status: "error",
      type: "validation",
    };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  const clientKey = createHash("sha256")
    .update(forwardedFor?.trim() || parsed.data.email.toLowerCase())
    .digest("hex");
  if (isRateLimited(clientKey)) return { status: "error", type: "rateLimited" };

  const environment = emailEnvironmentSchema.safeParse(process.env);
  if (!environment.success) {
    reportException(new Error("Support email configuration is incomplete"), {
      operation: "support_email",
    });
    return { status: "error", type: "configuration" };
  }

  const attachmentBuffer = attachment
    ? Buffer.from(await attachment.arrayBuffer())
    : null;
  if (
    attachment &&
    attachmentBuffer &&
    !isValidAttachmentContent(attachment, attachmentBuffer)
  ) {
    return {
      fieldErrors: { attachment: "invalid" },
      status: "error",
      type: "validation",
    };
  }
  const payload = {
    attachments: attachmentBuffer
      ? [
          {
            content: attachmentBuffer.toString("base64"),
            filename: safeFilename(attachment?.name ?? "attachment"),
          },
        ]
      : undefined,
    from: environment.data.RESEND_FROM_EMAIL,
    html: `<h2>KidMemoir support request</h2><p><strong>Subject:</strong> ${escapeHtml(subjectLabels[parsed.data.subject])}</p><p><strong>Locale:</strong> ${escapeHtml(parsed.data.locale)}</p><p><strong>Reply email:</strong> ${escapeHtml(parsed.data.email)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(parsed.data.message)}</p>`,
    reply_to: parsed.data.email,
    subject: `[KidMemoir Support] ${subjectLabels[parsed.data.subject]}`,
    text: `Subject: ${subjectLabels[parsed.data.subject]}\nLocale: ${parsed.data.locale}\nReply email: ${parsed.data.email}\n\n${parsed.data.message}`,
    to: [environment.data.SUPPORT_EMAIL_TO],
  };
  const idempotencyKey = `support/${createHash("sha256")
    .update(
      JSON.stringify({
        email: parsed.data.email,
        file: attachmentBuffer
          ? createHash("sha256").update(attachmentBuffer).digest("hex")
          : null,
        message: parsed.data.message,
        subject: parsed.data.subject,
      }),
    )
    .digest("hex")}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${environment.data.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "KidMemoir/1.0",
      },
      method: "POST",
    });
    if (!response.ok) {
      reportException(
        new Error("Support email provider rejected the request"),
        {
          operation: "support_email",
          status: response.status,
        },
      );
      return {
        status: "error",
        type: response.status === 429 ? "rateLimited" : "network",
      };
    }
    return { status: "success" };
  } catch (error) {
    reportException(error, { operation: "support_email" });
    return { status: "error", type: "network" };
  }
}
