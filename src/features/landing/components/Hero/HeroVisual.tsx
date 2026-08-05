"use client";

import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BellRing,
  Bot,
  Camera,
  Heart,
  Mic2,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

const floatTransition = {
  duration: 5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
} as const;

export function HeroVisual() {
  const t = useTranslations("landing.hero");
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 28, stiffness: 120 });
  const smoothY = useSpring(pointerY, { damping: 28, stiffness: 120 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  return (
    <motion.div
      aria-label={t("visualAriaLabel")}
      className="relative mx-auto min-h-[32rem] w-full max-w-2xl [perspective:1200px] md:min-h-[38rem]"
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      onPointerMove={handlePointerMove}
      role="img"
      style={reduceMotion ? undefined : { rotateX, rotateY }}
    >
      <div className="bg-primary/15 absolute inset-[15%] rounded-full blur-3xl" />

      <motion.article
        animate={reduceMotion ? undefined : { y: [-6, 7] }}
        className="border-border/60 bg-card/72 absolute top-4 left-0 w-[72%] rounded-xl border p-5 shadow-lg backdrop-blur-xl md:left-8 md:w-[58%]"
        transition={floatTransition}
        whileHover={reduceMotion ? undefined : { scale: 1.025, y: -4 }}
      >
        <div className="flex items-center gap-3">
          <span className="from-primary to-ai text-primary-foreground grid size-12 place-items-center rounded-full bg-gradient-to-br">
            <Heart aria-hidden className="size-5" fill="currentColor" />
          </span>
          <div>
            <p className="text-muted-foreground text-xs font-medium">
              {t("profileLabel")}
            </p>
            <h2 className="font-semibold">{t("profileName")}</h2>
            <p className="text-muted-foreground text-xs">{t("profileAge")}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden>
          <span className="from-journal/30 h-16 rounded-md bg-gradient-to-br to-transparent" />
          <span className="from-timeline/30 h-16 rounded-md bg-gradient-to-br to-transparent" />
          <span className="from-ai/25 h-16 rounded-md bg-gradient-to-br to-transparent" />
        </div>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [8, -7] }}
        className="border-border/60 bg-card/76 absolute top-28 right-0 w-[62%] rounded-xl border p-4 shadow-lg backdrop-blur-xl md:top-36 md:w-[52%]"
        transition={{ ...floatTransition, duration: 6 }}
        whileHover={reduceMotion ? undefined : { scale: 1.03, x: -4 }}
      >
        <div className="flex items-center justify-between">
          <Badge variant="timeline">{t("timelineLabel")}</Badge>
          <Star
            aria-hidden
            className="text-warning size-4"
            fill="currentColor"
          />
        </div>
        <div className="mt-5 flex gap-3">
          <span className="bg-timeline ring-background size-3 shrink-0 rounded-full ring-4" />
          <div>
            <h2 className="font-semibold">{t("timelineTitle")}</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("timelineMeta")}
            </p>
          </div>
        </div>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [-4, 6] }}
        className="border-ai/25 bg-card/74 absolute top-56 left-2 w-[68%] rounded-xl border p-4 shadow-lg backdrop-blur-xl md:top-64 md:left-14 md:w-[58%]"
        transition={{ ...floatTransition, duration: 5.5 }}
        whileHover={reduceMotion ? undefined : { scale: 1.025, x: 4 }}
      >
        <div className="flex items-center gap-2">
          <span className="bg-ai text-ai-foreground grid size-9 place-items-center rounded-md">
            <Bot aria-hidden className="size-4" />
          </span>
          <div>
            <p className="text-muted-foreground text-xs">{t("aiLabel")}</p>
            <p className="text-sm font-medium">{t("aiMessage")}</p>
          </div>
        </div>
      </motion.article>

      <motion.article
        animate={reduceMotion ? undefined : { y: [5, -5] }}
        className="border-border/60 bg-card/78 absolute right-2 bottom-24 w-[58%] rounded-xl border p-4 shadow-md backdrop-blur-xl md:right-10 md:bottom-28 md:w-[48%]"
        transition={{ ...floatTransition, duration: 4.5 }}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      >
        <div className="flex gap-3">
          <span className="bg-warning/16 text-warning-foreground grid size-10 place-items-center rounded-md">
            <BellRing aria-hidden className="size-4" />
          </span>
          <div>
            <p className="text-muted-foreground text-xs">
              {t("reminderLabel")}
            </p>
            <p className="text-sm font-semibold">{t("reminderTitle")}</p>
            <p className="text-muted-foreground text-xs">{t("reminderMeta")}</p>
          </div>
        </div>
      </motion.article>

      <motion.div
        animate={reduceMotion ? undefined : { y: [-5, 5], rotate: [-2, 1] }}
        className="border-border/60 from-journal/30 bg-card/70 absolute bottom-3 left-0 w-40 rounded-xl border bg-gradient-to-br to-transparent p-3 shadow-md backdrop-blur-xl md:left-4"
        transition={{ ...floatTransition, duration: 6.5 }}
      >
        <Camera aria-hidden className="text-journal size-5" />
        <p className="mt-8 text-xs font-semibold">{t("photoTitle")}</p>
        <p className="text-muted-foreground text-xs">{t("photoLabel")}</p>
      </motion.div>
      <motion.div
        animate={reduceMotion ? undefined : { y: [4, -6] }}
        className="border-border/60 bg-card/75 absolute right-0 bottom-0 flex items-center gap-2 rounded-xl border p-3 shadow-md backdrop-blur-xl"
        transition={{ ...floatTransition, duration: 5.8 }}
      >
        <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-full">
          <Play aria-hidden className="ml-0.5 size-4" fill="currentColor" />
        </span>
        <div>
          <p className="text-xs font-semibold">{t("videoLabel")}</p>
          <p className="text-muted-foreground text-xs">{t("videoDuration")}</p>
        </div>
      </motion.div>
      <motion.div
        animate={reduceMotion ? undefined : { x: [-3, 4] }}
        className="border-border/60 bg-card/70 absolute top-[47%] right-1 flex items-center gap-2 rounded-full border px-3 py-2 shadow-md backdrop-blur-xl md:right-4"
        transition={{ ...floatTransition, duration: 5 }}
      >
        <Mic2 aria-hidden className="text-ai size-4" />
        <span className="text-xs font-medium">{t("audioTitle")}</span>
      </motion.div>
      <Sparkles
        aria-hidden
        className="text-ai/50 absolute top-2 right-[22%] size-6"
      />
    </motion.div>
  );
}
