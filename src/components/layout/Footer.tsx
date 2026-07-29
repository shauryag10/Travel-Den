"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { navLinks, site } from "@/lib/site";
import { inView } from "@/lib/motion";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/25 bg-navy-deep text-ivory">
      <div className="mx-auto max-w-[100rem] px-6 pb-10 pt-20 md:px-10 md:pt-28">
        <RevealGroup className="grid gap-14 lg:grid-cols-12 lg:gap-10" gap={0.08}>
          {/* --------------------------------------------- brand + routes */}
          <RevealItem className="lg:col-span-4">
            <Logo markClassName="h-12 w-auto" wordClassName="text-[0.95rem]" />
            <p className="mt-6 font-serif text-lg italic text-bluegrey">
              {site.tagline}
            </p>
            <p className="eyebrow mt-3 text-[0.5625rem] text-bluegrey/60">
              The World, Curated
            </p>
            <RouteLine />
          </RevealItem>

          {/* ---------------------------------------------------- explore */}
          <RevealItem className="lg:col-span-2">
            <p className="eyebrow mb-7 text-[0.5625rem] text-bluegrey/70">
              Explore
            </p>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-[0.875rem] text-ivory/80"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>

          {/* ---------------------------------------------------- contact */}
          <RevealItem className="lg:col-span-3">
            <p className="eyebrow mb-7 text-[0.5625rem] text-bluegrey/70">
              Travel enquiries
            </p>
            <ul className="space-y-3.5 text-[0.875rem] text-ivory/80">
              <li>
                <a href={site.contact.phoneHref} className="link-underline">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={site.contact.emailHref} className="link-underline">
                  {site.contact.email}
                </a>
              </li>
              <li className="pt-2 leading-relaxed text-ivory/55">
                {site.contact.address.line1}
                <br />
                {site.contact.address.line2}
                <br />
                {site.contact.address.line3}
              </li>
            </ul>
          </RevealItem>

          {/* ------------------------------------------------- newsletter */}
          <RevealItem className="lg:col-span-3">
            <p className="eyebrow mb-7 text-[0.5625rem] text-bluegrey/70">
              Newsletter
            </p>
            <p className="font-serif text-lg italic leading-relaxed text-ivory/85">
              A quieter way to discover the world.
            </p>
            <NewsletterForm />
            <ul className="mt-9 flex gap-6">
              {site.social.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline eyebrow text-[0.5625rem] text-ivory/60"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>

        {/* ------------------------------------------------------- legal */}
        <Reveal className="mt-20">
          <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.6875rem] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <div className="flex gap-7">
              <a href="#top" className="link-underline">
                Privacy Policy
              </a>
              <a href="#top" className="link-underline">
                Terms
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}

/**
 * Decorative route line — a dashed flight path that draws itself between two
 * points as the footer enters, with the gold spark as the destination.
 */
function RouteLine() {
  return (
    <motion.svg
      viewBox="0 0 220 48"
      fill="none"
      aria-hidden="true"
      className="mt-10 w-52 text-bluegrey/50"
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      <circle cx="6" cy="40" r="2.5" fill="currentColor" />
      <motion.path
        d="M8 39C48 30 92 8 130 10c32 1.7 52 8 76 3"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 5"
        variants={{
          hidden: { pathLength: 0 },
          show: {
            pathLength: 1,
            transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
          },
        }}
      />
      <motion.path
        d="M207 6.8c.5 2.9 1.1 3.5 4 4-2.9.5-3.5 1.1-4 4-.5-2.9-1.1-3.5-4-4 2.9-.5 3.5-1.1 4-4Z"
        fill="var(--color-gold)"
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          show: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, delay: 2.3 },
          },
        }}
      />
    </motion.svg>
  );
}

/**
 * Newsletter capture. Front-end only — wire the submit handler to your
 * provider (Mailchimp, Buttondown, ConvertKit…) when ready.
 */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        // TODO: POST to your newsletter provider here.
        setSent(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex border-b border-white/25 transition-colors duration-500 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full bg-transparent py-3.5 text-[0.875rem] text-ivory placeholder:text-ivory/35 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="group px-2.5 text-ivory/70 transition-colors duration-300 hover:text-gold"
        >
          <ArrowRight
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 text-[0.75rem] text-gold transition-opacity duration-500 ${
          sent ? "opacity-100" : "opacity-0"
        }`}
      >
        {sent ? "Thank you — you're on the list." : " "}
      </p>
    </form>
  );
}
