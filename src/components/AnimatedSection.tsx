"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useState, useEffect } from "react";
import { brandEase } from "@/lib/motion-presets";

export function AnimatedSection({
  children,
  className,
  ...rest
}: HTMLMotionProps<"section">) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.section
      className={className}
      // Only apply initial values after hydration — framer-motion v12 writes
      // CSS custom properties to SSR inline styles which React flags as a
      // hydration mismatch. `initial={false}` on first render avoids this.
      initial={mounted && !reduced ? { opacity: 0, y: 36 } : false}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.68, ease: brandEase }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
