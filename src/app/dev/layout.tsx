import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import "@/styles/globals.css";

export default function DevelopmentLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
