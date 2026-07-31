"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useHasHover, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How far the element may drift toward the cursor, in px. Keep it small. */
  strength?: number;
  ariaLabel?: string;
  type?: "button" | "submit";
};

/**
 * Subtle magnetic hover. The element leans a few pixels toward the cursor and
 * springs back on exit. Disabled on touch and under reduced-motion, where it
 * renders as a plain link/button with no listeners attached.
 */
export default function Magnetic({
  children,
  href,
  onClick,
  className = "",
  strength = 8,
  ariaLabel,
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();
  const enabled = hasHover && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });
  const tx = useTransform(sx, (v) => v);
  const ty = useTransform(sy, (v) => v);

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    className,
    style: { x: tx, y: ty },
    onMouseMove: enabled ? onMove : undefined,
    onMouseLeave: enabled ? reset : undefined,
    onBlur: enabled ? reset : undefined,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        {...shared}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      {...shared}
    >
      {children}
    </motion.button>
  );
}
