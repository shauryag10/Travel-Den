"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import DestinationModal from "./DestinationModal";
import { destinations } from "@/lib/content";
import { useHasHover, useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/** Drag threshold in px — below this a pointer-up counts as a click, not a drag. */
const DRAG_SLOP = 6;

export default function Destinations() {
  const [active, setActive] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useIsDesktop();
  const hasHover = useHasHover();

  /* ------------------------------------------------ deep link / history */

  // Open from ?destination=slug on first paint so a shared link lands correctly.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("destination");
    if (!slug) return;
    const index = destinations.findIndex((d) => d.slug === slug);
    if (index === -1) return;
    setActive(index);
    setOpenSlug(slug);
  }, []);

  const open = useCallback((slug: string) => {
    setOpenSlug(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("destination", slug);
    history.pushState({ destination: slug }, "", url);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("destination");
    history.pushState({}, "", url);
  }, []);

  // Browser back should dismiss the modal rather than leave the page.
  useEffect(() => {
    const onPop = () => {
      const slug = new URLSearchParams(window.location.search).get("destination");
      setOpenSlug(slug);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* ------------------------------------------------------ drag to scroll */

  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isDesktop || !scrollerRef.current) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: scrollerRef.current.scrollLeft,
      moved: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!drag.current.down || !el) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    if (drag.current.moved > DRAG_SLOP) {
      el.scrollLeft = drag.current.startScroll - dx;
    }
  };

  const endDrag = () => {
    drag.current.down = false;
  };

  const activeDestination = destinations[active];
  const modalDestination = destinations.find((d) => d.slug === openSlug);

  return (
    <section
      id="destinations"
      className="relative z-10 overflow-hidden py-(--spacing-section-sm) transition-colors duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:py-(--spacing-section)"
      style={{ backgroundColor: activeDestination.tint }}
    >
      {/* Ambient wash of the active destination, very low opacity. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDestination.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.14 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${activeDestination.media.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(28px)",
          }}
        />
      </AnimatePresence>

      <div className="relative">
        <div className="mx-auto max-w-[100rem] px-6 md:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Popular escapes"
              tone="light"
              lines={[
                "Where will your next",
                <>
                  <em className="font-normal italic">escape</em> take you?
                </>,
              ]}
            />

            {/* Live readout of the active card — reactive text, per spec. */}
            <div className="min-h-[4.5rem] lg:max-w-sm lg:text-right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDestination.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <p className="eyebrow text-[0.5625rem] text-gold">
                    {activeDestination.index} — {activeDestination.country}
                  </p>
                  <p className="mt-3 font-serif text-lg italic leading-relaxed text-ivory/80">
                    {activeDestination.feeling}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- the gallery */}
        <Reveal className="mt-14 md:mt-16">
          <div
            ref={scrollerRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            role="list"
            aria-label="Destinations"
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 md:px-10 lg:snap-none lg:drag-cursor"
          >
            {destinations.map((destination, i) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                index={i}
                isActive={active === i}
                isDesktop={isDesktop}
                hasHover={hasHover}
                onActivate={() => setActive(i)}
                onOpen={() => {
                  // Suppress the click that ends a drag.
                  if (drag.current.moved > DRAG_SLOP) return;
                  setActive(i);
                  open(destination.slug);
                }}
              />
            ))}
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-[100rem] px-6 md:px-10">
          <p className="eyebrow text-[0.5rem] text-ivory/45">
            <span className="lg:hidden">Swipe to browse</span>
            <span className="hidden lg:inline">
              Drag to browse — select a destination to preview
            </span>
          </p>
        </div>
      </div>

      <AnimatePresence>
        {modalDestination && (
          <DestinationModal destination={modalDestination} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ card */

function DestinationCard({
  destination,
  index,
  isActive,
  isDesktop,
  hasHover,
  onActivate,
  onOpen,
}: {
  destination: (typeof destinations)[number];
  index: number;
  isActive: boolean;
  isDesktop: boolean;
  hasHover: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  const canTilt = hasHover && !reduced;

  const onMove = (e: React.MouseEvent) => {
    if (!canTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    // Deliberately tiny — a lean, not a flip.
    setTilt({ x: -py * 4, y: px * 5 });
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      role="listitem"
      onMouseEnter={isDesktop ? onActivate : undefined}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onFocus={onActivate}
      onClick={onOpen}
      aria-label={`${destination.country} — ${destination.title}. Open preview.`}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ transformPerspective: 1200 }}
      className={`group relative h-[24rem] shrink-0 snap-center overflow-hidden text-left transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[30rem] lg:h-[34rem] ${
        isActive
          ? "w-[80vw] sm:w-[60vw] lg:w-[34rem]"
          : "w-[80vw] sm:w-[60vw] lg:w-[12rem]"
      }`}
    >
      <CinematicMedia
        media={destination.media}
        playback="active"
        isActive={isActive && isDesktop}
        sizes="(max-width: 1024px) 80vw, 34rem"
        className={`h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "scale-100" : "scale-105"
        }`}
      />

      {/* Readability scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/15 to-navy-deep/25"
      />

      {/* Index, pinned top-left */}
      <span className="absolute left-5 top-5 eyebrow text-[0.5625rem] text-ivory/65">
        {destination.index}
      </span>

      {/* Label block */}
      <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
        <p className="eyebrow text-[0.5625rem] text-gold">
          {destination.country}
        </p>

        <h3
          className={`mt-2.5 font-serif leading-tight text-ivory transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isActive ? "text-[1.75rem]" : "text-[1.25rem]"
          }`}
        >
          {destination.title}
        </h3>

        {/* Feeling line + affordance appear only on the expanded card. */}
        <div
          className={`grid transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isActive
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-ivory/75">
              {destination.feeling}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 eyebrow text-[0.5625rem] text-ivory">
              View destination
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Gold rule marking the active card */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <span className="sr-only">{index + 1}</span>
    </motion.button>
  );
}
