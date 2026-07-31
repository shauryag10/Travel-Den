"use client";

import type { ReactNode } from "react";
import { Reveal, SplitLines } from "./Reveal";

/**
 * The three-part section head repeated across the site:
 *   eyebrow → oversized serif headline → optional body line.
 *
 * Keeping it in one component is what holds the vertical rhythm together.
 */
export default function SectionHeading({
  eyebrow,
  lines,
  body,
  tone = "dark",
  align = "left",
  size = "lg",
  className = "",
  children,
}: {
  eyebrow?: string;
  lines: ReactNode[];
  body?: ReactNode;
  /** `dark` = charcoal on ivory, `light` = ivory on navy. */
  tone?: "dark" | "light";
  align?: "left" | "center";
  size?: "lg" | "md";
  className?: string;
  children?: ReactNode;
}) {
  const isLight = tone === "light";

  return (
    <div
      className={`${align === "center" ? "text-center" : ""} ${className}`}
    >
      {eyebrow && (
        <Reveal>
          <p
            className={`eyebrow mb-7 ${
              isLight ? "text-bluegrey" : "text-sage-deep"
            }`}
          >
            {eyebrow}
          </p>
        </Reveal>
      )}

      <h2
        className={`${size === "lg" ? "display-lg" : "display-md"} ${
          isLight ? "text-ivory" : "text-navy"
        }`}
      >
        <SplitLines lines={lines} className="block" />
      </h2>

      {body && (
        <Reveal delay={0.15}>
          <p
            className={`body-copy mt-8 max-w-[46ch] ${
              align === "center" ? "mx-auto" : ""
            } ${isLight ? "text-bluegrey" : "text-charcoal/70"}`}
          >
            {body}
          </p>
        </Reveal>
      )}

      {children}
    </div>
  );
}
