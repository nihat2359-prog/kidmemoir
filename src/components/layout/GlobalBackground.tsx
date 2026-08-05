"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export function GlobalBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const reverseY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1.08, 1.16]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="landing-background-base absolute inset-0" />
      <motion.div
        className="bg-primary/14 absolute -top-[18rem] -left-[16rem] size-[42rem] rounded-full blur-3xl"
        style={reduceMotion ? undefined : { scale, y }}
      />
      <motion.div
        className="bg-ai/10 absolute top-[18%] -right-[18rem] size-[40rem] rounded-full blur-3xl"
        style={reduceMotion ? undefined : { y: reverseY }}
      />
      <motion.div
        className="bg-timeline/10 absolute top-[58%] left-[12%] size-[32rem] rounded-full blur-3xl"
        style={reduceMotion ? undefined : { scale }}
      />
      <div className="landing-background-grid absolute inset-0 opacity-45 dark:opacity-25" />
      <div className="landing-background-noise absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" />
      <div className="from-background/0 via-background/15 to-background/70 absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
