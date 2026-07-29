/**
 * Section content. Media paths point at /public — see README ("Replacing
 * images and videos"). Every `video` field is optional: when the file is
 * absent the UI falls back to `image`, and when that is absent too it falls
 * back to a palette gradient. Nothing ever renders as a broken box.
 */

export type Media = {
  /** Poster / still. Required. */
  image: string;
  /** Optional looping clip. Drop an .mp4 at this path to activate it. */
  video?: string;
  /** Optional WebM sibling — served first when the browser supports it. */
  videoWebm?: string;
  alt: string;
};

/* ---------------------------------------------------------------- hero */

export type HeroScene = {
  location: string;
  media: Media;
};

/** Each scene holds the stage for ~7s, then cross-fades to the next. */
export const heroScenes: HeroScene[] = [
  {
    location: "Amalfi Coast, Italy",
    media: {
      image: "/images/hero/amalfi.jpg",
      video: "/videos/hero/amalfi.mp4",
      alt: "Positano's cliffside village above a teal Mediterranean bay",
    },
  },
  {
    location: "Cappadocia, Türkiye",
    media: {
      image: "/images/hero/cappadocia.jpg",
      video: "/videos/hero/cappadocia.mp4",
      alt: "Hot-air balloons drifting over pale valleys at dawn",
    },
  },
  {
    location: "Baa Atoll, Maldives",
    media: {
      image: "/images/hero/maldives.jpg",
      video: "/videos/hero/maldives.mp4",
      alt: "A private pool meeting the horizon of a clear lagoon",
    },
  },
];

/* --------------------------------------------------------------- intro */

export const introCards = [
  {
    title: "Thoughtful by design",
    line: "Every detail, handcrafted.",
    description:
      "Routes, timings and transitions shaped so the days breathe instead of rushing.",
    media: {
      image: "/images/intro/thoughtful.jpg",
      alt: "A table laid for breakfast on a terrace above the sea",
    } as Media,
  },
  {
    title: "Places with soul",
    line: "Curated for meaning.",
    description:
      "Stays and neighbourhoods chosen for character, not for a rating average.",
    media: {
      image: "/images/intro/places.jpg",
      alt: "Whitewashed village lanes opening onto a blue dome",
    } as Media,
  },
  {
    title: "Journeys that stay with you",
    line: "Memories that last.",
    description:
      "The kind of trip you keep describing months later, in small specific pieces.",
    media: {
      image: "/images/intro/journeys.jpg",
      alt: "Palms above a quiet pool in late afternoon light",
    } as Media,
  },
];

/* ---------------------------------------------------------- philosophy */

export type Pillar = {
  id: string;
  icon: "globe" | "gem" | "mountain" | "compass";
  title: string;
  description: string;
  /** Ambient still swapped in behind the section on hover / focus. */
  ambient: string;
};

export const pillars: Pillar[] = [
  {
    id: "leisure",
    icon: "globe",
    title: "Leisure Travel",
    description:
      "Relax, unwind, and explore the world's most beautiful places.",
    ambient: "/images/ambient/leisure.jpg",
  },
  {
    id: "luxury",
    icon: "gem",
    title: "Luxury Experiences",
    description:
      "Handpicked stays, private access, and unforgettable moments.",
    ambient: "/images/ambient/luxury.jpg",
  },
  {
    id: "itineraries",
    icon: "mountain",
    title: "Curated Itineraries",
    description:
      "Personalised journeys built around your interests and rhythm.",
    ambient: "/images/ambient/itineraries.jpg",
  },
  {
    id: "meaningful",
    icon: "compass",
    title: "Meaningful Journeys",
    description:
      "Travel that connects you with culture, people, and purpose.",
    ambient: "/images/ambient/meaningful.jpg",
  },
];

/* -------------------------------------------------------- destinations */

export type Destination = {
  slug: string;
  index: string;
  country: string;
  title: string;
  feeling: string;
  intro: string;
  idealFor: string;
  bestTime: string;
  duration: string;
  /** Drives the ambient wash behind the gallery when this card is active. */
  tint: string;
  media: Media;
};

export const destinations: Destination[] = [
  {
    slug: "greece",
    index: "01",
    country: "Greece",
    title: "Timeless Islands",
    feeling:
      "Whitewashed villages, hidden coves, and slow Mediterranean days.",
    intro:
      "Island-hop at an unhurried pace — mornings in near-empty harbours, long lunches above the water, and evenings that begin whenever the light softens.",
    idealFor: "Couples, small groups, slow travellers",
    bestTime: "May – June, September – October",
    duration: "8 – 12 days",
    tint: "#1b3557",
    media: {
      image: "/images/destinations/greece.jpg",
      video: "/videos/destinations/greece.mp4",
      alt: "Blue domes above whitewashed houses on a Cycladic hillside",
    },
  },
  {
    slug: "maldives",
    index: "02",
    country: "Maldives",
    title: "Overwater Bliss",
    feeling: "Private villas, clear lagoons, and uninterrupted stillness.",
    intro:
      "A journey built around doing very little, beautifully. Overwater villas, house reefs a step from the deck, and a calendar deliberately left open.",
    idealFor: "Honeymoons, milestone escapes, families",
    bestTime: "November – April",
    duration: "5 – 8 days",
    tint: "#12494f",
    media: {
      image: "/images/destinations/maldives.jpg",
      video: "/videos/destinations/maldives.mp4",
      alt: "Overwater villas on a pale turquoise lagoon",
    },
  },
  {
    slug: "switzerland",
    index: "03",
    country: "Switzerland",
    title: "Alpine Serenity",
    feeling: "Mountain air, quiet lakes, and journeys shaped by nature.",
    intro:
      "Panoramic rail, lakeside towns and high meadows — a route arranged so the scenery does the work and the logistics disappear.",
    idealFor: "Families, first-time Europe, rail lovers",
    bestTime: "June – September, December – February",
    duration: "7 – 10 days",
    tint: "#22423f",
    media: {
      image: "/images/destinations/switzerland.jpg",
      video: "/videos/destinations/switzerland.mp4",
      alt: "A still alpine lake beneath snow-touched peaks",
    },
  },
  {
    slug: "morocco",
    index: "04",
    country: "Morocco",
    title: "Desert Romance",
    feeling:
      "Courtyards, lantern-lit evenings, and landscapes of warm silence.",
    intro:
      "Riads hidden behind unmarked doors, artisan quarters walked with someone who knows them, and a night where the desert is genuinely quiet.",
    idealFor: "Couples, design-led travellers, photographers",
    bestTime: "March – May, October – November",
    duration: "8 – 11 days",
    tint: "#4a3020",
    media: {
      image: "/images/destinations/morocco.jpg",
      video: "/videos/destinations/morocco.mp4",
      alt: "A lantern-lit courtyard with carved arches at dusk",
    },
  },
  {
    slug: "japan",
    index: "05",
    country: "Japan",
    title: "Quiet Precision",
    feeling: "Temple mornings, mountain ryokan, and seasons observed closely.",
    intro:
      "Cities read slowly and countryside stays that follow the season — timed around blossom, maple or first snow rather than a checklist.",
    idealFor: "Culture-led travellers, couples, food lovers",
    bestTime: "March – May, October – November",
    duration: "10 – 14 days",
    tint: "#3a2436",
    media: {
      image: "/images/destinations/japan.jpg",
      video: "/videos/destinations/japan.mp4",
      alt: "A timber temple gate framed by autumn maples",
    },
  },
  {
    slug: "south-africa",
    index: "06",
    country: "South Africa",
    title: "Wild Horizons",
    feeling: "Open plains, coastal light, and mornings that start in the dark.",
    intro:
      "Private conservancies paired with the Cape — game drives at first light, then vineyards, ocean roads and long unhurried afternoons.",
    idealFor: "Families, safari first-timers, photographers",
    bestTime: "May – September",
    duration: "10 – 14 days",
    tint: "#4a3a1e",
    media: {
      image: "/images/destinations/south-africa.jpg",
      video: "/videos/destinations/south-africa.mp4",
      alt: "Golden grassland under a wide low sun",
    },
  },
];

/* --------------------------------------------------------- experiences */

export const experiences = [
  {
    title: "Private island escapes",
    line: "A shoreline, a staff of six, and no fixed schedule.",
    media: {
      image: "/images/experiences/island.jpg",
      alt: "A small private island ringed by shallow water",
    } as Media,
  },
  {
    title: "Culinary journeys",
    line: "Tables you cannot book, and the people behind them.",
    media: {
      image: "/images/experiences/culinary.jpg",
      alt: "A chef's table set beside an open kitchen",
    } as Media,
  },
  {
    title: "Slow European summers",
    line: "One base, three weeks, and the whole coast within reach.",
    media: {
      image: "/images/experiences/europe.jpg",
      alt: "A stone terrace above a Mediterranean bay",
    } as Media,
  },
  {
    title: "Wildlife and wilderness",
    line: "First light, low engine, and the patience it rewards.",
    media: {
      image: "/images/experiences/wildlife.jpg",
      alt: "Open savannah at sunrise seen from a game vehicle",
    } as Media,
  },
  {
    title: "Celebration travel",
    line: "Anniversaries, birthdays, and the trips that mark them.",
    media: {
      image: "/images/experiences/celebration.jpg",
      alt: "A candlelit table laid on a private terrace",
    } as Media,
  },
  {
    title: "Wellness retreats",
    line: "Days built around rest, not around activities.",
    media: {
      image: "/images/experiences/wellness.jpg",
      alt: "A white stone pool amid sea grasses above a hazy ocean",
    } as Media,
  },
];

/* ------------------------------------------------------------- process */

export const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We begin with how you want the journey to feel.",
    media: {
      image: "/images/process/discover.jpg",
      alt: "Notes and a map spread across a warm-lit table",
    } as Media,
  },
  {
    number: "02",
    title: "Curate",
    description: "We shape destinations, stays, and experiences around you.",
    media: {
      image: "/images/process/curate.jpg",
      alt: "A courtyard stay chosen for its quiet",
    } as Media,
  },
  {
    number: "03",
    title: "Refine",
    description:
      "Every detail is reviewed, adjusted, and thoughtfully connected.",
    media: {
      image: "/images/process/refine.jpg",
      alt: "A coastal road threading between headlands",
    } as Media,
  },
  {
    number: "04",
    title: "Escape",
    description: "You travel with clarity, confidence, and complete support.",
    media: {
      image: "/images/process/escape.jpg",
      alt: "A departure at first light across open water",
    } as Media,
  },
];

