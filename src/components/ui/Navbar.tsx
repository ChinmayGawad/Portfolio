import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'journey', label: 'JOURNEY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleMobileNavigate = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="navbar-header">
      <nav className="navbar-container" aria-label="Main Navigation">
        <div className="nav-logo" onClick={() => handleMobileNavigate('hero')}>
          <span className="logo-dot"></span>
          <span className="logo-text">CHINMAY GAWAD</span>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links desktop-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-window" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="nav-logo" onClick={() => handleMobileNavigate('hero')}>
                <span className="logo-dot"></span>
                <span className="logo-text">CHINMAY GAWAD</span>
              </div>
              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleMobileNavigate(item.id)}
                    >
                      <span className="item-label">{item.label}</span>
                      <ChevronRight size={16} className="item-arrow" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: fixed;
          top: 1.5rem;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
          pointer-events: none;
        }

        .navbar-container {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 900px;
          padding: 0.6rem 1.4rem;
          background: rgba(10, 12, 16, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent-color);
          box-shadow: 0 0 10px var(--accent-color);
        }

        .logo-text {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.875rem;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.15rem;
        }

        .nav-link {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          transition: color 0.2s ease, opacity 0.2s ease;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link.active {
          color: var(--accent-color);
          font-weight: 600;
        }

        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(6, 7, 9, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          pointer-events: auto;
          animation: fadeIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-drawer-window {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
        }

        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-nav-item:hover, .mobile-nav-item.active {
          color: var(--text-primary);
          background: rgba(56, 189, 248, 0.1);
          border-color: var(--accent-color);
        }

        .mobile-nav-item.active .item-arrow {
          color: var(--accent-color);
          transform: translateX(4px);
        }

        .item-arrow {
          transition: transform 0.2s ease;
        }

        @media (max-width: 768px) {
          .navbar-header {
            top: 1rem;
            padding: 0 1rem;
          }
          .desktop-links {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
}
