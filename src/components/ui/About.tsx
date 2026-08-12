import React from 'react';
import { profileDetails } from '../../data/projects';
import { CheckCircle2, Cpu, Smartphone, Code2, Wrench } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="about-section">
      <div className="container about-container">
        {/* Section Header */}
        <div className="about-header">
          <span className="mono-tag">// ABOUT · BACKGROUND & CORE DRIVE</span>
          <h2 className="heading-large about-title">
            Building <span className="highlight-text">intelligent systems</span> & meaningful software experiences.
          </h2>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="about-main-grid">
          {/* Left Column: Biography & Metrics */}
          <div className="bio-card">
            <p className="bio-paragraph">
              I am a final-year Computer Engineering undergraduate at <strong>St. John College of Engineering and Management</strong>, Palghar. My specialization lies at the intersection of <strong className="text-cyan">Artificial Intelligence & Machine Learning</strong>, and native <strong className="text-emerald">Android Mobile Applications with Kotlin & MVVM</strong>.
            </p>
            <p className="bio-paragraph">
              Driven by a self-motivated, hands-on engineering mindset, I focus on clean software architecture (MVVM, Room DB, REST APIs), machine learning pipelines, RAG retrieval models, and Data Structures & Algorithms.
            </p>

            {/* Academic & Repo Metrics */}
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-val text-purple">{profileDetails.metrics.sgpa}</span>
                <span className="metric-lbl">BE SGPA</span>
              </div>
              <div className="metric-box">
                <span className="metric-val text-cyan">{profileDetails.metrics.diplomaScore}</span>
                <span className="metric-lbl">DIPLOMA SCORE</span>
              </div>
              <div className="metric-box">
                <span className="metric-val text-emerald">{profileDetails.metrics.reposCount}</span>
                <span className="metric-lbl">REPOSITORIES</span>
              </div>
              <div className="metric-box">
                <span className="metric-val text-amber">{profileDetails.metrics.graduationYear}</span>
                <span className="metric-lbl">BE GRADUATION</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Credentials */}
          <div className="profile-credentials-card">
            <div className="profile-header">
              <div className="profile-avatar-wrapper">
                <img
                  src={profileDetails.avatarUrl}
                  alt={profileDetails.name}
                  className="profile-avatar"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{profileDetails.name}</h3>
                <p className="profile-username">@{profileDetails.username}</p>
                <p className="profile-loc">{profileDetails.location}</p>
              </div>
            </div>

            <ul className="credentials-list">
              <li className="cred-item">
                <CheckCircle2 size={16} className="cred-icon text-emerald" />
                <span><strong>Specialization:</strong> Native Android App Dev (Kotlin & MVVM).</span>
              </li>
              <li className="cred-item">
                <CheckCircle2 size={16} className="cred-icon text-cyan" />
                <span><strong>AI & ML Stack:</strong> Artificial Intelligence, Machine Learning, Python AI Stack.</span>
              </li>
              <li className="cred-item">
                <CheckCircle2 size={16} className="cred-icon text-purple" />
                <span><strong>Languages:</strong> Python, Java, Kotlin, C++, JavaScript, C#.</span>
              </li>
              <li className="cred-item">
                <CheckCircle2 size={16} className="cred-icon text-amber" />
                <span><strong>Academic Excellence:</strong> 9.29 SGPA (BE) & 88.00% (Diploma).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Skill Constellation Categories */}
        <div className="skills-constellation">
          <div className="skill-cat-card">
            <div className="cat-header">
              <div className="cat-icon-wrapper icon-cyan">
                <Cpu size={22} />
              </div>
              <div>
                <h4 className="cat-title">Artificial Intelligence & ML</h4>
                <span className="cat-badge text-cyan">CORE MISSION LAYER</span>
              </div>
            </div>
            <p className="cat-desc">Architecting machine learning pipelines, computer vision models, LLM workflows, and data-driven intelligent software.</p>
            <div className="tag-cloud">
              {profileDetails.skills.ai.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skill-cat-card">
            <div className="cat-header">
              <div className="cat-icon-wrapper icon-purple">
                <Smartphone size={22} />
              </div>
              <div>
                <h4 className="cat-title">Native Android & Mobile</h4>
                <span className="cat-badge text-purple">NATIVE MOBILE LAYER</span>
              </div>
            </div>
            <p className="cat-desc">Building native Android mobile apps with Kotlin, MVVM software architecture, Room DB persistence, and REST APIs.</p>
            <div className="tag-cloud">
              {profileDetails.skills.android.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skill-cat-card">
            <div className="cat-header">
              <div className="cat-icon-wrapper icon-emerald">
                <Code2 size={22} />
              </div>
              <div>
                <h4 className="cat-title">Core CS & Languages</h4>
                <span className="cat-badge text-emerald">COMPUTATIONAL FOUNDATION</span>
              </div>
            </div>
            <p className="cat-desc">Solid foundations in CS theory, algorithm design, data structures, DBMS, operating systems, and memory management.</p>
            <div className="tag-cloud">
              {profileDetails.skills.core.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skill-cat-card">
            <div className="cat-header">
              <div className="cat-icon-wrapper icon-amber">
                <Wrench size={22} />
              </div>
              <div>
                <h4 className="cat-title">Developer Tools & Pipeline</h4>
                <span className="cat-badge text-amber">DEVELOPMENT PIPELINE</span>
              </div>
            </div>
            <p className="cat-desc">Tooling for version control, continuous API testing, database management, and automated build execution.</p>
            <div className="tag-cloud">
              {profileDetails.skills.tools.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 6rem 0;
          position: relative;
        }

        .about-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .about-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 800px;
        }

        .about-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
        }

        .highlight-text {
          color: var(--accent-color);
        }

        .about-main-grid {
          display: grid;
          grid-template-columns: 7fr 5fr;
          gap: 1.75rem;
        }

        .bio-card, .profile-credentials-card {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 2rem;
          backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bio-paragraph {
          color: var(--text-secondary);
          font-size: 1.025rem;
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }

        .bio-paragraph strong {
          color: var(--text-primary);
        }
        .bio-paragraph .text-cyan { color: #38bdf8; }
        .bio-paragraph .text-emerald { color: #34d399; }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
        }

        .metric-box {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 0.85rem 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-val {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
        }
        .text-purple { color: #818cf8; }
        .text-cyan { color: #38bdf8; }
        .text-emerald { color: #34d399; }
        .text-amber { color: #fbbf24; }

        .metric-lbl {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          margin-top: 0.2rem;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .profile-avatar-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(129, 140, 248, 0.4);
          background: #000;
          flex-shrink: 0;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-username {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: #818cf8;
        }

        .profile-loc {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .credentials-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .cred-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .cred-item strong {
          color: var(--text-primary);
        }

        .cred-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        /* Skills Constellation */
        .skills-constellation {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .skill-cat-card {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 1.75rem;
          backdrop-filter: blur(14px);
          transition: all 0.3s ease;
        }

        .skill-cat-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-4px);
        }

        .cat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.9rem;
        }

        .cat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-cyan { background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25); }
        .icon-purple { background: rgba(129, 140, 248, 0.1); color: #818cf8; border: 1px solid rgba(129, 140, 248, 0.25); }
        .icon-emerald { background: rgba(52, 211, 153, 0.1); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.25); }
        .icon-amber { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.25); }

        .cat-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .cat-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .cat-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .skill-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          padding: 0.3rem 0.65rem;
          border-radius: 8px;
        }

        @media (max-width: 900px) {
          .about-main-grid, .skills-constellation {
            grid-template-columns: 1fr;
          }
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
