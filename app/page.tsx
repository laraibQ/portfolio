import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HeroAboutBridge from "@/components/HeroAboutBridge";
import ScrollProgress from "@/components/ScrollProgress";
import ParallaxOrbs from "@/components/ParallaxOrbs";

/*
 * Below-fold sections pull GSAP ScrollTrigger. Loading them as separate chunks
 * keeps that JS off the critical path for LCP — the hero stays CSS-only and
 * the navbar hydrates immediately. About stays eager so the avatar flip slots
 * exist as soon as the Hero→About bridge mounts.
 */
const WhyMe = dynamic(() => import("@/components/WhyMe"));
const TechMarquee = dynamic(() => import("@/components/TechMarquee"));
const ProjectsMarquee = dynamic(() => import("@/components/ProjectsMarquee"));
const Services = dynamic(() => import("@/components/Services"));
const TechStack = dynamic(() => import("@/components/TechStack"));
const Projects = dynamic(() => import("@/components/Projects"));
const CaseStudies = dynamic(() => import("@/components/CaseStudies"));
const Outcomes = dynamic(() => import("@/components/Outcomes"));
const Experience = dynamic(() => import("@/components/Experience"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div
      id="top"
      className="relative flex min-h-full flex-1 flex-col bg-background"
    >
      <ScrollProgress />
      <ParallaxOrbs />
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        <HeroAboutBridge hero={<Hero />} about={<About />} />
        <ProjectsMarquee />
        <WhyMe />
        <TechMarquee />
        <Services />
        <TechStack />
        <Projects />
        <CaseStudies />
        <Outcomes />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
