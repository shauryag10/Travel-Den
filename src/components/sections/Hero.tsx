"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MapPin, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import CursorGlow from "@/components/ui/CursorGlow";
import Magnetic from "@/components/ui/MagneticButton";
import { SplitLines } from "@/components/ui/Reveal";
import { Spark } from "@/components/brand/Logo";
import { heroScenes } from "@/lib/content";
import { site } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/** How long each scene holds before cross-fading to the next. */
const SCENE_MS = 7600;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* Scene rotation. Held still for reduced-motion and while paused. */
  useEffect(() => {
    if (reduced || paused || heroScenes.length < 2) return;
    const id = window.setInterval(
      () => setScene((s) => (s + 1) % heroScenes.length),
      SCENE_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  /* Parallax: the media drifts slower than the copy, and the copy settles
     back and fades as the next section arrives. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.93]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0.42, 0.72]);

  const active = heroScenes[scene];

  return (
    // Slightly taller than the viewport so the sticky layer holds — the hero
    // stays pinned for a beat before the next section lifts over it.
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[116svh] bg-navy-deep"
      aria-label="Travel Den — and the world is calling"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* ---------------------------------------------- background media */}
        <motion.div
          style={
            reduced ? undefined : { y: mediaY, scale: mediaScale }
          }
          className="absolute inset-0"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={active.media.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: EASE }}
              className="absolute inset-0"
            >
              <CinematicMedia
                media={active.media}
                priority={scene === 0}
                paused={paused}
                drift
                sizes="100vw"
                className="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navy veil — carries the type over any footage. */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-deep"
          style={{ opacity: reduced ? 0.5 : veil }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-navy-deep/85"
        />
        {/* The vertical gradient is transparent through its middle — which is
            exactly where the copy sits. This left-anchored scrim carries the
            type over a bright frame while leaving the right of the photo open. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-navy-deep/35 to-transparent lg:via-navy-deep/20"
        />

        <CursorGlow />

        {/* ---------------------------------------------------- foreground */}
        <motion.div
          style={
            reduced
              ? undefined
              : { y: contentY, scale: contentScale, opacity: contentOpacity }
          }
          className="relative z-20 flex h-full flex-col justify-center px-6 md:px-10"
        >
          <div className="mx-auto w-full max-w-[100rem]">
            <div className="max-w-[52rem] pt-20">
              {/* eyebrow, flanked by hairlines as in the reference */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.35 }}
                className="eyebrow mb-9 flex items-center gap-4 text-bluegrey"
              >
                <span className="h-px w-10 bg-bluegrey/45" aria-hidden="true" />
                Travel Den Returns
                <Spark className="h-2.5 w-2.5 text-gold" />
              </motion.p>

              <h1 className="display-xl text-ivory">
                <SplitLines
                  delay={0.5}
                  gap={0.11}
                  lines={[
                    <>
                      And the <em className="font-normal italic">world</em>
                    </>,
                    <>
                      is calling.
                      <Spark className="ml-4 inline-block h-6 w-6 align-super text-gold md:h-8 md:w-8" />
                    </>,
                  ]}
                />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 1.05 }}
                className="mt-9 font-serif text-xl text-ivory/90 md:text-2xl"
              >
                {site.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 1.2 }}
                className="body-copy mt-5 max-w-[44ch] text-bluegrey"
              >
                Private journeys, thoughtfully designed around your pace, your
                people, and the way you want to feel.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 1.35 }}
                className="mt-11 flex flex-wrap items-center gap-4"
              >
                <Magnetic
                  href="#destinations"
                  className="group inline-flex items-center gap-3 bg-navy px-8 py-4 eyebrow text-[0.625rem] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-navy"
                >
                  Explore Destinations
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Magnetic>

                <Magnetic
                  href="#contact"
                  strength={5}
                  className="inline-flex items-center gap-3 border border-ivory/35 px-8 py-4 eyebrow text-[0.625rem] text-ivory transition-colors duration-500 hover:border-ivory/80"
                >
                  Plan a Journey
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------ hero furniture */}

        {/* Location label — updates with the scene. */}
        <div className="absolute bottom-8 left-6 z-20 md:bottom-10 md:left-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={active.location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="eyebrow flex items-center gap-2.5 text-[0.5625rem] text-ivory/70"
            >
              <MapPin className="h-3 w-3 text-gold" strokeWidth={1.5} aria-hidden="true" />
              {active.location}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 1.7 }}
          className="absolute bottom-9 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          aria-label="Scroll to about"
        >
          <span className="eyebrow text-[0.5rem] text-ivory/55">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-ivory/25">
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-gold"
              animate={reduced ? undefined : { y: ["-100%", "300%"] }}
              transition={{
                duration: 2.4,
                ease: EASE,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          </span>
        </motion.a>

        {/* Accessible pause / play for the ambient background. */}
        <div className="absolute bottom-8 right-6 z-20 flex items-center gap-4 md:bottom-10 md:right-10">
          <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
            {heroScenes.map((s, i) => (
              <span
                key={s.location}
                className={`h-px transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  i === scene ? "w-8 bg-gold" : "w-3 bg-ivory/30"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={
              paused
                ? "Play background footage"
                : "Pause background footage"
            }
            className="inline-flex h-11 w-11 items-center justify-center border border-ivory/30 text-ivory/80 transition-colors duration-500 hover:border-ivory/70 hover:text-ivory"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
