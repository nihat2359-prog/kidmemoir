import {
  DatabaseBackup,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/features/landing/components/shared/Reveal";
import { SectionHeading } from "@/features/landing/components/shared/SectionHeading";

const items = [
  [LockKeyhole, "encrypted"],
  [Fingerprint, "access"],
  [DatabaseBackup, "backup"],
  [ShieldCheck, "privacy"],
] as const;

export function Privacy() {
  const t = useTranslations("landing.privacy");

  return (
    <section className="py-20 lg:py-24" id="privacy">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            description={t("description")}
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
        </Reveal>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, key]) => (
            <Card className="h-full p-6" key={key}>
              <span className="bg-success/12 text-success grid size-11 place-items-center rounded-md">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-6 font-semibold">{t(`${key}.title`)}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {t(`${key}.description`)}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-center text-xs">
          {t("infrastructure")}
        </p>
      </Container>
    </section>
  );
}
