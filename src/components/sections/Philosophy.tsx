"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import PillarIcon from "@/components/ui/PillarIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { pillars } from "@/lib/content";
import { useHasHover } from "@/lib/hooks";
import { EASE, inView } from "@/lib/motion";

/**
 * Full-bleed navy band. Hovering (or focusing) a pillar fades a matching
 * ambient still in behind the whole section — kept at very low opacity so it
 * reads as a shift in air rather than a background swap.
 *
 * On small screens the four pillars become a snap-scrolling row.
 */
export default function Philosophy() {
  const [active, setActive] = useState<number | null>(null);
  const hasHover = useHasHover();

  return (
    <section
      id="services"
      className="relative z-10 overflow-hidden bg-navy py-(--spacing-section-sm) md:py-(--spacing-section)"
    >
      {/* ------------------------------------------------ ambient backdrop */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={pillars[active].id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute inset-0"
            aria-hidden="true"
          >
            <Image
              src={pillars[active].ambient}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/55" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-[100rem] px-6 md:px-10">
        <SectionHeading
          eyebrow="We design"
          tone="light"
          align="center"
          lines={[
            "Journeys with intention,",
            <>
              comfort &amp;{" "}
              <em className="font-normal italic text-gold/95">quiet luxury.</em>
            </>,
          ]}
          className="mx-auto max-w-4xl"
        />

        {/* Gold hairline flourish under the heading */}
        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <span className="block h-px w-24 bg-gold/60" aria-hidden="true" />
        </Reveal>

        {/* ------------------------------------------------------- pillars */}
        <ul
          className="no-scrollbar -mx-6 mt-16 flex snap-x snap-mandatory gap-0 overflow-x-auto px-6 md:mx-0 md:mt-20 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4"
          onMouseLeave={() => hasHover && setActive(null)}
        >
          {pillars.map((pillar, i) => (
            <li
              key={pillar.id}
              className="relative w-[75vw] shrink-0 snap-center px-6 sm:w-[52vw] md:w-auto md:px-8"
            >
              {/* Divider that draws upward on entry (skipped on the first). */}
              {i > 0 && (
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={inView}
                  transition={{ duration: 1.1, ease: EASE, delay: i * 0.12 }}
                  className="absolute inset-y-2 left-0 hidden w-px origin-bottom bg-white/12 md:block"
                />
              )}

              <div
                tabIndex={0}
                onMouseEnter={() => hasHover && setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex h-full flex-col items-center text-center outline-offset-8"
              >
                <motion.div
                  animate={{ y: active === i ? -4 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={`transition-colors duration-700 ${
                    active === i ? "text-gold" : "text-bluegrey"
                  }`}
                >
                  <PillarIcon
                    icon={pillar.icon}
                    active={active === i}
                    className="h-11 w-11"
                  />
                </motion.div>

                <h3 className="eyebrow mt-7 text-[0.6875rem] text-ivory">
                  {pillar.title}
                </h3>

                {/* Gold underline grows on activation. */}
                <span
                  aria-hidden="true"
                  className={`mt-4 block h-px bg-gold transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active === i ? "w-10 opacity-90" : "w-0 opacity-0"
                  }`}
                />

                <p className="mt-4 max-w-[24ch] text-[0.8125rem] leading-relaxed text-bluegrey/85">
                  {pillar.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Swipe affordance, mobile only */}
        <p className="eyebrow mt-8 text-center text-[0.5rem] text-bluegrey/70 md:hidden">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}
