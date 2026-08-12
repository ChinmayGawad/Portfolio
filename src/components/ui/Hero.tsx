import React, { useState, useEffect } from 'react';
import { FileText, Github, Linkedin, ArrowDown, Code2, X, Download, ExternalLink } from 'lucide-react';
import { profileDetails } from '../../data/projects';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Console Typing Effect
  const commands = [
    'booting ai & machine learning core v2.0',
    'building native android apps · kotlin & mvvm',
    'deploying machine learning workflows · python stack',
    'scanning constellation of skills',
    'system nominal · standing by'
  ];

  const [text, setText] = useState('');
  const [cmdIndex, setCmdIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentCmd = commands[cmdIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentCmd.substring(0, text.length - 1));
      }, 35);
    } else {
      timer = setTimeout(() => {
        setText(currentCmd.substring(0, text.length + 1));
      }, 70);
    }

    if (!isDeleting && text === currentCmd) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setCmdIndex((prev) => (prev + 1) % commands.length);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, cmdIndex]);

  // Handle ESC key to close resume modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setResumeModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-content">
        {/* Status Badge */}
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          <span className="mono-tag">SIGNAL LOCKED · PALGHAR SECTOR · OPEN TO MISSIONS</span>
        </div>

        {/* Title */}
        <h1 className="heading-large hero-title">
          CHINMAY <span className="highlight-name">GAWAD</span>
        </h1>

        {/* Roles Pill Bar */}
        <div className="roles-bar">
          <span className="role-tag role-ai">AI & MACHINE LEARNING DEVELOPER</span>
          <span className="dot-sep">✦</span>
          <span className="role-tag role-android">NATIVE ANDROID DEVELOPER</span>
          <span className="dot-sep">✦</span>
          <span className="role-tag role-ce">COMPUTER ENGINEER</span>
        </div>

        {/* Terminal Typing Box */}
        <div className="typing-box">
          <span className="typing-prefix">✦</span>
          <span className="typing-text">{text}</span>
          <span className="typing-cursor">_</span>
        </div>

        {/* Biography */}
        <p className="subheading hero-subtitle">
          Final-year BE Computer Engineering student at{' '}
          <strong>St. John College of Engineering & Management</strong>. Specializing in{' '}
          <strong className="text-cyan">Artificial Intelligence & Machine Learning</strong>,{' '}
          <strong className="text-emerald">Native Android App Development (Kotlin & MVVM)</strong>, algorithm optimization, and software architecture.
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => setResumeModalOpen(true)}
          >
            <FileText size={16} />
            <span>VIEW_RESUME.PDF</span>
          </button>

          <button className="btn-secondary" onClick={() => onNavigate('projects')}>
            <Code2 size={16} />
            <span>VIEW PROJECTS</span>
          </button>

          <a
            href={profileDetails.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>

          <a
            href={profileDetails.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="GitHub Profile"
          >
            <Github size={18} />
          </a>
        </div>

        <div className="scroll-indicator" onClick={() => onNavigate('about')}>
          <span className="scroll-text">SCROLL TO EXPLORE</span>
          <ArrowDown size={14} className="bounce-arrow" />
        </div>
      </div>

      {/* In-Page PDF Viewer Modal */}
      {resumeModalOpen && (
        <div className="resume-modal-backdrop" onClick={() => setResumeModalOpen(false)}>
          <div className="resume-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <div className="modal-title-group">
                <FileText size={18} className="modal-icon" />
                <span className="modal-title-text">Chinmay Gawad — Resume (PDF)</span>
              </div>

              <div className="modal-actions">
                <a
                  href={profileDetails.resumeUrl}
                  download="Chinmay_Gawad_Resume.pdf"
                  className="modal-action-btn"
                  title="Download Resume PDF"
                >
                  <Download size={15} />
                  <span>DOWNLOAD</span>
                </a>
                <a
                  href={profileDetails.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-action-btn"
                  title="Open in New Tab"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  className="modal-close-btn"
                  onClick={() => setResumeModalOpen(false)}
                >
                  <span>ESC</span>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="resume-pdf-container">
              <iframe
                src={`${profileDetails.resumeUrl}#toolbar=1&navpanes=0`}
                title="Chinmay Gawad Resume PDF"
                className="resume-iframe"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 7rem 0 4rem 0;
          text-align: center;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 900px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .badge-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 10px #34d399;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(52, 211, 153, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }

        .hero-title {
          margin-bottom: 1.25rem;
          font-size: clamp(3rem, 7.5vw, 6.5rem);
        }

        .highlight-name {
          color: var(--accent-color);
        }

        .roles-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          margin-bottom: 1.25rem;
        }

        .role-tag {
          font-weight: 600;
        }
        .role-ai { color: #818cf8; }
        .role-android { color: #34d399; }
        .role-ce { color: #38bdf8; }
        .dot-sep { color: rgba(255, 255, 255, 0.25); }

        .typing-box {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 42px;
          padding: 0 1.25rem;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          margin-bottom: 2rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          backdrop-filter: blur(8px);
        }

        .typing-prefix {
          color: #818cf8;
          font-weight: bold;
        }
        .typing-text {
          color: var(--text-primary);
        }
        .typing-cursor {
          color: #818cf8;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .hero-subtitle {
          max-width: 720px;
          margin-bottom: 2.5rem;
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .hero-subtitle strong {
          color: var(--text-primary);
        }
        .hero-subtitle .text-cyan { color: #38bdf8; }
        .hero-subtitle .text-emerald { color: #34d399; }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          flex-wrap: wrap;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          transition: all 0.25s ease;
        }

        .btn-icon:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
          background: rgba(56, 189, 248, 0.1);
          transform: translateY(-2px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          opacity: 0.65;
          transition: opacity 0.3s ease;
        }

        .scroll-indicator:hover {
          opacity: 1;
        }

        .scroll-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .bounce-arrow {
          color: var(--accent-color);
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(6px); }
          60% { transform: translateY(3px); }
        }

        /* Resume Modal Backdrop & Window */
        .resume-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(6, 7, 9, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .resume-modal-window {
          width: 100%;
          max-width: 960px;
          height: 88vh;
          background: rgba(10, 12, 16, 0.95);
          border: 1px solid var(--border-hover);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8);
        }

        .resume-modal-header {
          padding: 0.85rem 1.25rem;
          background: rgba(0, 0, 0, 0.6);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .modal-icon {
          color: var(--accent-color);
        }

        .modal-title-text {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .modal-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .modal-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .modal-action-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
          background: rgba(56, 189, 248, 0.1);
        }

        .modal-close-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: #f43f5e;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(244, 63, 94, 0.2);
          border-color: rgba(244, 63, 94, 0.4);
        }

        .resume-pdf-container {
          flex: 1;
          width: 100%;
          height: 100%;
          background: #000;
        }

        .resume-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 5.5rem 0 3rem 0;
          }
          .hero-badge {
            padding: 0.35rem 0.85rem;
            margin-bottom: 1rem;
          }
          .hero-title {
            font-size: clamp(2.2rem, 9vw, 4rem);
          }
          .roles-bar {
            font-size: 0.75rem;
            gap: 0.4rem;
          }
          .typing-box {
            max-width: 100%;
            padding: 0 0.85rem;
            font-size: 0.75rem;
            height: 38px;
          }
          .hero-subtitle {
            font-size: 0.95rem;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 320px;
          }
          .resume-modal-backdrop {
            padding: 0.5rem;
          }
          .resume-modal-window {
            height: 95vh;
          }
          .modal-title-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
}
