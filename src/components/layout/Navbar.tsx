"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Menu } from "lucide-react";
import Logo from "@/components/brand/Logo";
import Magnetic from "@/components/ui/MagneticButton";
import MobileMenu from "./MobileMenu";
import { navLinks, site } from "@/lib/site";
import { useActiveSection } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

/** Sections with dark backgrounds — the bar inverts itself over these. */
const DARK_SECTIONS = new Set(["top", "services", "destinations", "contact"]);

const SECTION_IDS = [
  "top",
  "about",
  "destinations",
  "experiences",
  "services",
  "process",
  "contact",
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection(SECTION_IDS);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 64);
  });

  const overDark = DARK_SECTIONS.has(active);
  // Transparent at rest; once scrolled it becomes glass — navy glass over dark
  // sections, ivory glass over light ones.
  const onLight = scrolled && !overDark;

  return (
    <>
      <motion.header
        id="site-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.5 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? onLight
                ? "border-b border-beige/70 bg-ivory/80 backdrop-blur-xl"
                : "border-b border-white/10 bg-navy/70 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className={`mx-auto flex max-w-[100rem] items-center justify-between px-6 transition-[padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10 ${
              scrolled ? "py-4" : "py-6 md:py-7"
            } ${onLight ? "text-navy" : "text-ivory"}`}
          >
            <a
              href="#top"
              className="shrink-0"
              aria-label={`${site.name} — home`}
            >
              <Logo
                markClassName={`w-auto transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  scrolled ? "h-8" : "h-10"
                }`}
                wordClassName="text-[0.75rem] md:text-[0.85rem]"
              />
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-active={isActive}
                      aria-current={isActive ? "page" : undefined}
                      className={`link-underline eyebrow text-[0.6875rem] transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <Magnetic
                href="#contact"
                strength={6}
                className={`hidden min-h-11 items-center overflow-hidden px-7 py-4 eyebrow text-[0.625rem] transition-colors duration-500 sm:inline-flex ${
                  onLight
                    ? "bg-navy text-ivory hover:bg-navy-deep"
                    : "bg-navy text-ivory hover:bg-ivory hover:text-navy"
                }`}
              >
                Plan Your Escape
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="-mr-2 inline-flex min-h-11 items-center gap-2.5 p-2 lg:hidden"
              >
                <span className="eyebrow hidden text-[0.625rem] sm:inline">
                  Menu
                </span>
                <Menu className="h-5 w-5" strokeWidth={1.25} aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu active={active} onClose={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
