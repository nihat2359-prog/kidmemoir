"use client";

import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { BellRing, Bot, Camera, Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const floatingTransition = {
  duration: 5.5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
} as const;

export function AuthIllustration() {
  const t = useTranslations("auth.layout.illustration");
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 30, stiffness: 110 });
  const smoothY = useSpring(pointerY, { damping: 30, stiffness: 110 });
  const x = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const y = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  return (
    <motion.div
      aria-label={t("ariaLabel")}
      className="relative mt-10 hidden min-h-[25rem] w-full max-w-2xl [perspective:1200px] lg:block"
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      onPointerMove={handlePointerMove}
      role="img"
      style={reduceMotion ? undefined : { x, y }}
    >
      <div className="bg-primary/15 absolute inset-[18%] rounded-full blur-3xl" />

      <motion.article
        animate={reduceMotion ? undefined : { y: [-5, 7] }}
        className="border-border/60 bg-card/72 absolute top-3 left-0 w-[63%] rounded-xl border p-5 shadow-lg backdrop-blur-xl"
        transition={floatingTransition}
        whileHover={reduceMotion ? undefined : { scale: 1.02, y: -3 }}
      >
        <div className="flex items-center gap-3">
          <span className="from-primary to-ai text-primary-foreground grid size-11 place-items-center rounded-full bg-gradient-to-br">
            <Heart aria-hidden className="size-5" fill="currentColor" />
          </span>
          <div>
            <p className="text-muted-foreground text-xs">{t("memoryLabel")}</p>
            <p className="font-semibold">{t("memoryTitle")}</p>
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-sm leading-6">
          {t("memoryText")}
        </p>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [6, -6] }}
        className="border-timeline/25 bg-card/76 absolute top-24 right-0 w-[48%] rounded-xl border p-4 shadow-md backdrop-blur-xl"
        transition={{ ...floatingTransition, duration: 6.2 }}
        whileHover={reduceMotion ? undefined : { scale: 1.025, x: -3 }}
      >
        <p className="text-timeline text-xs font-medium">
          {t("timelineLabel")}
        </p>
        <div className="mt-4 flex gap-3">
          <span className="bg-timeline ring-background mt-1 size-2.5 shrink-0 rounded-full ring-4" />
          <div>
            <p className="text-sm font-semibold">{t("timelineTitle")}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("timelineMeta")}
            </p>
          </div>
        </div>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [-4, 5] }}
        className="border-ai/25 bg-card/76 absolute top-52 left-12 w-[54%] rounded-xl border p-4 shadow-md backdrop-blur-xl"
        transition={{ ...floatingTransition, duration: 5.8 }}
        whileHover={reduceMotion ? undefined : { scale: 1.025, x: 3 }}
      >
        <div className="flex items-center gap-3">
          <span className="bg-ai text-ai-foreground grid size-9 place-items-center rounded-md">
            <Bot aria-hidden className="size-4" />
          </span>
          <div>
            <p className="text-muted-foreground text-xs">{t("aiLabel")}</p>
            <p className="text-sm font-medium">{t("aiText")}</p>
          </div>
        </div>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [5, -5] }}
        className="border-border/60 from-journal/25 bg-card/72 absolute right-6 bottom-3 w-[42%] rounded-xl border bg-gradient-to-br to-transparent p-4 shadow-md backdrop-blur-xl"
        transition={{ ...floatingTransition, duration: 6.6 }}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      >
        <Camera aria-hidden className="text-journal size-5" />
        <p className="mt-8 text-sm font-semibold">{t("photoTitle")}</p>
        <p className="text-muted-foreground mt-1 text-xs">{t("photoMeta")}</p>
      </motion.article>

      <motion.div
        animate={reduceMotion ? undefined : { y: [-4, 4] }}
        className="border-border/60 bg-card/76 absolute bottom-5 left-0 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-md backdrop-blur-xl"
        transition={{ ...floatingTransition, duration: 5 }}
      >
        <span className="bg-warning/14 text-warning grid size-9 place-items-center rounded-md">
          <BellRing aria-hidden className="size-4" />
        </span>
        <div>
          <p className="text-xs font-semibold">{t("reminderTitle")}</p>
          <p className="text-muted-foreground text-xs">{t("reminderMeta")}</p>
        </div>
      </motion.div>

      <Sparkles
        aria-hidden
        className="text-ai/50 absolute top-0 right-[24%] size-5"
      />
    </motion.div>
  );
}
