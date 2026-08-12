import React from 'react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'journey', label: 'JOURNEY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header className="navbar-header">
      <nav className="navbar-container" aria-label="Main Navigation">
        <div className="nav-logo" onClick={() => onNavigate('hero')}>
          <span className="logo-dot"></span>
          <span className="logo-text">CHINMAY GAWAD</span>
        </div>

        <ul className="nav-links">
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
      </nav>

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
          background: rgba(10, 12, 16, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          transition: all 0.3s ease;
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

        @media (max-width: 768px) {
          .navbar-header {
            top: 1rem;
            padding: 0 0.5rem;
          }
          .navbar-container {
            padding: 0.5rem 0.75rem;
          }
          .nav-links {
            gap: 0.25rem;
          }
          .nav-link {
            font-size: 0.68rem;
            padding: 0.2rem 0.3rem;
          }
          .logo-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
