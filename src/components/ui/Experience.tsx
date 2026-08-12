import React from 'react';
import { experiences } from '../../data/projects';
import { Briefcase, MapPin, Calendar, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';

export function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="container experience-container">
        {/* Section Header */}
        <div className="experience-header">
          <span className="mono-tag">// PROFESSIONAL LOG · WORK EXPERIENCE</span>
          <h2 className="heading-large experience-title">Work Experience</h2>
          <p className="subheading experience-subtitle">
            Professional software engineering internships in native Android app development and cybersecurity.
          </p>
        </div>

        {/* Experience Timeline Grid */}
        <div className="experience-timeline">
          {experiences.map((item) => (
            <article key={item.id} className="experience-card">
              <div className="card-header-bar">
                <div className="role-company-group">
                  <div className="company-icon-box">
                    {item.role.toLowerCase().includes('android') ? (
                      <Smartphone size={20} className="icon-cyan" />
                    ) : (
                      <ShieldCheck size={20} className="icon-purple" />
                    )}
                  </div>
                  <div>
                    <h3 className="role-title">{item.role}</h3>
                    <p className="company-name">{item.company}</p>
                  </div>
                </div>

                <div className="badge-meta-group">
                  {item.isCurrent && <span className="status-badge-live">PRESENT</span>}
                  <div className="meta-pill">
                    <Calendar size={13} />
                    <span>{item.period}</span>
                  </div>
                  <div className="meta-pill">
                    <MapPin size={13} />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Highlights Bullet List */}
              <ul className="highlights-list">
                {item.highlights.map((point, idx) => (
                  <li key={idx} className="highlight-item">
                    <CheckCircle2 size={16} className="bullet-icon text-cyan" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Skills Tags */}
              <div className="experience-skills-cloud">
                {item.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="exp-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .experience-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 6rem 0;
          position: relative;
        }

        .experience-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .experience-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 750px;
        }

        .experience-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
        }

        .experience-subtitle {
          color: var(--text-secondary);
        }

        .experience-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .experience-card {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--accent-color);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(14px);
          transition: all 0.3s ease;
        }

        .experience-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover);
          background: rgba(15, 23, 42, 0.7);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        }

        .card-header-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-color);
        }

        .role-company-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .company-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-cyan { color: var(--accent-color); }
        .icon-purple { color: #818cf8; }

        .role-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .company-name {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          color: var(--accent-color);
          font-weight: 600;
          margin-top: 0.1rem;
        }

        .badge-meta-group {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .status-badge-live {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.35);
          letter-spacing: 0.05em;
        }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
        }

        .highlights-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.975rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .highlight-item span {
          color: var(--text-primary);
        }

        .bullet-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .text-cyan { color: var(--accent-color); }

        .experience-skills-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .exp-skill-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        @media (max-width: 640px) {
          .card-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
