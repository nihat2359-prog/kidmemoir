import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function DashboardSectionHeader({
  action,
  href,
  title,
}: {
  action?: string;
  href?: string;
  title: string;
}) {
  return (
    <header className="mb-7 flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
        {title}
      </h2>
      {action && href ? (
        <Link
          className="text-primary focus-visible:ring-ring hover:bg-primary/8 inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2"
          href={href}
        >
          {action}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      ) : null}
    </header>
  );
}
