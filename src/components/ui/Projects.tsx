import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderGit2,
  Code2,
  Smartphone,
  Star,
  GitFork,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  Maximize2,
  X,
  Terminal,
} from 'lucide-react';
import { GITHUB_REPOSITORIES, Repository } from '../../data/projects';

export function Projects() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Fetch real GitHub repositories dynamically with API, fallback to dataset
  useEffect(() => {
    async function loadRepos() {
      try {
        setLoading(true);
        const res = await fetch(
          'https://api.github.com/users/ChinmayGawad/repos?sort=updated&per_page=100&type=owner'
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const filtered = data
          .filter((r: any) => !r.fork)
          .map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description || 'Developer software repository hosted on GitHub.',
            language: r.language || 'Code',
            stargazers_count: r.stargazers_count || 0,
            forks_count: r.forks_count || 0,
            size: r.size || 0,
            updated_at: r.updated_at,
            html_url: r.html_url,
            clone_url: r.clone_url || `https://github.com/ChinmayGawad/${r.name}.git`,
          }));

        if (filtered.length > 0) {
          setRepos(filtered);
          setSelectedRepo(filtered[0]);
        } else {
          setRepos(GITHUB_REPOSITORIES);
          setSelectedRepo(GITHUB_REPOSITORIES[0]);
        }
      } catch (err) {
        console.warn('GitHub API offline or rate-limited, loading local fallback:', err);
        setRepos(GITHUB_REPOSITORIES);
        setSelectedRepo(GITHUB_REPOSITORIES[0]);
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
  }, []);

  // Compute unique languages present across repositories
  const languages = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => {
      if (r.language) set.add(r.language);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [repos]);

  // Filter repos based on selected language pill
  const filteredRepos = useMemo(() => {
    if (selectedLanguage === 'ALL') return repos;
    return repos.filter(
      (r) => r.language && r.language.toLowerCase() === selectedLanguage.toLowerCase()
    );
  }, [repos, selectedLanguage]);

  // Update selected repo when filtered list changes
  useEffect(() => {
    if (filteredRepos.length > 0 && (!selectedRepo || !filteredRepos.some((r) => r.id === selectedRepo.id))) {
      setSelectedRepo(filteredRepos[0]);
    }
  }, [filteredRepos, selectedRepo]);

  // Copy git clone command to clipboard
  const handleCopyClone = (cloneUrl: string) => {
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="projects" className="projects-section">
      <div className="container projects-container">
        {/* Section Header */}
        <div className="projects-header-wrapper">
          <span className="mono-tag">// CODE VAULT · GITHUB REPOSITORIES</span>
          <h2 className="heading-large projects-main-title">GitHub Repositories Explorer</h2>
        </div>

        {/* Language Filter Pills */}
        <div className="filter-pills-scroll">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`pill-btn ${selectedLanguage === lang ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Split IDE Card Window */}
        <div className="ide-card-window">
          <div className="ide-split-grid">
            {/* Left Pane: Repositories List */}
            <div className="ide-left-pane">
              <div className="pane-header">
                <div className="pane-title">
                  <FolderGit2 size={15} className="pane-icon" />
                  <span>REPOSITORIES</span>
                </div>
                <span className="pane-count">
                  {loading ? 'Scanning...' : `${filteredRepos.length} repos`}
                </span>
              </div>

              <div className="repo-list-container">
                {filteredRepos.map((repo) => {
                  const isSelected = selectedRepo?.id === repo.id;
                  const isMobileApp =
                    repo.language === 'Kotlin' ||
                    repo.name.toLowerCase().includes('app') ||
                    repo.name.toLowerCase().includes('android');

                  return (
                    <div
                      key={repo.id}
                      className={`repo-list-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedRepo(repo)}
                    >
                      <div className="repo-item-left">
                        {isMobileApp ? (
                          <Smartphone size={15} className="repo-type-icon text-cyan" />
                        ) : (
                          <Code2 size={15} className="repo-type-icon text-cyan" />
                        )}
                        <span className="repo-item-name">{repo.name}</span>
                      </div>

                      <div className="repo-item-stars">
                        <Star size={12} className="star-icon" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Inspector */}
            <div className="ide-right-pane">
              {selectedRepo ? (
                <div className="inspector-content">
                  <div className="inspector-top-bar">
                    <span className="inspector-breadcrumb">
                      REPOSITORIES // INSPECTOR
                    </span>
                    <span className="inspector-lang-badge">{selectedRepo.language}</span>
                  </div>

                  <h3 className="inspector-repo-title">{selectedRepo.name}</h3>
                  <p className="inspector-repo-desc">{selectedRepo.description}</p>

                  {/* Terminal Clone Command Box */}
                  <div className="clone-terminal-box">
                    <div className="clone-cmd-text">
                      <Terminal size={14} className="terminal-prompt" />
                      <span>git clone {selectedRepo.clone_url || `https://github.com/ChinmayGawad/${selectedRepo.name}.git`}</span>
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() =>
                        handleCopyClone(
                          selectedRepo.clone_url || `https://github.com/ChinmayGawad/${selectedRepo.name}.git`
                        )
                      }
                    >
                      {copied ? (
                        <>
                          <Check size={13} />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 3 Metric Cards Grid (Stars, Forks, Size) */}
                  <div className="inspector-metrics-grid">
                    <div className="metric-card">
                      <div className="metric-val-group">
                        <Star size={16} className="metric-icon text-cyan" />
                        <span className="metric-value">{selectedRepo.stargazers_count}</span>
                      </div>
                      <span className="metric-label">STARS</span>
                    </div>

                    <div className="metric-card">
                      <div className="metric-val-group">
                        <GitFork size={16} className="metric-icon text-purple" />
                        <span className="metric-value">{selectedRepo.forks_count}</span>
                      </div>
                      <span className="metric-label">FORKS</span>
                    </div>

                    <div className="metric-card">
                      <div className="metric-val-group">
                        <HardDrive size={16} className="metric-icon text-emerald" />
                        <span className="metric-value">{selectedRepo.size} KB</span>
                      </div>
                      <span className="metric-label">SIZE</span>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="inspector-actions">
                    <a
                      href={selectedRepo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1-btn"
                    >
                      <span>OPEN ON GITHUB</span>
                      <ExternalLink size={16} />
                    </a>

                    <button
                      className="expand-btn"
                      onClick={() => setModalOpen(true)}
                      title="Expand View"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="inspector-placeholder">
                  <p>Select a repository from the left panel to inspect details.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explore All CTA Button */}
        <div className="explore-all-cta">
          <a
            href="https://github.com/ChinmayGawad?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <span>OPEN ALL REPOSITORIES ON GITHUB</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Expanded Inspector Modal */}
        {modalOpen && selectedRepo && (
          <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <span>CLOSE [ESC]</span>
                <X size={16} />
              </button>

              <div className="modal-top">
                <span className="modal-badge">{selectedRepo.language}</span>
              </div>

              <h3 className="modal-title">{selectedRepo.name}</h3>
              <p className="modal-desc">{selectedRepo.description}</p>

              <div className="clone-terminal-box mb-4">
                <div className="clone-cmd-text">
                  <Terminal size={14} className="terminal-prompt" />
                  <span>git clone {selectedRepo.clone_url || `https://github.com/ChinmayGawad/${selectedRepo.name}.git`}</span>
                </div>
                <button
                  className="copy-btn"
                  onClick={() =>
                    handleCopyClone(
                      selectedRepo.clone_url || `https://github.com/ChinmayGawad/${selectedRepo.name}.git`
                    )
                  }
                >
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>

              <div className="inspector-metrics-grid mb-6">
                <div className="metric-card">
                  <div className="metric-val-group">
                    <Star size={16} className="text-cyan" />
                    <span>{selectedRepo.stargazers_count}</span>
                  </div>
                  <span className="metric-label">STARS</span>
                </div>
                <div className="metric-card">
                  <div className="metric-val-group">
                    <GitFork size={16} className="text-purple" />
                    <span>{selectedRepo.forks_count}</span>
                  </div>
                  <span className="metric-label">FORKS</span>
                </div>
                <div className="metric-card">
                  <div className="metric-val-group">
                    <HardDrive size={16} className="text-emerald" />
                    <span>{selectedRepo.size} KB</span>
                  </div>
                  <span className="metric-label">SIZE</span>
                </div>
              </div>

              <a
                href={selectedRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center justify-center"
              >
                <span>VIEW ON GITHUB</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .projects-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 6rem 0;
          position: relative;
        }

        .projects-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .projects-header-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .projects-main-title {
          font-size: clamp(2.2rem, 5vw, 4rem);
        }

        /* Filter Pills Horizontal Bar */
        .filter-pills-scroll {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
        }

        .pill-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.4rem 1.1rem;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .pill-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.06);
        }

        .pill-btn.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.4);
          color: var(--accent-color);
          font-weight: 600;
        }

        /* IDE Window Container */
        .ide-card-window {
          background: rgba(10, 12, 16, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }

        .ide-split-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          min-height: 480px;
        }

        /* Left Pane */
        .ide-left-pane {
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.35);
        }

        .pane-header {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }

        .pane-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-color);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .pane-icon {
          color: var(--accent-color);
        }

        .pane-count {
          color: var(--text-muted);
        }

        .repo-list-container {
          overflow-y: auto;
          max-height: 420px;
          padding: 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .repo-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .repo-list-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .repo-list-item.active {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .repo-item-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }

        .text-cyan { color: var(--accent-color); }
        .text-purple { color: #818cf8; }
        .text-emerald { color: #34d399; }

        .repo-item-name {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .repo-item-stars {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .star-icon {
          fill: currentColor;
        }

        /* Right Pane (Inspector) */
        .ide-right-pane {
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .inspector-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }

        .inspector-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .inspector-breadcrumb {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--accent-color);
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .inspector-lang-badge {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-weight: 500;
        }

        .inspector-repo-title {
          font-family: var(--font-heading);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.15;
        }

        .inspector-repo-desc {
          font-size: 0.975rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }

        /* Terminal Clone Box */
        .clone-terminal-box {
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .clone-cmd-text {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--text-primary);
          overflow-x: auto;
          white-space: nowrap;
        }

        .terminal-prompt {
          color: var(--accent-color);
          flex-shrink: 0;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .copy-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.1);
        }

        /* Metrics 3 Cards */
        .inspector-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .metric-card {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .metric-val-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }

        /* Action Buttons */
        .inspector-actions {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .flex-1-btn {
          flex: 1;
        }

        .expand-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        .expand-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-hover);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .explore-all-cta {
          display: flex;
          justify-content: center;
          margin-top: 0.5rem;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(6, 7, 9, 0.85);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-card {
          width: 100%;
          max-width: 620px;
          background: rgba(10, 12, 16, 0.95);
          border: 1px solid var(--border-hover);
          border-radius: 24px;
          padding: 2.25rem;
          position: relative;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
          color: #f43f5e;
        }

        .modal-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent-color);
          background: rgba(56, 189, 248, 0.1);
          padding: 0.3rem 0.8rem;
          border-radius: 9999px;
          border: 1px solid rgba(56, 189, 248, 0.25);
        }

        .modal-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem 0;
        }

        .modal-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 900px) {
          .ide-split-grid {
            grid-template-columns: 1fr;
          }
          .ide-left-pane {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
          .repo-list-container {
            max-height: 240px;
          }
          .ide-right-pane {
            padding: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .inspector-repo-title {
            font-size: clamp(1.4rem, 6vw, 2rem);
          }
          .inspector-metrics-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
          }
          .metric-card {
            padding: 0.75rem 0.35rem;
          }
          .metric-val-group {
            font-size: 1.05rem;
          }
          .clone-terminal-box {
            padding: 0.6rem 0.75rem;
          }
          .modal-card {
            padding: 1.5rem;
          }
          .modal-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
