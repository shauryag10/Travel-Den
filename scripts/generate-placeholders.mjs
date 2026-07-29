/**
 * Generates atmospheric SVG placeholders for every image slot the site
 * expects. Each is a layered scene — sky, haze, water/land bands — drawn
 * from the brand palette, with a faint grain and a small slot label so you
 * always know which file you're looking at when replacing assets.
 *
 * Run:  npm run placeholders
 * (Already committed output lives in /public/images — re-run only if you
 * add new slots in src/lib/content.ts.)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** scene palettes: [skyTop, skyLow, horizonGlow, bandA, bandB] */
const SCENES = {
  dawn: ["#11214a", "#3a4f7a", "#c5a96a", "#6b837c", "#0b1631"],
  sea: ["#1b3557", "#4a6a8a", "#a9bcbc", "#12494f", "#0b1631"],
  lagoon: ["#12494f", "#3d7a7a", "#d9d2c5", "#a9bcbc", "#0f3a40"],
  alpine: ["#22423f", "#5a7a72", "#f5f0e7", "#6b837c", "#16302d"],
  desert: ["#4a3020", "#8a5a35", "#c5a96a", "#d9d2c5", "#2e1d12"],
  dusk: ["#3a2436", "#6a4560", "#c5a96a", "#11214a", "#241522"],
  savanna: ["#4a3a1e", "#8a6c38", "#c5a96a", "#6b837c", "#2e2412"],
  ivory: ["#d9d2c5", "#c9bfae", "#f5f0e7", "#a9bcbc", "#b5a992"],
  navy: ["#0b1631", "#11214a", "#c5a96a", "#1b3557", "#080f22"],
};

/**
 * slot → [scene, width, height]
 * Sizes are generous but cheap — SVG scales anyway; the ratio is what matters.
 */
const SLOTS = {
  "hero/amalfi": ["sea", 1920, 1080],
  "hero/cappadocia": ["desert", 1920, 1080],
  "hero/maldives": ["lagoon", 1920, 1080],
  "intro/thoughtful": ["dawn", 900, 1200],
  "intro/places": ["sea", 900, 1125],
  "intro/journeys": ["dusk", 900, 1200],
  "ambient/leisure": ["sea", 1600, 900],
  "ambient/luxury": ["dusk", 1600, 900],
  "ambient/itineraries": ["alpine", 1600, 900],
  "ambient/meaningful": ["savanna", 1600, 900],
  "destinations/greece": ["sea", 1100, 1400],
  "destinations/maldives": ["lagoon", 1100, 1400],
  "destinations/switzerland": ["alpine", 1100, 1400],
  "destinations/morocco": ["desert", 1100, 1400],
  "destinations/japan": ["dusk", 1100, 1400],
  "destinations/south-africa": ["savanna", 1100, 1400],
  "experiences/island": ["lagoon", 1000, 1333],
  "experiences/culinary": ["dawn", 1000, 1333],
  "experiences/europe": ["sea", 1000, 1333],
  "experiences/wildlife": ["savanna", 1000, 1333],
  "experiences/celebration": ["dusk", 1000, 1333],
  "experiences/wellness": ["alpine", 1000, 1333],
  "process/discover": ["ivory", 1000, 1250],
  "process/curate": ["dawn", 1000, 1250],
  "process/refine": ["sea", 1000, 1250],
  "process/escape": ["dusk", 1000, 1250],
  "founder/portrait": ["dawn", 1000, 1333],
  "journal/slowly": ["ivory", 1200, 750],
  "journal/hotel": ["dusk", 1200, 750],
  "journal/planning": ["sea", 1200, 750],
  "cta/escape": ["navy", 1920, 1080],
};

/** Deterministic pseudo-random from a string seed — stable output per slot. */
function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function scene(slot, [skyTop, skyLow, glow, bandA, bandB], w, h) {
  const rand = rng(slot);
  const horizon = h * (0.42 + rand() * 0.2);
  const label = slot.replace("/", " / ");

  // Soft landmass / ridge silhouettes below the horizon.
  const ridge = (y, color, opacity) => {
    let d = `M0 ${y}`;
    const segments = 6;
    for (let i = 1; i <= segments; i++) {
      const x = (w / segments) * i;
      const dy = (rand() - 0.5) * h * 0.09;
      d += ` Q ${x - w / segments / 2} ${y + dy} ${x} ${y + (rand() - 0.5) * h * 0.05}`;
    }
    d += ` L ${w} ${h} L 0 ${h} Z`;
    return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/>
      <stop offset="0.85" stop-color="${skyLow}"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0.55"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.35"/>
      <stop offset="0.25" stop-color="${bandA}"/>
      <stop offset="1" stop-color="${bandB}"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0"/>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)" clip-path="inset(0 0 ${h - horizon} 0)"/>
  <rect y="0" width="${w}" height="${horizon}" fill="url(#sky)"/>
  <circle cx="${w * (0.3 + rand() * 0.4)}" cy="${horizon * 0.92}" r="${Math.min(w, h) * 0.22}" fill="url(#sun)"/>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#water)"/>
  ${ridge(horizon * 0.98, bandB, 0.5)}
  ${ridge(horizon * 1.12, bandB, 0.72)}
  <rect width="${w}" height="${h}" filter="url(#grain)" fill="none"/>
  <text x="${w / 2}" y="${h - 26}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.max(13, w * 0.011)}" letter-spacing="3" fill="#f5f0e7" opacity="0.4">PLACEHOLDER — ${label.toUpperCase()}</text>
</svg>`;
}

let count = 0;
for (const [slot, [sceneName, w, h]] of Object.entries(SLOTS)) {
  const file = join(root, "public", "images", `${slot}.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, scene(slot, SCENES[sceneName], w, h), "utf8");
  count++;
}

// Keep the video directories present (empty) so the expected structure is
// visible in the repo — drop real .mp4/.webm files straight in.
for (const dir of ["videos", "videos/destinations", "videos/experiences", "videos/process"]) {
  const marker = join(root, "public", dir, ".gitkeep");
  mkdirSync(dirname(marker), { recursive: true });
  writeFileSync(marker, "", "utf8");
}

console.log(`Generated ${count} placeholder images in public/images`);
