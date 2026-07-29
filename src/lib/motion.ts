import type { Variants, Transition } from "framer-motion";

/**
 * One easing curve and three duration bands for the whole site, so every
 * animation feels like it came from the same hand.
 *
 *   micro     200–350ms   hovers, buttons, underlines
 *   reveal    700–1100ms  section and text entrances
 *   cinematic 1400ms+     hero and ambient movement
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  micro: 0.3,
  reveal: 0.9,
  cinematic: 1.4,
} as const;

export const transition: Transition = {
  duration: DURATION.reveal,
  ease: EASE,
};

/** Standard viewport trigger — fires once, slightly before full entry. */
export const inView = { once: true, amount: 0.25, margin: "0px 0px -8% 0px" };

/** Soft fade + lift. The default entrance for almost everything. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
};

/** Masked line reveal — pair with a `.line-mask` parent that clips. */
export const lineReveal: Variants = {
  hidden: { y: "108%" },
  show: {
    y: 0,
    transition: { duration: 1.05, ease: EASE },
  },
};

/** Clip-path wipe for imagery. Reveals bottom-to-top like a curtain lifting. */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.2, ease: EASE },
  },
};

/** Parent that walks its children in, one after another. */
export const stagger = (delayChildren = 0, staggerChildren = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});
