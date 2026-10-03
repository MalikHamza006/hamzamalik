import About from "@/components/About";
import AISystems from "@/components/AISystems";
import Background from "@/components/Background";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HMAssistant from "@/components/ai/HMAssistant";
import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import TechStrip from "@/components/TechStrip";

export default function Page() {
  return (
    <>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-crimson-800 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Background />
      <Navigation />

      <main className="w-full min-w-0 overflow-x-clip">
        <Hero />
        <Projects />
        <Skills />
        <TechStrip />
        <About />
        <Experience />
        <AISystems />
        <Contact />
      </main>

      <Footer />

      <HMAssistant />
    </>
  );
}