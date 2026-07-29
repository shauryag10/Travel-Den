"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { introCards } from "@/lib/content";
import { useHasHover } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/**
 * Ivory editorial statement. The three cards deliberately sit at different
 * heights and ratios — a straight symmetrical row reads as a template.
 */
export default function Intro() {
  const [hovered, setHovered] = useState<number | null>(null);
  const hasHover = useHasHover();

  /* Per-card offsets and ratios — the asymmetry is the composition. */
  const layout = [
    { offset: "lg:mt-0", ratio: "aspect-[3/4]" },
    { offset: "lg:mt-20", ratio: "aspect-[4/5]" },
    { offset: "lg:mt-8", ratio: "aspect-[3/4]" },
  ];

  return (
    <section
      id="about"
      className="relative z-10 bg-ivory py-(--spacing-section-sm) md:py-(--spacing-section)"
    >
      <div className="mx-auto max-w-[100rem] px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------------ left column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="About Travel Den"
              lines={[
                "Travel beyond",
                <>
                  the <em className="font-normal italic">ordinary.</em>
                </>,
              ]}
              body="We craft journeys that go beyond checklists and crowded itineraries. Every detail is shaped around your pace, your preferences, and your story."
            />

            <Reveal delay={0.25}>
              <a
                href="#services"
                className="group mt-11 inline-flex items-center gap-3 eyebrow text-[0.625rem] text-navy"
              >
                <span className="link-underline">Know our story</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </Reveal>
          </div>

          {/* ----------------------------------------------- right column */}
          <RevealGroup
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-6"
            gap={0.13}
          >
            {introCards.map((card, i) => {
              const isDimmed = hasHover && hovered !== null && hovered !== i;
              return (
                <RevealItem
                  key={card.title}
                  as="article"
                  className={`${layout[i].offset} ${
                    i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <motion.div
                    onMouseEnter={() => hasHover && setHovered(i)}
                    onMouseLeave={() => hasHover && setHovered(null)}
                    animate={{
                      opacity: isDimmed ? 0.55 : 1,
                      y: hasHover && hovered === i ? -8 : 0,
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="group"
                  >
                    <div
                      className={`relative overflow-hidden ${layout[i].ratio}`}
                    >
                      <CinematicMedia
                        media={card.media}
                        playback="active"
                        isActive={hovered === i}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
                        className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                      {/* Description surfaces from the foot of the frame. */}
                      <div
                        aria-hidden={hasHover ? hovered !== i : false}
                        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 to-transparent p-5 pt-14 opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <p className="text-[0.8125rem] leading-relaxed text-ivory/90">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-beige pt-4">
                      <h3 className="font-serif text-[1.35rem] leading-snug text-navy">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] text-charcoal/55">
                        {card.line}
                      </p>
                    </div>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
