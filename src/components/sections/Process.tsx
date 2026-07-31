"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import SectionHeading from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/content";

/**
 * "How we design your journey".
 *
 * Desktop — a sticky media panel on the left; the steps scroll past on the
 * right and progressively activate, with a vertical rule that draws itself
 * as the section moves through the viewport.
 *
 * Mobile — the same content as a soft accordion. No sticky, no rule.
 */
export default function Process() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const [active, setActive] = useState(0);
  const [openStep, setOpenStep] = useState(0);

  /* Which step owns the pinned panel: the LAST row whose top has crossed a
     line 65% down the viewport. One deterministic calculation per frame —
     unlike per-row IntersectionObservers, callbacks can't race each other,
     so a fast scroll can never skip a step or land on the wrong photo. */
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const rows = listRef.current?.querySelectorAll<HTMLLIElement>(
        ":scope > li",
      );
      if (!rows?.length) return;
      const line = window.innerHeight * 0.65;
      let idx = 0;
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top <= line) idx = i;
      });
      setActive((prev) => (prev === idx ? prev : idx));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 65%", "end 85%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative z-10 bg-ivory py-(--spacing-section-sm) md:py-(--spacing-section)"
    >
      <div className="mx-auto max-w-[100rem] px-6 md:px-10">
        <SectionHeading
          eyebrow="The process"
          lines={[
            "How we design",
            <>
              your <em className="font-normal italic">journey.</em>
            </>,
          ]}
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------ pinned media panel */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* All four stills stay mounted and simply cross-fade —
                    nothing to lazy-load at the moment of switching, so the
                    panel is never blank. */}
                {processSteps.map((step, i) => (
                  <div
                    key={step.number}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      active === i
                        ? "scale-100 opacity-100"
                        : "scale-[1.04] opacity-0"
                    }`}
                  >
                    <CinematicMedia
                      media={step.media}
                      playback="never"
                      sizes="40vw"
                      className="h-full w-full"
                    />
                  </div>
                ))}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <p className="font-serif text-5xl text-ivory/90">
                    {processSteps[active].number}
                  </p>
                  <p className="eyebrow text-[0.5625rem] text-gold">
                    {processSteps[active].title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------- steps (lg+) */}
          <div className="relative hidden lg:col-span-7 lg:block">
            {/* Track + drawn rule */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px bg-beige"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: lineScale, opacity: lineOpacity }}
              className="absolute left-0 top-0 h-full w-px origin-top bg-navy"
            />

            {/* Small runway so the final step can activate while the pinned
                panel is still in view — kept tight to avoid a dead gap. */}
            <ol ref={listRef} className="lg:pb-[10vh]">
              {processSteps.map((step, i) => (
                <StepRow key={step.number} step={step} isActive={active === i} />
              ))}
            </ol>
          </div>

          {/* ------------------------------------------ accordion (mobile) */}
          <div className="lg:hidden">
            <ol className="border-t border-beige">
              {processSteps.map((step, i) => {
                const isOpen = openStep === i;
                return (
                  <li key={step.number} className="border-b border-beige">
                    <button
                      type="button"
                      onClick={() => setOpenStep(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex items-baseline gap-5">
                        <span className="eyebrow text-[0.5625rem] text-gold-deep">
                          {step.number}
                        </span>
                        <span className="font-serif text-[1.8rem] leading-none text-navy">
                          {step.title}
                        </span>
                      </span>
                      {isOpen ? (
                        <Minus
                          className="h-4 w-4 shrink-0 text-sage-deep"
                          strokeWidth={1.25}
                          aria-hidden="true"
                        />
                      ) : (
                        <Plus
                          className="h-4 w-4 shrink-0 text-sage-deep"
                          strokeWidth={1.25}
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    <div
                      className={`grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-7">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <CinematicMedia
                              media={step.media}
                              playback="never"
                              sizes="100vw"
                              className="h-full w-full"
                            />
                          </div>
                          <p className="body-copy mt-5 text-charcoal/70">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- step row */

function StepRow({
  step,
  isActive,
}: {
  step: (typeof processSteps)[number];
  isActive: boolean;
}) {
  return (
    <li className="relative pl-10 xl:pl-14">
      {/* Node on the rule */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[3.35rem] block h-1.5 w-1.5 -translate-x-[0.1875rem] rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "scale-125 bg-gold" : "scale-100 bg-beige"
        }`}
      />

      <div
        className={`py-12 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:py-16 ${
          isActive ? "opacity-100" : "opacity-40"
        }`}
      >
        <p className="eyebrow text-[0.5625rem] text-sage-deep">{step.number}</p>
        <h3 className="mt-4 font-serif text-[2.4rem] leading-none text-navy xl:text-[3rem]">
          {step.title}
        </h3>
        <p className="body-copy mt-5 max-w-[42ch] text-charcoal/70">
          {step.description}
        </p>
      </div>
    </li>
  );
}
