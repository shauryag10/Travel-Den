"use client";

import { motion } from "motion/react";
import { ArrowRight, Clock, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useRef } from "react";
import CinematicMedia from "@/components/ui/Media";
import Magnetic from "@/components/ui/MagneticButton";
import type { Destination } from "@/lib/content";
import { useEscapeKey, useScrollLock } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

const FACTS = [
  { key: "idealFor", label: "Ideal for", Icon: Sparkles },
  { key: "bestTime", label: "Best time to travel", Icon: Sun },
  { key: "duration", label: "Suggested duration", Icon: Clock },
] as const;

/**
 * Full-screen destination preview. Opens as a curtain from the foot of the
 * viewport, traps focus, closes on Escape or backdrop click.
 */
export default function DestinationModal({
  destination,
  onClose,
}: {
  destination: Destination;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useScrollLock(true);
  useEscapeKey(true, onClose);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div
        className="absolute inset-0 bg-navy-deep/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.country} — ${destination.title}`}
        initial={{ y: "4%", opacity: 0, clipPath: "inset(6% 0% 0% 0%)" }}
        animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ y: "3%", opacity: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
        className="absolute inset-0 overflow-y-auto bg-ivory"
      >
        {/* -------------------------------------------------- header bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-beige/70 bg-ivory/85 px-6 py-4 backdrop-blur-xl md:px-10">
          <p className="eyebrow flex items-center gap-3 text-[0.625rem] text-sage-deep">
            <span className="text-gold-deep">{destination.index}</span>
            {destination.country}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2.5 p-1.5 text-navy"
            aria-label="Close destination preview"
          >
            <span className="eyebrow text-[0.625rem]">Close</span>
            <X className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2">
          {/* ------------------------------------------------------ media */}
          <div className="relative h-[42vh] lg:sticky lg:top-[3.75rem] lg:h-[calc(100svh-3.75rem)]">
            <CinematicMedia
              media={destination.media}
              playback="auto"
              drift
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* -------------------------------------------------- editorial */}
          <div className="px-6 py-14 md:px-12 md:py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            >
              <h2 className="display-md text-navy">{destination.title}</h2>
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-sage-deep">
                {destination.feeling}
              </p>
              <p className="body-copy mt-8 max-w-[52ch] text-charcoal/75">
                {destination.intro}
              </p>

              <dl className="mt-12 border-t border-beige">
                {FACTS.map(({ key, label, Icon }) => (
                  <div
                    key={key}
                    className="flex items-baseline gap-5 border-b border-beige py-5"
                  >
                    <dt className="flex min-w-[13rem] items-center gap-3 eyebrow text-[0.5625rem] text-sage-deep">
                      <Icon
                        className="h-3.5 w-3.5 text-gold-deep"
                        strokeWidth={1.25}
                        aria-hidden="true"
                      />
                      {label}
                    </dt>
                    <dd className="text-[0.9375rem] text-charcoal/80">
                      {destination[key]}
                    </dd>
                  </div>
                ))}
              </dl>

              <Magnetic
                href="#contact"
                onClick={onClose}
                className="group mt-12 inline-flex items-center gap-3 bg-navy px-9 py-4 eyebrow text-[0.625rem] text-ivory transition-colors duration-500 hover:bg-navy-deep"
              >
                Design this journey
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
