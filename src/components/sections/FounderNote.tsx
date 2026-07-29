"use client";

import CinematicMedia from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { Spark } from "@/components/brand/Logo";
import { site } from "@/lib/site";

/** Dev Sodha above a Mediterranean bay — supplied by the client. */
const founderMedia = {
  image: "/images/founder/dev-sodha.jpg",
  alt: "Dev Sodha, founder of Travel Den, above a Mediterranean bay",
};

export default function FounderNote() {
  return (
    <section className="relative z-10 bg-ivory py-(--spacing-section-sm) md:py-(--spacing-section)">
      <div className="mx-auto max-w-[100rem] px-6 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          {/* -------------------------------------------------- media side */}
          <Reveal variant="clip" className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]">
              <CinematicMedia
                media={founderMedia}
                playback="never"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-full w-full"
                objectPosition="center 22%"
              />
            </div>
          </Reveal>

          {/* --------------------------------------------------- note side */}
          <div className="lg:col-span-7 lg:pr-10 xl:pr-24">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-sage">
                A note from the founder
                <Spark className="h-2.5 w-2.5 text-gold" />
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <blockquote className="mt-10">
                <p className="font-serif text-[1.7rem] leading-[1.4] text-navy md:text-[2.1rem]">
                  We are back—reimagined, refreshed, and ready to take you
                  places.
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="body-copy mt-8 max-w-[56ch] text-charcoal/70">
                Travel Den was created for travellers who want more than
                crowded itineraries and copied recommendations. We believe the
                best journeys feel personal, effortless, and deeply considered.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-12 flex items-end gap-6 border-t border-beige pt-8">
                {/* Handwritten accent — reserved for the signature only,
                    mirroring the script on the brand's business card. */}
                <p
                  className="text-[3rem] leading-none text-navy"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  {site.founder.name}
                </p>
                <p className="eyebrow pb-1.5 text-[0.5625rem] text-sage">
                  {site.founder.role}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
