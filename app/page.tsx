import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

/*
 * Below-fold sections all pull Framer Motion for whileInView reveals. Loading
 * them as separate chunks keeps that JS off the critical path for LCP — the
 * hero and navbar still hydrate immediately.
 */
const WhyMe = dynamic(() => import("@/components/WhyMe"));
const About = dynamic(() => import("@/components/About"));
const Services = dynamic(() => import("@/components/Services"));
const TechStack = dynamic(() => import("@/components/TechStack"));
const Projects = dynamic(() => import("@/components/Projects"));
const Experience = dynamic(() => import("@/components/Experience"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div
      id="top"
      className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-background"
    >
      <Navbar />
      <main id="main" className="flex flex-1 flex-col">
        <Hero />
        <WhyMe />
        <About />
        <Services />
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
