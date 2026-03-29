"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  value: string;
  className?: string;
  /** Total time from start until final value is shown */
  scrambleMs?: number;
  /**
   * When set, animation starts this many ms after mount (no scroll needed).
   * Use under the hero after the headline block finishes (e.g. ~1000ms).
   */
  startAfterMs?: number;
};

function randomDigits(chars: string[]): string {
  return chars
    .map((c) => (/\d/.test(c) ? String(Math.floor(Math.random() * 10)) : c))
    .join("");
}

/**
 * Metrics: digits scramble on a eased cadence, then blend to the final value.
 * Trigger via scroll (`useInView`) or a fixed delay (`startAfterMs`).
 */
export function JumblingMetric({
  value,
  className,
  scrambleMs = 2200,
  startAfterMs,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const useDelay = startAfterMs !== undefined;
  const isInView = useInView(ref, {
    once: true,
    amount: 0.35,
    margin: "0px 0px -12% 0px",
  });
  const prefersReducedMotion = useReducedMotion();
  const [delayArmed, setDelayArmed] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!useDelay) return;
    const id = window.setTimeout(() => setDelayArmed(true), startAfterMs);
    return () => clearTimeout(id);
  }, [useDelay, startAfterMs]);

  const shouldRun = useDelay ? delayArmed : isInView;

  useEffect(() => {
    if (prefersReducedMotion) {
      setText(value);
      return;
    }
    if (!shouldRun) return;

    const chars = value.split("");
    const hasDigit = chars.some((c) => /\d/.test(c));
    if (!hasDigit) {
      setText(value);
      return;
    }

    setText(randomDigits(chars));
    const start = performance.now();
    let raf = 0;
    let lastFlip = start;
    /** First ~62%: throttled random; rest: ease toward final digits */
    const randomPhaseEnd = scrambleMs * 0.62;
    const minFlipGapRandom = 52;
    const minFlipGapBlend = 42;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= scrambleMs) {
        setText(value);
        return;
      }

      if (elapsed < randomPhaseEnd) {
        if (now - lastFlip < minFlipGapRandom) {
          raf = requestAnimationFrame(tick);
          return;
        }
        lastFlip = now;
        setText(randomDigits(chars));
        raf = requestAnimationFrame(tick);
        return;
      }

      if (now - lastFlip < minFlipGapBlend) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFlip = now;

      const u = (elapsed - randomPhaseEnd) / (scrambleMs - randomPhaseEnd);
      const settleBias = u * u * (3 - 2 * u);
      const next = chars.map((c) => {
        if (!/\d/.test(c)) return c;
        if (Math.random() < settleBias) return c;
        return String(Math.floor(Math.random() * 10));
      });
      setText(next.join(""));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldRun, value, scrambleMs, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
