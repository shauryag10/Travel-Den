"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { clipReveal, fadeUp, inView, stagger } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** `fade` lifts and fades; `clip` wipes upward — use `clip` for imagery. */
  variant?: "fade" | "clip";
  as?: "div" | "section" | "li" | "article" | "span";
};

/** The default entrance wrapper. One import, used everywhere. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={variant === "clip" ? clipReveal : fadeUp}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Parent that walks children in sequentially. Children use `RevealItem`. */
export function RevealGroup({
  children,
  className,
  delay = 0,
  gap = 0.1,
  as = "div",
}: Omit<RevealProps, "variant"> & { gap?: number }) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(delay, gap)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  variant = "fade",
  as = "div",
}: Omit<RevealProps, "delay">) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variant === "clip" ? clipReveal : fadeUp}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Masked line-by-line headline reveal.
 *
 * Pass an array of lines; each is clipped by its own overflow-hidden box and
 * slides up from beneath. `dangerous` allows the small amount of inline markup
 * we use for italic emphasis words — the content is authored, never user input.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  gap = 0.09,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(delay, gap)}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className={lineClassName}
            style={{ display: "block", willChange: "transform" }}
            variants={{
              hidden: { y: "108%" },
              show: {
                y: 0,
                transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
