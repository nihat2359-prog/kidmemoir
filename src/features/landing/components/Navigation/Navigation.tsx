"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/features/landing/components/shared/Brand";
import { navigationItems } from "@/features/landing/constants/content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 32;

export function Navigation() {
  const t = useTranslations("landing.nav");
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
      animationFrame = 0;
    };
    const onScroll = () => {
      if (!animationFrame)
        animationFrame = requestAnimationFrame(updateScrollState);
    };
    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const sections = navigationItems
      .map(({ href }) => document.querySelector(href))
      .filter((section): section is Element => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: "-22% 0px -68%", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    firstMobileLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
      <motion.div
        animate={reduceMotion ? undefined : { y: isScrolled ? -2 : 0 }}
        className={cn(
          "pointer-events-auto mx-auto rounded-xl border transition-[min-height,max-width,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-(--ease-standard)",
          isScrolled
            ? "border-border/60 bg-background/72 max-w-6xl shadow-md backdrop-blur-2xl"
            : "bg-background/15 max-w-[86rem] border-transparent shadow-none backdrop-blur-sm",
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between gap-4 transition-[min-height,padding] duration-300 ease-(--ease-standard)",
            isScrolled ? "min-h-14" : "min-h-16",
          )}
        >
          <motion.div
            className="shrink-0"
            whileHover={
              reduceMotion ? undefined : { rotate: -1, scale: 1.015, y: -1 }
            }
          >
            <Link aria-label={t("homeAriaLabel")} href="/">
              <Brand />
            </Link>
          </motion.div>

          <nav
            aria-label={t("ariaLabel")}
            className="hidden items-center lg:flex"
          >
            {navigationItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <a
                  className={cn(
                    "group relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 xl:px-4",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <span className="bg-foreground/5 absolute inset-0 -z-10 scale-90 rounded-md opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100" />
                  {t(item.key)}
                  {isActive ? (
                    <motion.span
                      className="from-primary via-ai to-timeline absolute right-3 bottom-0 left-3 h-px bg-gradient-to-r xl:right-4 xl:left-4"
                      layoutId="landing-active-link"
                      transition={{ duration: 0.25 }}
                    />
                  ) : null}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-1.5 md:flex">
            <Button asChild className="rounded-lg" variant="ghost">
              <Link href="/login">{t("login")}</Link>
            </Button>
            <Button asChild className="group rounded-lg shadow-md">
              <Link href="/register">
                {t("register")}
                <ArrowUpRight
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Button>
          </div>

          <Button
            ref={menuButtonRef}
            aria-controls="landing-mobile-menu"
            aria-expanded={isMenuOpen}
            aria-haspopup="dialog"
            aria-label={t(isMenuOpen ? "closeMenu" : "openMenu")}
            className="bg-background/35 rounded-lg backdrop-blur-md md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            size="sm"
            variant="icon"
          >
            {isMenuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </Container>
      </motion.div>

      <AnimatePresence initial={false}>
        {isMenuOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label={t("closeMenu")}
              className="bg-foreground/8 pointer-events-auto fixed inset-0 z-0 backdrop-blur-[2px] md:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={closeMenu}
              type="button"
            />
            <motion.aside
              animate={{ opacity: 1, scale: 1, x: 0 }}
              aria-label={t("mobileAriaLabel")}
              aria-modal="true"
              className="border-border/60 bg-background/88 pointer-events-auto absolute top-[4.75rem] right-3 z-10 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border p-3 shadow-lg backdrop-blur-2xl md:hidden"
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98, x: 12 }
              }
              id="landing-mobile-menu"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98, x: 12 }
              }
              onKeyDown={handleMenuKeyDown}
              ref={menuRef}
              role="dialog"
            >
              <nav aria-label={t("mobileAriaLabel")} className="grid gap-1">
                {navigationItems.map((item, index) => (
                  <a
                    className={cn(
                      "flex min-h-11 items-center justify-between rounded-lg px-4 text-sm font-medium transition-colors",
                      activeHref === item.href
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-foreground",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={closeMenu}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                  >
                    {t(item.key)}
                    {activeHref === item.href ? (
                      <span
                        aria-hidden
                        className="bg-primary size-1.5 rounded-full"
                      />
                    ) : null}
                  </a>
                ))}
              </nav>
              <div className="border-border/60 mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                <Button asChild variant="outline">
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t("register")}</Link>
                </Button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
