"use client";

import { motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import Logo from "@/components/brand/Logo";
import { navLinks, site } from "@/lib/site";
import { useEscapeKey, useScrollLock } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/**
 * Full-screen menu that opens as a circular mask expanding from the toggle
 * corner, then reveals each link line-by-line from behind its own clip box.
 *
 * Focus is trapped while open, Escape closes, and the page beneath is locked.
 */
export default function MobileMenu({
  active,
  onClose,
}: {
  active: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useScrollLock(true);
  useEscapeKey(true, onClose);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[70] bg-navy text-ivory"
      // Circular mask growing from the top-right, where the toggle sits.
      initial={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 3rem) 3rem)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      <div className="flex h-full flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo markClassName="h-9 w-auto" wordClassName="text-[0.8rem]" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 inline-flex min-h-11 items-center gap-2.5 p-2"
          >
            <span className="eyebrow text-[0.625rem]">Close</span>
            <X className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col justify-center"
        >
          <ul>
            {navLinks.map((link, i) => {
              const isActive = active === link.href.replace("#", "");
              return (
                <li key={link.href} className="line-mask">
                  <motion.a
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-baseline gap-4 py-2.5"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.28 + i * 0.06,
                    }}
                  >
                    <span
                      className={`eyebrow text-[0.5625rem] ${
                        isActive ? "text-gold" : "text-bluegrey/75"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-serif text-[2.6rem] leading-[1.15] sm:text-[3.2rem] ${
                        isActive ? "text-ivory" : "text-ivory/80"
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.68 }}
          className="border-t border-white/12 pt-6"
        >
          <p className="font-serif text-lg italic text-bluegrey">
            {site.tagline}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2">
            <a
              href={site.contact.phoneHref}
              className="link-underline eyebrow text-[0.625rem] text-ivory/75"
            >
              {site.contact.phone}
            </a>
            <a
              href={site.contact.emailHref}
              className="link-underline eyebrow text-[0.625rem] text-ivory/75"
            >
              {site.contact.email}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
