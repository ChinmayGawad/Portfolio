import React, { useState } from 'react';
import { profileDetails } from '../../data/projects';
import { Mail, Github, Linkedin, Phone, MapPin, MessageSquare, Send, Check } from 'lucide-react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        <div className="contact-header text-center">
          <span className="mono-tag">// OPEN CHANNEL · ESTABLISH CONNECTION</span>
          <h2 className="heading-large contact-title">Let's Build Something Extraordinary</h2>
          <p className="subheading contact-subtitle">
            Whether you have a project inquiry, mission opportunity, or want to collaborate on AI and mobile engineering, reach out directly.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Column */}
          <div className="contact-channels">
            <a
              href={profileDetails.github}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
            >
              <div className="channel-icon icon-purple">
                <Github size={20} />
              </div>
              <div>
                <p className="channel-label">GITHUB PROFILE</p>
                <p className="channel-value">github.com/ChinmayGawad</p>
              </div>
            </a>

            <a
              href={profileDetails.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card"
            >
              <div className="channel-icon icon-cyan">
                <Linkedin size={20} />
              </div>
              <div>
                <p className="channel-label">LINKEDIN PROFILE</p>
                <p className="channel-value">linkedin.com/in/chinmay-gawad</p>
              </div>
            </a>

            <a href={`mailto:${profileDetails.email}`} className="channel-card">
              <div className="channel-icon icon-emerald">
                <Mail size={20} />
              </div>
              <div>
                <p className="channel-label">DIRECT EMAIL</p>
                <p className="channel-value">{profileDetails.email}</p>
              </div>
            </a>

            <div className="channel-card">
              <div className="channel-icon icon-amber">
                <MapPin size={20} />
              </div>
              <div>
                <p className="channel-label">LOCATION</p>
                <p className="channel-value">{profileDetails.location}</p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-card">
            <h3 className="form-heading">Transmit Message</h3>
            <p className="form-sub">Send a direct message to Chinmay Gawad.</p>

            <form onSubmit={handleSubmit} className="form-body">
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Chinmay Gawad"
                    className="form-input"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">YOUR EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="user@domain.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">SUBJECT</label>
                <input
                  type="text"
                  placeholder="Project Inquiry or Opportunity"
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <label className="input-label">MESSAGE</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter your message details..."
                  className="form-input form-textarea"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary form-submit">
                {submitted ? (
                  <>
                    <Check size={16} />
                    <span>MESSAGE TRANSMITTED</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>TRANSMIT MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bar with Social Links & Icons */}
        <footer className="footer-bar">
          <div className="footer-copyright">
            <p>
              © {new Date().getFullYear()} <strong className="footer-name">Chinmay Gawad</strong>. All systems nominal.
            </p>
          </div>

          <div className="footer-socials">
            <a
              href={profileDetails.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link footer-github"
              title="GitHub Profile"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>

            <a
              href={profileDetails.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link footer-linkedin"
              title="LinkedIn Profile"
            >
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>

            <a
              href={`mailto:${profileDetails.email}`}
              className="footer-social-link footer-email"
              title="Send Email"
            >
              <Mail size={16} />
              <span>Email</span>
            </a>
          </div>
        </footer>
      </div>

      <style>{`
        .contact-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 6rem 0 3rem 0;
          position: relative;
        }

        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .contact-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          max-width: 750px;
          margin: 0 auto;
        }

        .contact-title {
          font-size: clamp(2rem, 4.5vw, 3.75rem);
        }

        .contact-subtitle {
          color: var(--text-secondary);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 2rem;
          align-items: start;
        }

        .contact-channels {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .channel-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.4rem;
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          text-decoration: none;
          backdrop-filter: blur(14px);
          transition: all 0.25s ease;
        }

        .channel-card:hover {
          border-color: var(--border-hover);
          transform: translateX(4px);
          background: rgba(15, 23, 42, 0.7);
        }

        .channel-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-cyan { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .icon-purple { background: rgba(129, 140, 248, 0.1); color: #818cf8; }
        .icon-emerald { background: rgba(52, 211, 153, 0.1); color: #34d399; }
        .icon-amber { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }

        .channel-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .channel-value {
          font-family: var(--font-heading);
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-top: 0.1rem;
        }

        .contact-form-card {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 2.5rem;
          backdrop-filter: blur(14px);
        }

        .form-heading {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-sub {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.75rem;
        }

        .form-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .form-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--accent-color);
        }

        .form-textarea {
          resize: none;
        }

        .form-submit {
          width: 100%;
          margin-top: 0.5rem;
        }

        /* Footer Bar */
        .footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .footer-name {
          color: #818cf8;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .footer-social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          transition: all 0.25s ease;
        }

        .footer-social-link:hover {
          transform: translateY(-2px);
        }

        .footer-github:hover {
          color: #818cf8;
          border-color: rgba(129, 140, 248, 0.4);
          background: rgba(129, 140, 248, 0.1);
        }

        .footer-linkedin:hover {
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.1);
        }

        .footer-email:hover {
          color: #34d399;
          border-color: rgba(52, 211, 153, 0.4);
          background: rgba(52, 211, 153, 0.1);
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .footer-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
