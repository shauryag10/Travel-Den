# Travel Den

**Enter the Den. Escape the World.**

A cinematic, editorial homepage for Travel Den — a premium travel-planning
consultancy. Built with Next.js (App Router), TypeScript, Tailwind CSS v4,
Framer Motion, GSAP ScrollTrigger and Lenis.

---

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`) |
| Entrances / micro-motion | Framer Motion |
| Pinned horizontal scroll | GSAP ScrollTrigger (Experiences section only) |
| Smooth scrolling | Lenis, driven by GSAP's ticker |
| Icons | Lucide + hand-drawn SVG pillar icons |
| Type | Cormorant Garamond + Manrope via `next/font` (self-hosted) |

All motion honours `prefers-reduced-motion: reduce` — smooth scroll,
parallax, video autoplay, tilt and drift all switch off, and the page remains
fully readable as a static document.

## Project structure

```
src/
  app/
    layout.tsx          fonts, metadata, skip-link, smooth-scroll provider
    page.tsx            section order for the homepage
    globals.css         design tokens (@theme), motion primitives, base styles
  lib/
    site.ts             brand copy, contact details, nav — edit here first
    content.ts          all section content + media paths
    motion.ts           the sitewide easing/duration/variant system
    hooks.ts            media-query, scroll-lock, focus, active-section hooks
  components/
    brand/Logo.tsx      monogram, wordmark, gold spark
    layout/             Navbar, MobileMenu, Footer
    sections/           one file per homepage section
    ui/                 CinematicMedia, Reveal, MagneticButton, etc.
scripts/
  generate-placeholders.mjs   regenerates the SVG placeholder imagery
public/
  images/<section>/…    posters & stills   (SVG placeholders committed)
  videos/…              looping clips      (empty — drop files in)
```

## Replacing images and videos

Every media slot is declared in **`src/lib/content.ts`** as:

```ts
media: {
  image: "/images/destinations/greece.svg",  // poster / still — required
  video: "/videos/destinations/greece.mp4",  // optional loop
  videoWebm: "/videos/…/greece.webm",        // optional, served first
  alt: "…",                                   // always keep meaningful
}
```

**To replace an image:** drop your file into `public/images/<section>/` and
update the `image` path (e.g. change `.svg` to `.jpg`). Any format
`next/image` accepts works; it will generate AVIF/WebP variants and
responsive sizes automatically.

**To add a video:** drop an `.mp4` (H.264, muted) at the path already listed
in the `video` field — most slots are pre-wired, so no code change is needed.
Add a `.webm` (VP9/AV1) sibling for better compression where you can.

**Video behaviour is poster-first:** the still always renders, and the video
fades in only after it has actually decoded. If a file is missing, blocked,
or fails, the poster simply stays — nothing breaks. Offscreen videos are
paused via IntersectionObserver, and gallery/card videos play only while
their card is active, so multiple clips never run at once.

Recommended encodes (keep loops 6–15 s):

```bash
ffmpeg -i in.mov -an -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -movflags +faststart out.mp4
ffmpeg -i in.mov -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 out.webm
```

Card-sized loops (destinations, experiences) can be 960–1280 px wide.

**Current media:** all photography (and the looping footage in
`public/videos`) is sourced from Pexels under the Pexels license — free for
commercial use, no attribution required. Per-file source links live in
`public/CREDITS.md`. Swap any file for client photography by replacing it at
the same path.

**Placeholders:** `npm run placeholders` regenerates labelled SVG stand-ins
(in case you add new slots before real assets exist).

## Editing content

- **Copy, nav, contact, socials** — `src/lib/site.ts`
- **Destinations, experiences, process steps** —
  `src/lib/content.ts` (add/remove array entries; the UI adapts)
- **Palette / spacing / type scale** — `@theme` block in
  `src/app/globals.css`
- **Newsletter** — front-end only; wire the `TODO` in
  `src/components/layout/Footer.tsx` to your provider

## Accessibility notes

- Skip-link, focus-visible rings, focus-trapped menu and modal, Escape to
  close, `aria-live` carousel announcements
- Decorative videos are `aria-hidden`; meaning is carried by poster `alt`
- Hero has an accessible pause/play control for ambient footage
- Destination modal syncs to `?destination=<slug>` — shareable, back-button
  closes it

## Content constraints honoured

No invented awards, logos, review scores, prices or partnerships.
Testimonials are clearly placeholder text — replace with real, consented
quotes before launch.
