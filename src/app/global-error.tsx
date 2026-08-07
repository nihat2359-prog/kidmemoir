"use client";

import { useEffect } from "react";

import enMessages from "../../messages/en.json";
import trMessages from "../../messages/tr.json";

import { Button } from "@/components/ui/Button";
import { reportException } from "@/lib/monitoring";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function resolveMessages() {
  if (
    typeof document !== "undefined" &&
    document.documentElement.lang === "tr"
  ) {
    return trMessages.statusPages.unexpected;
  }

  return enMessages.statusPages.unexpected;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const messages = resolveMessages();

  useEffect(() => {
    reportException(error, {
      boundary: "root",
      ...(error.digest ? { digest: error.digest } : {}),
    });
  }, [error]);

  return (
    <html
      lang={
        typeof document !== "undefined" ? document.documentElement.lang : "en"
      }
    >
      <body className="bg-background text-foreground">
        <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-16">
          <div
            aria-hidden="true"
            className="bg-primary/12 absolute size-[30rem] rounded-full blur-3xl"
          />
          <section
            aria-labelledby="global-error-title"
            className="border-border/70 bg-card/90 relative w-full max-w-xl rounded-[2rem] border p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
          >
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">
              KidMemoir
            </p>
            <h1
              id="global-error-title"
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {messages.title}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7">
              {messages.description}
            </p>
            <div className="mt-8 flex justify-center">
              <Button type="button" size="lg" onClick={reset}>
                {messages.retry}
              </Button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
