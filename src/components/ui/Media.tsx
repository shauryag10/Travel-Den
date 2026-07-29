"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";

type CinematicMediaProps = {
  media: Media;
  className?: string;
  /** Only `true` for the hero — everything else stays lazy. */
  priority?: boolean;
  sizes?: string;
  /**
   * `auto`   — plays whenever it is on screen (hero, CTA)
   * `active` — plays only while `isActive` is true (galleries, cards)
   * `never`  — poster only
   */
  playback?: "auto" | "active" | "never";
  isActive?: boolean;
  /** External stop switch — wired to the hero's pause/play control. */
  paused?: boolean;
  /** Adds the slow Ken Burns drift to the poster when no video is playing. */
  drift?: boolean;
  objectPosition?: string;
};

/**
 * Poster-first media element.
 *
 * The poster image always renders. A <video> is layered on top and fades in
 * only once it has actually decoded a frame — so a missing, blocked or
 * still-buffering file simply never appears and the still remains. This is the
 * graceful-fallback contract: the page is complete and readable with zero
 * video files present.
 *
 * Offscreen videos are paused via IntersectionObserver, and nothing loads
 * until it is needed (`preload="none"` until the element becomes eligible).
 */
export default function CinematicMedia({
  media,
  className = "",
  priority = false,
  sizes = "100vw",
  playback = "auto",
  isActive = false,
  paused = false,
  drift = false,
  objectPosition = "center",
}: CinematicMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const reduced = usePrefersReducedMotion();

  const hasVideoSource = Boolean(media.video || media.videoWebm);
  // Reduced motion means no moving background at all — poster only.
  const wantsVideo = hasVideoSource && playback !== "never" && !reduced && !failed;
  const shouldPlay =
    wantsVideo && inViewport && !paused && (playback === "auto" || isActive);

  /* Track viewport presence so we can both defer loading and pause offscreen. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !wantsVideo) return;

    const io = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wantsVideo]);

  /* Play / pause. Autoplay rejection is non-fatal: we keep the poster. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      const attempt = video.play();
      if (attempt?.catch) attempt.catch(() => setFailed(true));
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden bg-navy-deep ${className}`}
    >
      {/* Poster — always present, never removed. */}
      <Image
        src={media.image}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={`object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          canPlay ? "opacity-0" : "opacity-100"
        } ${drift && !canPlay && !reduced ? "drift" : ""}`}
        style={{ objectPosition }}
      />

      {/* Video — mounted only when it has a chance of playing. */}
      {wantsVideo && inViewport && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          // Never autoplay audio, and never expose a muted decorative loop
          // to assistive tech — the poster's alt text carries the meaning.
          aria-hidden="true"
          tabIndex={-1}
          preload="metadata"
          poster={media.image}
          onCanPlay={() => setCanPlay(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            canPlay ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition }}
        >
          {media.videoWebm && <source src={media.videoWebm} type="video/webm" />}
          {media.video && <source src={media.video} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
