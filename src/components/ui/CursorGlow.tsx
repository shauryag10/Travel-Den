"use client";

import { useEffect, useRef } from "react";
import { useHasHover, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A soft lens of warm light that trails the cursor inside its parent.
 * Desktop-only, decorative, and written with raw rAF + a CSS variable rather
 * than React state so it never triggers a re-render.
 *
 * Parent must be `relative`.
 */
export default function CursorGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasHover || reduced) return;

    const parent = el.parentElement;
    if (!parent) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        el.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const tick = () => {
      // Lag the glow behind the pointer — it should feel like light, not a dot.
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [hasHover, reduced]);

  if (!hasHover || reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-10 h-[34rem] w-[34rem] opacity-0 transition-opacity duration-700 ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(197,169,106,0.13) 0%, rgba(197,169,106,0.05) 38%, transparent 68%)",
      }}
    />
  );
}
