// ==========================================================================
// MAIN HACKER PORTFOLIO APPLICATION LOGIC
// ==========================================================================

const GITHUB_USERNAME = 'ChinmayGawad';
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;

let allRepos = [];
let currentFilter = 'All';

// Initialize icons and features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGithubLinks();
    initTypingEffect();
    initScrollAnimations();
    initActiveNav();
    fetchRepos();

    if (window.lucide) {
        lucide.createIcons();
    }
});

// --------------------------------------------------------------------------
// 1. Theme Management (Dark Hacker Default + Cyber Light Toggle)
// --------------------------------------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        updateThemeToggleIcon(true);
    } else {
        document.documentElement.classList.remove('light-theme');
        updateThemeToggleIcon(false);
    }
}

function toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeToggleIcon(isLight);
    showToast(isLight ? '[SYS_THEME]: CYBER_LIGHT_ENABLED' : '[SYS_THEME]: MATRIX_DARK_ENABLED');
}

function updateThemeToggleIcon(isLight) {
    const iconContainer = document.getElementById('theme-icon');
    if (iconContainer) {
        iconContainer.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        if (window.lucide) lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 2. Terminal CLI Typing Effect
// --------------------------------------------------------------------------
function initTypingEffect() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const commands = [
        './run_android_dev.sh --lang=Kotlin',
        'cat /etc/skills/computer_engineering.txt',
        'ssh root@chinmay.dev -p 2026',
        'exec build_mobile_apps --mode=release',
        'git commit -m "Deploying innovative solutions"'
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentCmd = commands[cmdIndex];

        if (isDeleting) {
            target.textContent = currentCmd.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 35;
        } else {
            target.textContent = currentCmd.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentCmd.length) {
            typeSpeed = 2000; // Pause at line end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            cmdIndex = (cmdIndex + 1) % commands.length;
            typeSpeed = 300;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// --------------------------------------------------------------------------
// 3. GitHub Profile Links Setup
// --------------------------------------------------------------------------
function initGithubLinks() {
    const navLink = document.getElementById('github-nav-profile');
    const profileCta = document.getElementById('github-profile-cta');
    const reposCta = document.getElementById('github-repos-cta');
    const footerLink = document.getElementById('github-profile-footer');
    const handle = document.getElementById('github-handle');

    [navLink, profileCta, footerLink].forEach(el => {
        if (el) el.href = GITHUB_PROFILE_URL;
    });

    if (reposCta) reposCta.href = GITHUB_REPOS_URL;
    if (handle) handle.textContent = `root@${GITHUB_USERNAME}`;
}

// --------------------------------------------------------------------------
// 4. GitHub Repos Fetch & Hacker Cards Renderer
// --------------------------------------------------------------------------
const LANG_COLORS = {
    'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5', 'Java': '#b07219',
    'Kotlin': '#00ff66', 'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600', 'HTML': '#e34c26',
    'CSS': '#563d7c', 'Dart': '#00B4AB', 'Go': '#00ADD8', 'Rust': '#dea584'
};

function getLangColor(lang) {
    return LANG_COLORS[lang] || '#00ff66';
}

function getRepoIcon(repo) {
    const lang = repo.language || '';
    const name = repo.name.toLowerCase();
    if (lang === 'Kotlin' || name.includes('android')) return 'smartphone';
    if (lang === 'Java' || lang === 'C++' || lang === 'C') return 'terminal';
    if (name.includes('portfolio') || name.includes('website')) return 'globe';
    return 'folder-git-2';
}

function formatSize(kb) {
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb + ' KB';
}

function timeAgo(dateStr) {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
    return Math.floor(diff / 2592000) + 'mo ago';
}

async function fetchRepos() {
    const grid = document.getElementById('proj-grid');
    const errorEl = document.getElementById('proj-error');
    const countEl = document.getElementById('repo-count');
    const heroRepos = document.getElementById('hero-repos');
    const heroStars = document.getElementById('hero-stars');

    if (!grid) return;

    if (errorEl) errorEl.classList.add('hidden');
    grid.classList.remove('hidden');
    showSkeletons(6);
    if (countEl) countEl.textContent = '[FETCHING...]';

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=owner`);
        if (!res.ok) throw new Error('API Error: ' + res.status);
        const data = await res.json();

        allRepos = data.filter(r => !r.fork).slice(0, 12);

        if (heroRepos) heroRepos.textContent = allRepos.length + '+';
        const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0);
        if (heroStars) heroStars.textContent = totalStars;
        if (countEl) countEl.textContent = allRepos.length + ' REPOS';

        buildFilters();
        renderCards(allRepos);

    } catch (err) {
        console.error('GitHub API fetch error:', err);
        grid.classList.add('hidden');
        if (errorEl) errorEl.classList.remove('hidden');
        if (countEl) countEl.textContent = '[OFFLINE]';
        if (heroRepos) heroRepos.textContent = '—';
        if (heroStars) heroStars.textContent = '—';
    }
}

function showSkeletons(count) {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'hacker-card p-6';
        el.innerHTML = `
            <div class="terminal-bar -mx-6 -mt-6 mb-4">
                <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
                <span>FETCHING_REPO.SH</span>
            </div>
            <div class="h-4 w-32 bg-emerald-500/10 rounded animate-pulse mb-3"></div>
            <div class="h-3 w-full bg-emerald-500/10 rounded animate-pulse mb-2"></div>
            <div class="h-3 w-2/3 bg-emerald-500/10 rounded animate-pulse mb-4"></div>
            <div class="h-5 w-20 bg-emerald-500/10 rounded-full animate-pulse"></div>
        `;
        grid.appendChild(el);
    }
}

function buildFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;
    const langs = new Set();
    allRepos.forEach(r => { if (r.language) langs.add(r.language); });
    const langArr = Array.from(langs).sort();

    let html = `<button class="tech-pill active" onclick="filterProj('All',this)">$ ALL</button>`;
    langArr.forEach(l => {
        html += `<button class="tech-pill" onclick="filterProj('${l}',this)">$ ${l}</button>`;
    });
    container.innerHTML = html;
}

function renderCards(repos) {
    const grid = document.getElementById('proj-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (repos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-emerald-400 font-mono">
                <i data-lucide="terminal" class="w-10 h-10 mx-auto mb-2 opacity-60"></i>
                <p>[SYSTEM_MSG]: NO REPOSITORIES MATCH CURRENT FILTER.</p>
            </div>`;
        if (window.lucide) lucide.createIcons();
        return;
    }

    repos.forEach((repo) => {
        const lang = repo.language || 'Source';
        const icon = getRepoIcon(repo);
        const desc = repo.description || 'Developer module repository hosted on GitHub.';
        const size = formatSize(repo.size);
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        const updated = timeAgo(repo.updated_at);
        const url = repo.html_url;

        const card = document.createElement('div');
        card.className = 'hacker-card p-6 flex flex-col justify-between';
        card.innerHTML = `
            <div>
                <div class="terminal-bar -mx-6 -mt-6 mb-4">
                    <div class="terminal-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
                    <span class="font-mono text-xs text-emerald-400">${repo.name}.git</span>
                </div>
                <div class="flex items-start justify-between mb-3">
                    <a href="${url}" target="_blank" class="flex items-center gap-3 group text-decoration-none">
                        <div class="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors">
                            <i data-lucide="${icon}" class="w-4 h-4"></i>
                        </div>
                        <div class="min-w-0">
                            <h3 class="text-base font-mono font-bold text-white truncate group-hover:text-emerald-400 transition-colors">${repo.name}</h3>
                            <div class="flex items-center gap-2 text-xs font-mono text-emerald-500/70">
                                <span>SIZE: ${size}</span>
                                <span>·</span>
                                <span>MOD: ${updated}</span>
                            </div>
                        </div>
                    </a>
                </div>
                <p class="text-xs font-mono text-slate-300 mb-4 line-clamp-2 leading-relaxed">${desc}</p>
            </div>
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="code-badge">
                        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                        ${lang}
                    </span>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-emerald-500/20 text-xs font-mono text-slate-400">
                    <div class="flex items-center gap-4">
                        <span class="flex items-center gap-1 text-amber-400" title="Stars">
                            <i data-lucide="star" class="w-3.5 h-3.5"></i> ${stars}
                        </span>
                        <span class="flex items-center gap-1 text-emerald-400" title="Forks">
                            <i data-lucide="git-fork" class="w-3.5 h-3.5"></i> ${forks}
                        </span>
                    </div>
                    <a href="${url}" target="_blank" class="flex items-center gap-1 text-emerald-400 hover:underline">
                        [SRC_CODE] <i data-lucide="external-link" class="w-3 h-3"></i>
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

function filterProj(cat, btn) {
    document.querySelectorAll('#filter-container .tech-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    const filtered = cat === 'All' ? allRepos : allRepos.filter(r => r.language === cat);
    renderCards(filtered);
}

// --------------------------------------------------------------------------
// 5. Scroll Animations & Nav Highlighting
// --------------------------------------------------------------------------
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navBoxes = document.querySelectorAll('.nav-box');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 180;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navBoxes.forEach(box => {
                    box.classList.remove('active');
                    if (box.getAttribute('onclick')?.includes(sectionId)) {
                        box.classList.add('active');
                    }
                });
            }
        });

        // Scroll to Top Button Visibility
        const scrollBtn = document.getElementById('scrollTop');
        if (scrollBtn) {
            if (window.scrollY > 400) {
                scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                scrollBtn.classList.add('opacity-0', 'pointer-events-none');
            }
        }
    });
}

function navTo(el, id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// --------------------------------------------------------------------------
// 6. Contact Form Submission (Web3Forms API Integration)
// --------------------------------------------------------------------------
async function handleForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.append("access_key", "d6ac1388-1d4c-4e2a-97ef-3f57da1cde9d");

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>[SENDING_PACKET...]</span>';
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            showToast('[SYS_MSG]: MESSAGE TRANSMITTED SUCCESSFULLY! 🚀');
            form.reset();
        } else {
            showToast('[SYS_ERR]: TRANSMISSION FAILED. RETRY.');
        }
    } catch (error) {
        showToast('[SYS_ERR]: NETWORK UNREACHABLE.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (window.lucide) lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 7. System Toast Notification
// --------------------------------------------------------------------------
function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}
