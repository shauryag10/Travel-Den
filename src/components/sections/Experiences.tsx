"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { experiences } from "@/lib/content";

/**
 * Signature experiences.
 *
 * A horizontal rail stepped with previous/next arrows (plus native swipe on
 * touch). No scroll-jacking — the page keeps scrolling normally.
 *
 * Only the hovered card's video plays; everything else shows its poster.
 */
export default function Experiences() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  /* Track scroll position for arrow state + the progress hairline. */
  const syncScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 0})`;
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncScroll();
    el.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);
    return () => {
      el.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
    };
  }, [syncScroll]);

  /* Step by exactly one card (card width + gap). */
  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "32") || 32;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const arrowClass =
    "inline-flex h-11 w-11 items-center justify-center border border-navy/20 text-navy transition-all duration-500 hover:border-navy/60 disabled:cursor-default disabled:opacity-30 disabled:hover:border-navy/20";

  return (
    <section
      id="experiences"
      className="relative z-10 overflow-hidden bg-ivory-warm py-(--spacing-section-sm) md:py-(--spacing-section)"
    >
      <div className="mx-auto max-w-[100rem] px-6 md:px-16 xl:px-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Signature experiences"
            lines={[
              "Not just places.",
              <>
                Ways of <em className="font-normal italic">experiencing</em>{" "}
                them.
              </>,
            ]}
          />

          {/* Arrows + progress hairline */}
          <Reveal className="flex items-end gap-6">
            <span
              className="relative mb-5 hidden h-px w-40 bg-navy/15 sm:block"
              aria-hidden="true"
            >
              <span
                ref={fillRef}
                className="absolute inset-0 block origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={!canPrev}
                aria-label="Previous experience"
                className={arrowClass}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={!canNext}
                aria-label="Next experience"
                className={arrowClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ----------------------------------------------------------- rail */}
      <RevealGroup gap={0.08} className="mt-12 md:mt-16">
        <div
          ref={scrollerRef}
          role="list"
          aria-label="Signature experiences"
          className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-6 scroll-pl-6 md:px-16 md:scroll-pl-16 xl:px-28 xl:scroll-pl-28"
        >
          {experiences.map((experience, i) => (
            <RevealItem
              key={experience.title}
              as="article"
              className="w-[80vw] shrink-0 snap-center sm:w-[24rem] lg:w-[26rem] lg:snap-start"
            >
              <div
                data-card
                className="group relative"
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="grain relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]">
                  <CinematicMedia
                    media={experience.media}
                    playback="active"
                    isActive={activeCard === i}
                    sizes="(max-width: 640px) 80vw, 26rem"
                    className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-transparent to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="eyebrow text-[0.5rem] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-serif text-[1.6rem] leading-tight text-ivory">
                      {experience.title}
                    </h3>

                    {/* Copy reveals on hover (desktop) / always shown below lg. */}
                    <div className="grid grid-rows-[1fr] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="mt-3 max-w-[34ch] text-[0.8125rem] leading-relaxed text-ivory/75">
                          {experience.line}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
