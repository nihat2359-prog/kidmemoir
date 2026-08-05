import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { AuthBackground } from "@/features/auth/components/layout/AuthBackground";
import { AuthBrand } from "@/features/auth/components/layout/AuthBrand";
import { AuthCard } from "@/features/auth/components/layout/AuthCard";
import { AuthContainer } from "@/features/auth/components/layout/AuthContainer";
import { AuthFooter } from "@/features/auth/components/layout/AuthFooter";
import { AuthHeader } from "@/features/auth/components/layout/AuthHeader";
import { AuthIllustration } from "@/features/auth/components/layout/AuthIllustration";
import { AuthLogo } from "@/features/auth/components/layout/AuthLogo";

type AuthLayoutProps = Readonly<{
  children: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  title: ReactNode;
}>;

export function AuthLayout({
  children,
  description,
  eyebrow,
  footer,
  title,
}: AuthLayoutProps) {
  const t = useTranslations("auth.layout");

  return (
    <div className="relative isolate min-h-svh overflow-hidden">
      <a
        className="bg-background text-foreground focus-visible:ring-ring fixed top-3 left-3 z-(--z-tooltip) -translate-y-20 rounded-md px-4 py-2 text-sm font-medium shadow-md transition-transform focus:translate-y-0 focus-visible:ring-2"
        href="#auth-content"
      >
        {t("skipToContent")}
      </a>
      <AuthBackground />

      <main className="outline-none" id="auth-content" tabIndex={-1}>
        <AuthContainer>
          <aside className="hidden lg:block" aria-label={t("storyAriaLabel")}>
            <AuthBrand />
            <AuthIllustration />
          </aside>

          <div className="mx-auto w-full max-w-[32rem]">
            <AuthLogo className="mb-8 lg:hidden" />
            <div className="relative">
              <div className="bg-primary/12 absolute -inset-6 -z-10 rounded-full blur-3xl" />
              <AuthCard>
                <AuthHeader
                  description={description}
                  eyebrow={eyebrow}
                  title={title}
                />
                <div>{children}</div>
                {footer ? <AuthFooter>{footer}</AuthFooter> : null}
              </AuthCard>
            </div>
          </div>
        </AuthContainer>
      </main>
    </div>
  );
}
