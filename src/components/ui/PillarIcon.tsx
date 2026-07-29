"use client";

import { motion } from "framer-motion";
import { inView } from "@/lib/motion";
import type { Pillar } from "@/lib/content";

/**
 * Hand-drawn line icons that stroke themselves into view.
 *
 * Drawn here rather than pulled from an icon set so they match the reference's
 * thin, geometric mark language — and so `pathLength` can be animated, which
 * off-the-shelf icon components don't expose.
 */

const PATHS: Record<Pillar["icon"], string[]> = {
  // Globe — meridian grid
  globe: [
    "M20 3.5a16.5 16.5 0 1 0 0 33 16.5 16.5 0 0 0 0-33Z",
    "M20 3.5c4.4 4.4 6.6 10 6.6 16.5S24.4 32.1 20 36.5c-4.4-4.4-6.6-10-6.6-16.5S15.6 7.9 20 3.5Z",
    "M4.6 14.2h30.8M4.6 25.8h30.8",
  ],
  // Gem — brilliant cut
  gem: [
    "M20 36 4.5 16.2 11 5h18l6.5 11.2L20 36Z",
    "M4.5 16.2h31M11 5l4 11.2L20 36l5-19.8L29 5",
  ],
  // Mountains — two overlapping peaks
  mountain: [
    "M3 32.5 15.5 10l8 14.5",
    "M17.5 32.5 27 15l10 17.5H3",
  ],
  // Compass — ring with needle
  compass: [
    "M20 4.5a15.5 15.5 0 1 0 0 31 15.5 15.5 0 0 0 0-31Z",
    "M26.5 13.5 22.6 22.6 13.5 26.5 17.4 17.4l9.1-3.9Z",
  ],
};

export default function PillarIcon({
  icon,
  className = "",
  active = false,
}: {
  icon: Pillar["icon"];
  className?: string;
  active?: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {PATHS[icon].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={active ? 1.15 : 0.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: {
                  duration: 1.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15 + i * 0.18,
                },
                opacity: { duration: 0.3, delay: 0.15 + i * 0.18 },
              },
            },
          }}
          style={{ transition: "stroke-width 500ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      ))}
    </motion.svg>
  );
}
