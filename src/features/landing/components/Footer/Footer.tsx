import { ArrowUpRight, AtSign, BriefcaseBusiness, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Brand } from "@/features/landing/components/shared/Brand";
import { Link } from "@/i18n/navigation";

const groups = [
  {
    key: "product",
    links: [
      ["features", "#features"],
      ["ai", "#ai"],
      ["timeline", "#timeline"],
      ["pricing", "/pricing"],
    ],
  },
  {
    key: "company",
    links: [
      ["howItWorks", "#how-it-works"],
      ["privacy", "/privacy"],
      ["faq", "#faq"],
    ],
  },
  {
    key: "support",
    links: [
      ["contact", "/support"],
      ["help", "/help"],
      ["status", "/help"],
    ],
  },
  {
    key: "legal",
    links: [
      ["terms", "/terms"],
      ["privacyPolicy", "/privacy"],
      ["cookies", "/privacy"],
    ],
  },
] as const;

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="relative overflow-hidden pt-20 pb-8 lg:pt-24">
      <div className="bg-primary/8 absolute -bottom-48 left-1/3 -z-10 size-96 rounded-full blur-3xl" />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div>
            <Link aria-label={t("homeAriaLabel")} href="/">
              <Brand />
            </Link>
            <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-7">
              {t("description")}
            </p>
            <a
              className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm transition-colors"
              href="mailto:hello@kidmemoir.com"
            >
              <Mail aria-hidden className="size-4" />
              {t("email")}
            </a>
          </div>

          <nav
            aria-label={t("navigationAriaLabel")}
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
          >
            {groups.map(({ key, links }) => (
              <div key={key}>
                <h2 className="text-sm font-semibold">{t(`${key}.title`)}</h2>
                <ul className="text-muted-foreground mt-5 space-y-3 text-sm">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                        href={href}
                      >
                        {t(`${key}.${label}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="text-muted-foreground bg-card/35 mt-14 flex flex-col gap-6 rounded-xl px-5 py-5 text-xs backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p>{t("copyright", { year: new Date().getFullYear() })}</p>
            <p className="mt-1">{t("signature")}</p>
          </div>
          <div
            aria-label={t("socialAriaLabel")}
            className="flex items-center gap-2"
          >
            <a
              aria-label={t("instagram")}
              className="hover:text-foreground hover:border-primary/25 grid size-10 place-items-center rounded-full border transition-[color,border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
              href="https://instagram.com/kidmemoir"
              rel="noreferrer"
              target="_blank"
            >
              <AtSign aria-hidden className="size-4" />
            </a>
            <a
              aria-label={t("linkedin")}
              className="hover:text-foreground hover:border-primary/25 grid size-10 place-items-center rounded-full border transition-[color,border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
              href="https://linkedin.com/company/kidmemoir"
              rel="noreferrer"
              target="_blank"
            >
              <BriefcaseBusiness aria-hidden className="size-4" />
            </a>
            <a
              aria-label={t("emailSocial")}
              className="hover:text-foreground hover:border-primary/25 grid size-10 place-items-center rounded-full border transition-[color,border-color,transform] hover:-translate-y-0.5 motion-reduce:transform-none"
              href="mailto:hello@kidmemoir.com"
            >
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
