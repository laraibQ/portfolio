import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyMe from "@/components/WhyMe";
import About from "@/components/About";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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
