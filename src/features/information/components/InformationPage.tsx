import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/features/landing/components/shared/Brand";
import { Link } from "@/i18n/navigation";

export function InformationPage({
  backLabel,
  backHref = "/dashboard",
  children,
  description,
  eyebrow,
  icon: Icon,
  title,
}: {
  backLabel: string;
  backHref?: "/" | "/dashboard";
  children: ReactNode;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <main className="bg-background relative min-h-svh overflow-hidden pb-20">
      <div
        aria-hidden
        className="from-primary/10 via-background to-ai/8 absolute inset-x-0 top-0 h-[38rem] bg-gradient-to-br"
      />
      <div
        aria-hidden
        className="landing-background-grid absolute inset-x-0 top-0 h-[38rem] opacity-25"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label={backLabel}
          className="flex items-center justify-between py-5 sm:py-7"
        >
          <Link aria-label={backLabel} href="/">
            <Brand />
          </Link>
          <Button
            asChild
            className="rounded-full"
            icon={<ArrowLeft aria-hidden />}
            variant="outline"
          >
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </nav>
        <header className="py-12 sm:py-20 lg:py-24">
          <span className="from-primary/15 to-ai/15 text-primary grid size-14 place-items-center rounded-2xl bg-gradient-to-br shadow-sm">
            <Icon aria-hidden className="size-6" />
          </span>
          <p className="text-primary mt-7 text-xs font-semibold tracking-[0.16em] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-8 sm:text-lg">
            {description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}
