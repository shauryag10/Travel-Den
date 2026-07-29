/**
 * Single source of truth for brand copy, contact details and navigation.
 * Edit here — every section reads from this file.
 */

export const site = {
  name: "Travel Den",
  tagline: "Enter the Den. Escape the World.",
  description:
    "Travel Den designs private journeys with intention, comfort and quiet luxury — beyond checklists and crowded itineraries.",
  url: "https://travelden.co",
  founder: {
    name: "Dev Sodha",
    role: "Founder, Travel Den",
  },
  contact: {
    phone: "+91 7600760078",
    phoneHref: "tel:+917600760078",
    // WhatsApp deep link — digits only, no "+" or spaces.
    whatsapp: "https://wa.me/917600760078",
    email: "dev@travelden.co",
    emailHref: "mailto:dev@travelden.co",
    address: {
      line1: "A-503 Stellar, Sindhu Bhawan Road",
      line2: "Nr. Pakwan Cross Roads, Bodakdev",
      line3: "Ahmedabad 380059",
    },
  },
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;
