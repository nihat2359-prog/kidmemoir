import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/LogoMark";
import { Link } from "@/i18n/navigation";

export function BillingStatusPage({
  action,
  description,
  icon: Icon,
  note,
  title,
}: {
  action: string;
  description: string;
  icon: LucideIcon;
  note: string;
  title: string;
}) {
  return (
    <main className="from-primary/10 via-background to-ai/8 grid min-h-svh place-items-center bg-gradient-to-br px-4 py-12">
      <section className="bg-card/85 w-full max-w-2xl rounded-[2.5rem] border p-7 text-center shadow-lg backdrop-blur-sm sm:p-12">
        <LogoMark className="mx-auto h-16 w-14 rounded-xl" />
        <span className="bg-primary/12 text-primary mx-auto mt-8 grid size-16 place-items-center rounded-2xl">
          <Icon aria-hidden className="size-7" />
        </span>
        <h1 className="mt-7 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-xl leading-8">
          {description}
        </p>
        <p className="bg-muted/55 text-muted-foreground mx-auto mt-7 max-w-xl rounded-2xl p-4 text-sm leading-6">
          {note}
        </p>
        <Button
          asChild
          className="mt-8"
          icon={<ArrowRight aria-hidden />}
          iconPosition="end"
          size="lg"
        >
          <Link href="/pricing">{action}</Link>
        </Button>
      </section>
    </main>
  );
}
