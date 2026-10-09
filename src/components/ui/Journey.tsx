import React, { useState } from 'react';
import { profileDetails, certifications } from '../../data/projects';
import { GraduationCap, Award, BookOpen, BadgeCheck, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

export function Journey() {
  const [activeTab, setActiveTab] = useState<'education' | 'certifications'>('education');
  const icons = [GraduationCap, Award, BookOpen];

  return (
    <section id="journey" className="journey-section">
      <div className="container journey-container">
        <div className="journey-header">
          <span className="mono-tag">// ORBITAL LOG · ACADEMIC & CERTIFICATIONS</span>
          <h2 className="heading-large journey-title">Education & Credentials</h2>
          <p className="journey-subtitle">
            Formal technical education, academic excellence, and verified industry certifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="journey-tab-bar">
          <button
            className={`tab-toggle-btn ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            <GraduationCap size={16} />
            <span>ACADEMIC DEGREES ({profileDetails.education.length})</span>
          </button>
          <button
            className={`tab-toggle-btn ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            <BadgeCheck size={16} />
            <span>CERTIFICATIONS ({certifications.length})</span>
          </button>
        </div>

        {/* Education Timeline */}
        {activeTab === 'education' && (
          <div className="timeline-cards">
            {profileDetails.education.map((edu, idx) => {
              const Icon = icons[idx] || GraduationCap;
              return (
                <div key={idx} className="journey-card">
                  <div className="journey-top">
                    <div className="journey-title-group">
                      <div className="journey-icon-box">
                        <Icon size={20} className="journey-icon" />
                      </div>
                      <div>
                        <h3 className="institution-name">{edu.institution}</h3>
                        <span className="degree-name">{edu.degree}</span>
                      </div>
                    </div>

                    <div className="journey-badge-group">
                      <span className="status-pill">{edu.status}</span>
                      <span className="period-tag">{edu.period}</span>
                    </div>
                  </div>

                  <div className="journey-meta">
                    <span className="score-tag">
                      SCORE: <strong className="score-val">{edu.score}</strong>
                    </span>
                  </div>

                  <p className="journey-details">{edu.details}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Certifications Grid */}
        {activeTab === 'certifications' && (
          <div className="certifications-grid">
            {certifications.map((cert) => (
              <div key={cert.id} className="cert-card">
                <div className="cert-top-row">
                  <div className="cert-badge-pill">{cert.domain}</div>
                  <div className="cert-year">
                    <Calendar size={13} />
                    <span>{cert.year}</span>
                  </div>
                </div>

                <div className="cert-main">
                  <BadgeCheck size={18} className="cert-icon text-cyan" />
                  <h4 className="cert-name">{cert.title}</h4>
                </div>

                <p className="cert-issuer">Issuer: <strong>{cert.issuer}</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .journey-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding: 6rem 0;
          position: relative;
        }

        .journey-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .journey-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .journey-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
        }

        .journey-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .journey-tab-bar {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .tab-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0a0c10;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .tab-toggle-btn:hover {
          border-color: var(--accent-color);
          color: var(--text-primary);
        }

        .tab-toggle-btn.active {
          background: rgba(56, 189, 248, 0.12);
          border-color: var(--accent-color);
          color: var(--accent-color);
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.2);
        }

        .timeline-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .journey-card {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--accent-color);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(14px);
          transition: all 0.3s ease;
        }

        .journey-card:hover {
          transform: translateX(6px);
          border-color: var(--border-hover);
          background: rgba(15, 23, 42, 0.7);
        }

        .journey-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .journey-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .journey-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .journey-icon {
          color: var(--accent-color);
        }

        .institution-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .degree-name {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .journey-badge-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          background: rgba(129, 140, 248, 0.15);
          color: #818cf8;
          border: 1px solid rgba(129, 140, 248, 0.3);
        }

        .period-tag {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .journey-meta {
          margin-bottom: 0.75rem;
        }

        .score-tag {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .score-val {
          color: #34d399;
        }

        .journey-details {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Certifications Grid */
        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .cert-card {
          background: #0a0c10;
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .cert-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover);
          background: rgba(15, 23, 42, 0.7);
          box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .cert-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cert-badge-pill {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.25);
          font-weight: 600;
        }

        .cert-year {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .cert-main {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .cert-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .cert-name {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .cert-issuer {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cert-issuer strong {
          color: var(--accent-color);
        }
      `}</style>
    </section>
  );
}
