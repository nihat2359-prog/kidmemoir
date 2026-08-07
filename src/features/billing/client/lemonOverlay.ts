"use client";

type LemonWindow = Window & {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Url: {
      Close: () => void;
      Open: (url: string) => void;
    };
  };
};

const INITIALIZATION_ATTEMPTS = 50;
const INITIALIZATION_INTERVAL_MS = 100;

export function initializeLemonOverlay(): void {
  (window as LemonWindow).createLemonSqueezy?.();
}

async function waitForLemonSqueezy(): Promise<void> {
  const lemonWindow = window as LemonWindow;
  for (let attempt = 0; attempt < INITIALIZATION_ATTEMPTS; attempt++) {
    lemonWindow.createLemonSqueezy?.();
    if (lemonWindow.LemonSqueezy) return;
    await new Promise((resolve) =>
      window.setTimeout(resolve, INITIALIZATION_INTERVAL_MS),
    );
  }
  throw new Error("Lemon overlay is unavailable");
}

export async function openLemonOverlay(url: string): Promise<void> {
  await waitForLemonSqueezy();

  const link = document.createElement("a");
  link.className = "lemonsqueezy-button";
  link.href = url;
  link.hidden = true;
  document.body.appendChild(link);
  initializeLemonOverlay();
  link.click();
  link.remove();
}
