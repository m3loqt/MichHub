"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface PageLoaderProps {
  onComplete: () => void;
}

// logoalt.svg viewBox="0 0 309 348" — maintain exact aspect ratio
const LOGO_W = 168;
const LOGO_H = Math.round(LOGO_W * (348 / 309)); // ≈ 189

const ORANGE_FILTER =
  "brightness(0) saturate(100%) invert(58%) sepia(96%) saturate(3207%) hue-rotate(348deg) brightness(101%)";

const WHITE_FILTER = "brightness(0) invert(1)";

export function PageLoader({ onComplete }: PageLoaderProps) {
  // Start false so server renders null → no hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [sliding, setSliding] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Skip loader entirely for reduced-motion users
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      onCompleteRef.current();
      return;
    }

    // Show the loader (client-only, no SSR mismatch)
    setMounted(true);

    const t1 = setTimeout(() => setShowLogo(false), 1800);   // logo fades out
    const t2 = setTimeout(() => {
      setSliding(true);
      onCompleteRef.current();   // reveal main EXACTLY as panel starts sliding up
    }, 2150);
    const t3 = setTimeout(() => setMounted(false), 2900);    // unmount after slide completes

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A]"
      animate={sliding ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatePresence>
        {showLogo && (
          <motion.div
            key="logo"
            className="pointer-events-none select-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              transition: { duration: 0.28, ease: "easeIn" },
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* White base + orange bucket-fill overlay */}
            <div style={{ position: "relative", width: LOGO_W, height: LOGO_H }}>

              {/* White base */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoalt.svg"
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchPriority="high"
                style={{
                  display: "block",
                  width: LOGO_W,
                  height: LOGO_H,
                  filter: WHITE_FILTER,
                  userSelect: "none",
                }}
              />

              {/* Orange fill — clip container grows upward from bottom */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  overflow: "hidden",
                }}
                initial={{ height: 0 }}
                animate={{ height: LOGO_H }}
                transition={{
                  duration: 1.1,
                  delay: 0.42,
                  ease: [0.37, 0, 0.63, 1],
                }}
              >
                {/* Orange logo pinned to bottom so clipping reveals bottom → top */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logoalt.svg"
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    display: "block",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: LOGO_W,
                    height: LOGO_H,
                    filter: ORANGE_FILTER,
                    userSelect: "none",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
