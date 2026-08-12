import React from 'react';
import { profileDetails } from '../../data/projects';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

export function Journey() {
  const icons = [GraduationCap, Award, BookOpen];

  return (
    <section id="journey" className="journey-section">
      <div className="container journey-container">
        <div className="journey-header">
          <span className="mono-tag">// ORBITAL LOG · ACADEMIC JOURNEY</span>
          <h2 className="heading-large journey-title">Academic Journey</h2>
        </div>

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
          gap: 3rem;
        }

        .journey-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .journey-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
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
      `}</style>
    </section>
  );
}
