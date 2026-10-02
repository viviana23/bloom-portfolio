import type { ComponentType } from "react";
import { useContent } from "./lib/content";
import type { SectionId } from "./lib/types";
import { Contact, Footer } from "./components/Contact";
import { Gallery, Services, Testimonials } from "./components/Extras";
import { FloatingContact } from "./components/FloatingContact";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { About, Education, Experience, Lab, Skills } from "./components/Sections";

const sectionComponents: Record<SectionId, ComponentType> = {
  projects: Projects,
  gallery: Gallery,
  services: Services,
  testimonials: Testimonials,
  about: About,
  skills: Skills,
  lab: Lab,
  experience: Experience,
  education: Education,
  contact: Contact,
};

export function App() {
  const { labels, visibleSections } = useContent();
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-bg"
      >
        {labels.skipToContent}
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        {visibleSections.map((id) => {
          const Component = sectionComponents[id];
          return <Component key={id} />;
        })}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
