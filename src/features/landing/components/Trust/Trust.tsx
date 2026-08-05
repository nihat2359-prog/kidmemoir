import {
  BrainCircuit,
  Database,
  Fingerprint,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/features/landing/components/shared/Reveal";

const trustItems = [
  [ShieldCheck, "ownership"],
  [Database, "supabase"],
  [KeyRound, "encrypted"],
  [Fingerprint, "privacy"],
  [BrainCircuit, "ai"],
] as const;

export function Trust() {
  const t = useTranslations("landing.trust");
  return (
    <section
      aria-label={t("ariaLabel")}
      className="relative z-10 -mt-2 pb-8 md:pb-12"
    >
      <Container>
        <Reveal>
          <div className="border-border/55 bg-card/58 grid overflow-hidden rounded-xl border shadow-md backdrop-blur-2xl md:grid-cols-5">
            {trustItems.map(([Icon, key], index) => (
              <div
                className="group border-border/50 hover:bg-card/80 flex min-h-24 items-center gap-3 border-b p-4 transition-colors md:border-r md:border-b-0 md:last:border-r-0"
                key={key}
              >
                <span className="bg-success/10 text-success grid size-10 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-105">
                  <Icon aria-hidden className="size-4" />
                </span>
                <p className="text-sm leading-5 font-medium">{t(key)}</p>
                <span className="text-muted-foreground ml-auto text-xs">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
