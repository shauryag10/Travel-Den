import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Philosophy from "@/components/sections/Philosophy";
import Destinations from "@/components/sections/destinations/Destinations";
import Experiences from "@/components/sections/Experiences";
import Process from "@/components/sections/Process";
import FounderNote from "@/components/sections/FounderNote";
import FinalCta from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />
        <Philosophy />
        <Destinations />
        <Experiences />
        <Process />
        <FounderNote />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
