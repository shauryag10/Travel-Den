"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import CinematicMedia from "@/components/ui/Media";
import Magnetic from "@/components/ui/MagneticButton";
import { Reveal, SplitLines } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

const ctaMedia = {
  image: "/images/cta/escape.jpg",
  video: "/videos/cta/escape.mp4",
  alt: "Dusk settling over a calm coastline",
};

export default function FinalCta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Very slow background creep — barely perceptible, per spec.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-navy-deep"
      aria-label="Start planning your journey"
    >
      <motion.div
        style={reduced ? undefined : { y: mediaY }}
        className="absolute -inset-y-[10%] inset-x-0"
        aria-hidden="true"
      >
        <CinematicMedia
          media={ctaMedia}
          playback="auto"
          drift
          sizes="100vw"
          className="h-full w-full"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-navy-deep/70"
      />

      <div className="relative mx-auto flex min-h-[82svh] max-w-[100rem] flex-col justify-center px-6 py-28 md:px-10">
        <div className="max-w-3xl">
          <h2 className="display-lg text-ivory">
            <SplitLines
              lines={[
                <>
                  Let&rsquo;s craft <em className="font-normal italic">your</em>
                </>,
                "perfect escape.",
              ]}
            />
          </h2>

          <Reveal delay={0.2}>
            <p className="body-copy mt-8 max-w-[44ch] text-bluegrey">
              Tell us where you want to go—or simply how you want to feel.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <SwapLabelButton />

              <Magnetic
                href={site.contact.whatsapp}
                strength={5}
                className="inline-flex items-center gap-3 border border-ivory/35 px-9 py-4 eyebrow text-[0.625rem] text-ivory transition-colors duration-500 hover:border-ivory/80"
              >
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                WhatsApp Us
              </Magnetic>
            </div>
          </Reveal>

          {/* Contact details, quiet and small */}
          <Reveal delay={0.45}>
            <div className="mt-16 flex flex-col gap-2.5 border-t border-white/12 pt-8 text-[0.8125rem] text-bluegrey/85 sm:flex-row sm:flex-wrap sm:gap-x-10">
              <a
                href={site.contact.phoneHref}
                className="link-underline w-fit"
              >
                {site.contact.phone}
              </a>
              <a
                href={site.contact.emailHref}
                className="link-underline w-fit"
              >
                {site.contact.email}
              </a>
              <span className="text-bluegrey/60">
                {site.contact.address.line1}, {site.contact.address.line2},{" "}
                {site.contact.address.line3}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Primary CTA whose label swaps to "Enter the Den" on hover — two stacked
 * labels sliding inside a clipped box.
 */
function SwapLabelButton() {
  const [hover, setHover] = useState(false);

  return (
    <Magnetic
      href={site.contact.emailHref}
      className="bg-ivory px-9 py-4 text-navy transition-colors duration-500 hover:bg-gold"
      ariaLabel="Start planning — email Travel Den"
    >
      <span
        className="relative block h-[1.1em] overflow-hidden eyebrow text-[0.625rem]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.span
          className="block"
          animate={{ y: hover ? "-100%" : "0%" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          Start Planning
        </motion.span>
        <motion.span
          className="absolute left-0 top-full block whitespace-nowrap"
          animate={{ y: hover ? "-100%" : "0%" }}
          transition={{ duration: 0.45, ease: EASE }}
          aria-hidden="true"
        >
          Enter the Den
        </motion.span>
      </span>
    </Magnetic>
  );
}
