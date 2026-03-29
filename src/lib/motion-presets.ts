/** Brand-aligned easing — smooth deceleration */
export const brandEase = [0.22, 1, 0.36, 1] as const;

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.07 },
  },
} as const;

/** Hero stats row: after headline motion (~0.91s), stagger each column */
export const heroStatsStaggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.92 },
  },
} as const;

export const fadeUpItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: brandEase },
  },
} as const;

export const cardRevealItem = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: brandEase },
  },
} as const;
