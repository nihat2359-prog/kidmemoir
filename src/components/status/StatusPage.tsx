import type { ReactNode } from "react";
import { CircleAlert, CloudOff, LockKeyhole, SearchX } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";

const icons = {
  forbidden: LockKeyhole,
  notFound: SearchX,
  offline: CloudOff,
  unexpected: CircleAlert,
} as const;

export function StatusPage({
  action,
  description,
  eyebrow,
  title,
  type,
}: {
  action: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  type: keyof typeof icons;
}) {
  const Icon = icons[type];
  return (
    <main className="bg-background relative isolate grid min-h-svh place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/12 absolute -top-36 -left-32 size-[30rem] rounded-full blur-3xl" />
        <div className="bg-ai/8 absolute -right-40 -bottom-48 size-[34rem] rounded-full blur-3xl" />
      </div>
      <section className="bg-card/75 w-full max-w-xl rounded-[2.5rem] border p-7 text-center shadow-xl backdrop-blur-xl sm:p-12">
        <LogoMark className="mx-auto h-12 w-11 rounded-xl" />
        <div className="bg-primary/10 text-primary mx-auto mt-8 grid size-20 place-items-center rounded-[1.75rem] border shadow-sm">
          <Icon aria-hidden className="size-9" />
        </div>
        <p className="text-primary mt-7 text-sm font-semibold tracking-wide uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7 text-pretty">
          {description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {action}
        </div>
      </section>
    </main>
  );
}
