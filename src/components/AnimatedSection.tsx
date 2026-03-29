"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { brandEase } from "@/lib/motion-presets";

export function AnimatedSection({
  children,
  className,
  ...rest
}: HTMLMotionProps<"section">) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      className={className}
      initial={reduced ? false : { opacity: 0, y: 36 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.68, ease: brandEase }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
