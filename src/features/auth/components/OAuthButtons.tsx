"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Apple, Mail, ShieldAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { OAuthProvider } from "@/features/auth/types/auth.types";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 6Z"
      />
    </svg>
  );
}

type OAuthErrorKey = "cancelled" | "network" | "sessionExpired" | "unknown";

export function OAuthButtons({
  initialError,
}: Readonly<{ initialError?: OAuthErrorKey }>) {
  const t = useTranslations("auth.oauth");
  const locale = useLocale();
  const { signInWithOAuth } = useAuth();
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<OAuthErrorKey | null>(
    initialError ?? null,
  );

  async function continueWith(provider: OAuthProvider) {
    if (pending) return;
    setPending(provider);
    setError(null);
    try {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("flow", "oauth");
      callback.searchParams.set("locale", locale);
      callback.searchParams.set("provider", provider);
      await signInWithOAuth({ provider, redirectTo: callback.toString() });
    } catch {
      setError("unknown");
      setPending(null);
    }
  }

  return (
    <div className="space-y-3" aria-busy={pending !== null}>
      <p className="text-muted-foreground text-center text-sm">
        {t("tagline")}
      </p>
      {error ? (
        <Alert variant="danger" role="alert">
          <ShieldAlert aria-hidden />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      ) : null}
      <Button
        className="h-12 rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        disabled={pending !== null}
        fullWidth
        loading={pending === "google"}
        onClick={() => void continueWith("google")}
        size="lg"
        type="button"
        variant="outline"
      >
        {pending !== "google" ? <GoogleMark /> : null}
        {t("continueGoogle")}
      </Button>
      <Button
        className="h-12 rounded-xl bg-black text-white shadow-sm hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-100"
        disabled={pending !== null}
        fullWidth
        loading={pending === "apple"}
        onClick={() => void continueWith("apple")}
        size="lg"
        type="button"
      >
        {pending !== "apple" ? (
          <Apple aria-hidden className="size-5" fill="currentColor" />
        ) : null}
        {t("continueApple")}
      </Button>
    </div>
  );
}

export function EmailAuthDisclosure({
  children,
  initialOpen = false,
}: Readonly<{ children: ReactNode; initialOpen?: boolean }>) {
  const t = useTranslations("auth.oauth");
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3" aria-hidden>
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          {t("or")}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>
      {!open ? (
        <Button
          className="h-12 rounded-xl"
          fullWidth
          onClick={() => setOpen(true)}
          size="lg"
          type="button"
          variant="outline"
        >
          <Mail aria-hidden className="size-4" />
          {t("continueEmail")}
        </Button>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
