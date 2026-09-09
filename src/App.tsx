import React, { useState, useEffect } from 'react';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/ui/Hero';
import { About } from './components/ui/About';
import { Experience } from './components/ui/Experience';
import { Projects } from './components/ui/Projects';
import { Journey } from './components/ui/Journey';
import { Contact } from './components/ui/Contact';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // 1. Scroll Intersection Observer to identify current active section
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // 2. Smooth Navigation Scroll Handler
  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* Static Background Texture */}
      <div className="noise-bg" aria-hidden="true" />

      {/* HTML UI Layer */}
      <div className="ui-layer">
        <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
        <main>
          <Hero onNavigate={handleNavigate} />
          <About />
          <Experience />
          <Projects />
          <Journey />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
