/**
 * Travel Den brand marks, per the official identity deck:
 *  - Monogram: vertically intertwined T + D with a leaf counter and a small
 *    airplane motif at the top right (movement, departure, discovery).
 *  - Wordmark: "TRAVEL DEN" in a clean understated sans, generously spaced.
 *
 * Drawn in SVG with `currentColor` so the navbar can flip ivory ↔ navy with
 * no second asset. This is a faithful vector interpretation of the supplied
 * PDF mark — swap in the original AI/SVG export if the studio provides one.
 */

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g fill="currentColor">
        {/* T — crossbar with a curled old-style left terminal, its stem
            flowing straight into the D below. */}
        <path d="M15 10 C13 24 14 30 10 36 C20 32 22 26 23 20 L23 20 C23.4 15.6 24.5 12.8 27 10 Z" />
        <path d="M23 10 L68 10 C66 13.5 64 15.5 60 16.5 L48 16.8 L48 22 L32 22 L32 16.8 C28.4 16.6 25.6 14 23 10 Z" />

        {/* Combined T/D stem with flared foot serif. */}
        <path d="M32 18 L48 18 L48 122 C52.5 122.4 56 124 58 128 L58 134 L22 134 C24 128 27.5 124.4 32 123 Z" />

        {/* D bowl — springs from the stem, sweeps right, closes at the foot.
            The counter is cut with evenodd; the leaf is laid back over it. */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48 30 L56 30 C79 30 92 48 92 80 C92 112 79 130 56 130 L48 130 L48 122 L55 122 C71 122 80 107 80 80 C80 53 71 38 55 38 L48 38 Z"
        />

        {/* Leaf — hangs from the top of the bowl into the counter, tapering
            to a point near the foot. */}
        <path d="M50 38 C64 44 70 58 69 76 C68.4 92 62 106 52 116 C56 100 57 88 55.5 74 C54 60 52.5 48 50 38 Z" />

        {/* Airplane motif taking off from the D's upper terminal — the deep
            notch between the wings is what makes it read as flight. */}
        <path d="M60 27 C64.5 15.5 75 8.5 89 8 C85 10.8 82.8 13.6 82 17 L95 13.5 C90 20.5 82 24 74.5 22.7 C69.3 21.8 64.2 23.6 60 27 Z" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  // Deck spec: minimal sans, wide tracking, never stylised or embellished.
  return (
    <span
      className={`font-sans uppercase leading-none ${className}`}
      style={{ letterSpacing: "0.3em", fontWeight: 500 }}
    >
      Travel&nbsp;Den
    </span>
  );
}

export default function Logo({
  className = "",
  markClassName = "h-8 w-auto",
  wordClassName = "text-[0.95rem]",
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      <Monogram className={markClassName} />
      <Wordmark className={wordClassName} />
    </span>
  );
}

/** Small gold spark used as a typographic accent inside headlines. */
export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 1.5c1.1 6.6 2.4 7.9 9 9-6.6 1.1-7.9 2.4-9 9-1.1-6.6-2.4-7.9-9-9 6.6-1.1 7.9-2.4 9-9Z"
        fill="currentColor"
      />
    </svg>
  );
}
