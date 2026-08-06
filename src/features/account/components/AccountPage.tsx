import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export function AccountPage({
  backLabel,
  children,
  description,
  eyebrow,
  icon: Icon,
  title,
}: {
  backLabel: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <main className="min-h-svh pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Button
          asChild
          className="mb-6 rounded-full"
          icon={<ArrowLeft aria-hidden />}
          variant="outline"
        >
          <Link href="/dashboard">{backLabel}</Link>
        </Button>
        <header className="from-primary/12 via-card/75 to-ai/9 relative overflow-hidden rounded-[2.5rem] border p-7 shadow-lg sm:p-10">
          <span className="from-primary/15 to-ai/15 text-primary grid size-14 place-items-center rounded-2xl bg-gradient-to-br">
            <Icon aria-hidden className="size-6" />
          </span>
          <p className="text-primary mt-6 text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
            {description}
          </p>
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function AccountSection({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="bg-card/75 rounded-[2rem] border p-5 shadow-sm sm:p-8">
      <header className="mb-6">
        <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
