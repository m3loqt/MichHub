"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface PageLoaderProps {
  onComplete: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [showWordmark, setShowWordmark] = useState(true);
  const [splitting, setSplitting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Respect reduced motion — skip loader entirely
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setMounted(false);
      onCompleteRef.current();
      return;
    }

    // Phase 1–2: wordmark + progress bar (0–1800ms)
    const t1 = setTimeout(() => setShowWordmark(false), 1800);
    // Phase 4: panel split (2200ms)
    const t2 = setTimeout(() => setSplitting(true), 2200);
    // Phase 5: unmount (2800ms)
    const t3 = setTimeout(() => {
      setMounted(false);
      onCompleteRef.current();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Top panel */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[50vh] bg-[#0A0A0A] z-[9999] pointer-events-none"
        animate={splitting ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Bottom panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-[50vh] bg-[#0A0A0A] z-[9999] pointer-events-none"
        animate={splitting ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Wordmark — centered over both panels */}
      <AnimatePresence>
        {showWordmark && (
          <motion.div
            key="wordmark"
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center pointer-events-none select-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* MICH wordmark — Anton, white */}
            <span
              className="font-display text-white uppercase leading-none"
              style={{ fontSize: "clamp(52px,8vw,80px)", letterSpacing: "0.15em" }}
            >
              MICH
            </span>

            {/* STUDIOS label — DM Sans, orange */}
            <span
              className="font-sans text-[#F97316] uppercase"
              style={{
                fontSize: "clamp(11px,1.2vw,14px)",
                letterSpacing: "0.4em",
                marginTop: "6px",
              }}
            >
              STUDIOS
            </span>

            {/* Progress bar */}
            <div
              className="mt-8 overflow-hidden bg-white/10"
              style={{ width: "180px", height: "2px", borderRadius: "999px" }}
            >
              <motion.div
                className="h-full bg-[#F97316]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
