import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/scene/Scene';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/ui/Hero';
import { About } from './components/ui/About';
import { Experience } from './components/ui/Experience';
import { Projects } from './components/ui/Projects';
import { Journey } from './components/ui/Journey';
import { Contact } from './components/ui/Contact';

export function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 1. Mouse move tracking (Normalized -1 to +1)
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth) * 2 - 1;
    const y = -(event.clientY / innerHeight) * 2 + 1;
    setMouse({ x, y });
  }, []);

  // 2. Responsive mobile & reduced motion check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mousemove', handleMouseMove);
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [handleMouseMove]);

  // 3. Scroll Intersection Observer to identify current active section
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

  // 4. Smooth Navigation Scroll Handler
  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-root">
      {/* Fixed 3D WebGL Canvas Layer */}
      <Scene
        mouse={mouse}
        activeSection={activeSection}
        isMobile={isMobile}
        isReducedMotion={isReducedMotion}
      />

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
