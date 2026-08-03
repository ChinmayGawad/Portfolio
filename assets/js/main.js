// ==========================================================================
// MAIN GALAXY PORTFOLIO APPLICATION LOGIC
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
// 1. Theme Management (Starfield Dark Default + Galaxy Light Toggle)
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
    showToast(isLight ? 'Light mode active · galaxy light' : 'Starfield mode active · galaxy dark');
}

function updateThemeToggleIcon(isLight) {
    const iconContainer = document.getElementById('theme-icon');
    if (iconContainer) {
        iconContainer.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        if (window.lucide) lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 2. Mission Console Typing Effect
// --------------------------------------------------------------------------
function initTypingEffect() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const commands = [
        'booting agentic-ai core v2.0',
        'deploying llm workflows · kotlin stack',
        'scanning constellation of skills',
        'calibrating deep-space comm channel',
        'system nominal · standing by'
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
    if (handle) handle.textContent = `@${GITHUB_USERNAME}`;
}

// --------------------------------------------------------------------------
// 4. GitHub Repos Fetch & Galaxy Cards Renderer
// --------------------------------------------------------------------------
const LANG_COLORS = {
    'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5', 'Java': '#b07219',
    'Kotlin': '#a78bfa', 'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600', 'HTML': '#e34c26',
    'CSS': '#563d7c', 'Dart': '#00B4AB', 'Go': '#00ADD8', 'Rust': '#dea584'
};

function getLangColor(lang) {
    return LANG_COLORS[lang] || '#a78bfa';
}

function getRepoIcon(repo) {
    const lang = repo.language || '';
    const name = repo.name.toLowerCase();
    if (lang === 'Kotlin' || name.includes('android')) return 'smartphone';
    if (lang === 'Java' || lang === 'C++' || lang === 'C') return 'code-2';
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

let selectedRepo = null;

async function fetchRepos() {
    const ideContainer = document.getElementById('ide-container');
    const errorEl = document.getElementById('proj-error');
    const countEl = document.getElementById('repo-count');
    const heroRepos = document.getElementById('hero-repos');
    const heroStars = document.getElementById('hero-stars');

    if (!ideContainer) return;

    if (errorEl) errorEl.classList.add('hidden');
    ideContainer.classList.remove('hidden');
    showSkeletons();
    if (countEl) countEl.textContent = 'Scanning...';

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`);
        if (!res.ok) throw new Error('API Error: ' + res.status);
        const data = await res.json();

        allRepos = data.filter(r => !r.fork);

        if (heroRepos) heroRepos.textContent = allRepos.length + '+';
        const totalStars = allRepos.reduce((s, r) => s + r.stargazers_count, 0);
        if (heroStars) heroStars.textContent = totalStars;
        if (countEl) countEl.textContent = allRepos.length + ' repos';

        buildFilters();

        if (allRepos.length > 0) {
            selectedRepo = allRepos[0];
            renderIDEPane(allRepos);
        } else {
            renderEmptyIDE();
        }

    } catch (err) {
        console.error('GitHub API fetch error:', err);
        if (ideContainer) ideContainer.classList.add('hidden');
        if (errorEl) errorEl.classList.remove('hidden');
        if (countEl) countEl.textContent = 'Signal lost';
        if (heroRepos) heroRepos.textContent = '—';
        if (heroStars) heroStars.textContent = '—';
    }
}

function showSkeletons() {
    const listPane = document.getElementById('repo-list-pane');
    const inspectPane = document.getElementById('repo-inspector-pane');
    if (listPane) {
        listPane.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const div = document.createElement('div');
            div.className = 'p-3 rounded nebula-skeleton animate-pulse mb-2';
            div.innerHTML = `<div class="h-4 w-3/4 nebula-skeleton rounded"></div>`;
            listPane.appendChild(div);
        }
    }
    if (inspectPane) {
        inspectPane.innerHTML = `
            <div class="space-y-4 animate-pulse p-4">
                <div class="h-6 w-1/2 nebula-skeleton rounded"></div>
                <div class="h-4 w-full nebula-skeleton rounded"></div>
                <div class="h-4 w-3/4 nebula-skeleton rounded"></div>
            </div>`;
    }
}

function getRepoTopics(repo) {
    const topics = [];
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const allText = name + ' ' + desc;

    // 1. GitHub native topics (if the repo owner set them)
    if (repo.topics && repo.topics.length > 0) {
        repo.topics.slice(0, 3).forEach(t => topics.push(t));
    }

    // 2. Programming language (always show the actual language)
    if (repo.language) topics.push(repo.language);

    // 3. Framework / library detection from name + description
    const frameworks = [
        ['react', 'React'], ['next\.?js', 'Next.js'], ['vue', 'Vue.js'], ['angular', 'Angular'],
        ['svelte', 'Svelte'], ['node\.?js', 'Node.js'], ['express', 'Express'],
        ['django', 'Django'], ['flask', 'Flask'], ['fastapi', 'FastAPI'],
        ['spring', 'Spring Boot'], ['laravel', 'Laravel'], ['rails', 'Ruby on Rails'],
        ['flutter', 'Flutter'], ['dart', 'Dart'], ['swift', 'Swift'],
        ['tailwind', 'Tailwind CSS'], ['bootstrap', 'Bootstrap'],
        ['tensorflow', 'TensorFlow'], ['pytorch', 'PyTorch'], ['keras', 'Keras'],
        ['opencv', 'OpenCV'], ['pandas', 'Pandas'], ['numpy', 'NumPy'],
        ['llm', 'LLM'], ['gpt', 'GPT'], ['gemini', 'Gemini'],
        ['rag', 'RAG'], ['langchain', 'LangChain'],
        ['room db', 'Room DB'], ['jetpack', 'Jetpack'], ['compose', 'Jetpack Compose'],
        ['retrofit', 'Retrofit'], ['okhttp', 'OkHttp'],
        ['firebase', 'Firebase'], ['supabase', 'Supabase'],
        ['docker', 'Docker'], ['kubernetes', 'Kubernetes'], ['aws', 'AWS'],
        ['graphql', 'GraphQL'], ['rest api', 'REST API'], ['websocket', 'WebSocket'],
        ['sqlite', 'SQLite'], ['mongodb', 'MongoDB'], ['postgresql', 'PostgreSQL'], ['mysql', 'MySQL'],
        ['git', 'Git'], ['github actions', 'GitHub Actions'], ['cicd', 'CI/CD'],
        ['web scraping', 'Web Scraping'], ['beautifulsoup', 'BeautifulSoup'], ['selenium', 'Selenium'],
        ['tkinter', 'Tkinter'], ['pygame', 'Pygame'],
    ];

    // 4. Project type detection
    const projectTypes = [
        ['cli', 'CLI Tool'], ['command.?line', 'CLI Tool'],
        ['library', 'Library'], ['package', 'Package'], ['module', 'Module'],
        ['api', 'API'], ['server', 'Server'], ['backend', 'Backend'],
        ['frontend', 'Frontend'], ['web.?app', 'Web App'], ['website', 'Website'],
        ['mobile.?app', 'Mobile App'], ['android.?app', 'Android App'],
        ['game', 'Game'], ['bot', 'Bot'], ['automation', 'Automation'],
        ['portfolio', 'Portfolio'], ['blog', 'Blog'], ['dashboard', 'Dashboard'],
        ['chatbot', 'Chatbot'], ['extension', 'Extension'], ['plugin', 'Plugin'],
    ];

    // 5. Domain / topic detection
    const domains = [
        ['ai', 'Artificial Intelligence'], ['artificial.?intelligence', 'Artificial Intelligence'],
        ['machine.?learn', 'Machine Learning'], ['deep.?learn', 'Deep Learning'],
        ['neural.?net', 'Neural Network'], ['nlp', 'NLP'],
        ['agent', 'Agentic AI'], ['agentic', 'Agentic AI'],
        ['dsa', 'Data Structures & Algorithms'], ['algorithm', 'Algorithms'],
        ['data.?structure', 'Data Structures'],
        ['security', 'Security'], ['cybersecurity', 'Cybersecurity'],
        ['blockchain', 'Blockchain'], ['crypto', 'Cryptocurrency'],
        ['iot', 'IoT'], ['embedded', 'Embedded'],
        ['compiler', 'Compiler'], ['interpreter', 'Interpreter'],
        ['os', 'Operating Systems'], ['networking', 'Networking'],
        ['database', 'Database'], ['dbms', 'DBMS'],
        ['design.?pattern', 'Design Patterns'], ['oop', 'OOP'], ['architecture', 'Architecture'],
        ['testing', 'Testing'], ['unit.?test', 'Testing'],
        ['multithreading', 'Concurrency'], ['concurrency', 'Concurrency'],
    ];

    // Apply frameworks (check name + desc)
    for (const [pattern, label] of frameworks) {
        if (new RegExp(pattern).test(allText)) {
            if (!topics.includes(label)) topics.push(label);
        }
    }

    // Apply project type
    for (const [pattern, label] of projectTypes) {
        if (new RegExp(pattern).test(allText)) {
            if (!topics.includes(label)) topics.push(label);
        }
    }

    // Apply domain (only if no topics yet from frameworks/types)
    if (topics.length < 3) {
        for (const [pattern, label] of domains) {
            if (new RegExp(pattern).test(allText)) {
                if (!topics.includes(label)) topics.push(label);
            }
        }
    }

    // Final fallback: just show language + a short description snippet
    if (topics.length === 0) {
        if (repo.language) topics.push(repo.language);
        if (desc.length > 0) {
            const snippet = desc.length > 35 ? desc.substring(0, 35).trim() + '…' : desc;
            topics.push(snippet);
        }
    }

    return Array.from(new Set(topics)).slice(0, 4);
}

function buildFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;
    const langs = new Set();
    allRepos.forEach(r => { if (r.language) langs.add(r.language); });
    const langArr = Array.from(langs).sort();

    let html = `<button class="tech-pill active" onclick="filterProj('All',this)">ALL</button>`;
    langArr.forEach(l => {
        html += `<button class="tech-pill" onclick="filterProj('${l}',this)">${l}</button>`;
    });
    container.innerHTML = html;
}

function renderIDEPane(repos) {
    const listPane = document.getElementById('repo-list-pane');
    if (!listPane) return;

    if (repos.length === 0) {
        listPane.innerHTML = `<p class="text-xs font-mono text-slate-500 p-4">No repositories in this sector</p>`;
        renderEmptyIDE();
        return;
    }

    if (!repos.some(r => r.id === selectedRepo?.id)) {
        selectedRepo = repos[0];
    }

    let listHtml = '';
    repos.forEach(repo => {
        const isActive = selectedRepo && repo.id === selectedRepo.id;
        const icon = getRepoIcon(repo);

        listHtml += `
            <div onclick="selectRepo(${repo.id})" class="repo-item ${isActive ? 'active-repo' : ''}">
                <div class="flex items-center gap-2.5 min-w-0 pr-2">
                    <i data-lucide="${icon}" class="w-4 h-4 text-violet-400 flex-shrink-0"></i>
                    <span class="font-mono text-xs font-bold truncate">${repo.name}</span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0 text-[10px] font-mono">
                    <span class="text-fuchsia-400 font-semibold">★ ${repo.stargazers_count}</span>
                </div>
            </div>
        `;
    });

    listPane.innerHTML = listHtml;
    inspectRepo(selectedRepo);
}

function selectRepo(id) {
    const target = allRepos.find(r => r.id === id);
    if (target) {
        selectedRepo = target;
        const currentFiltered = currentFilter === 'All' ? allRepos : allRepos.filter(r => r.language === currentFilter);
        renderIDEPane(currentFiltered);
    }
}

function inspectRepo(repo) {
    const inspectPane = document.getElementById('repo-inspector-pane');
    if (!inspectPane || !repo) return;

    const lang = repo.language || 'Source Code';
    const icon = getRepoIcon(repo);
    const desc = repo.description || 'Developer software module repository hosted on GitHub.';
    const size = formatSize(repo.size);
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;
    const updated = timeAgo(repo.updated_at);
    const url = repo.html_url;
    const cloneUrl = `https://github.com/${GITHUB_USERNAME}/${repo.name}.git`;
    const topics = getRepoTopics(repo);

    inspectPane.innerHTML = `
        <div>
            <!-- Repository Inspector Bar -->
            <div class="flex items-center justify-between pb-4 mb-5 border-b border-violet-500/20 text-xs font-mono">
                <div class="flex items-center gap-2 text-violet-400 font-bold">
                    <i data-lucide="book" class="w-4 h-4"></i>
                    <span>Repository Inspector</span>
                </div>
                <span class="text-slate-400 text-[11px]">UPDATED: ${updated}</span>
            </div>

            <!-- Title & Language Badge -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-md">
                        <i data-lucide="${icon}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-mono text-slate-100">${repo.name}</h3>
                        <p class="text-xs font-mono text-slate-400">Owner: @${GITHUB_USERNAME}</p>
                    </div>
                </div>

                <span class="code-badge text-xs">
                    <span class="w-2 h-2 rounded-full bg-violet-400 inline-block mr-1"></span>
                    ${lang}
                </span>
            </div>

            <!-- Clone URL Copy Chip -->
            <div class="nebula-copy-chip mb-5">
                <i data-lucide="copy" class="w-3.5 h-3.5" style="color:var(--card-accent)"></i>
                <span class="truncate text-slate-300">git clone ${cloneUrl}</span>
                <button onclick="copyCloneCmd('${cloneUrl}', this)" class="nebula-copy-chip__btn">
                    COPY
                </button>
            </div>

            <!-- Project Description -->
            <div class="p-4 rounded nebula-pane border border-violet-500/10 mb-5">
                <p class="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">${desc}</p>
            </div>

            <!-- Topic Pills -->
            <div class="flex flex-wrap gap-2 mb-6">
                ${topics.map(t => `<span class="tech-pill text-xs">${t}</span>`).join('')}
            </div>
        </div>

        <div>
            <!-- Repository Telemetry & Metrics -->
            <div class="grid grid-cols-3 gap-3 p-3 rounded nebula-pane border border-violet-500/20 mb-6 text-center text-xs font-mono">
                <div>
                    <span class="text-fuchsia-400 font-bold text-sm block">★ ${stars}</span>
                    <span class="text-[10px] text-slate-400 uppercase">STARS</span>
                </div>
                <div>
                    <span class="text-violet-400 font-bold text-sm block">⑂ ${forks}</span>
                    <span class="text-[10px] text-slate-400 uppercase">FORKS</span>
                </div>
                <div>
                    <span class="text-cyan-400 font-bold text-sm block">${size}</span>
                    <span class="text-[10px] text-slate-400 uppercase">SIZE</span>
                </div>
            </div>

            <!-- Launch Button -->
            <a href="${url}" target="_blank" class="cosmic-btn w-full justify-center">
                <span>OPEN REPOSITORY</span>
                <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function renderEmptyIDE() {
    const inspectPane = document.getElementById('repo-inspector-pane');
    if (!inspectPane) return;
    inspectPane.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full py-12 text-slate-400 font-mono text-center">
            <i data-lucide="satellite" class="w-10 h-10 text-violet-400 mb-3 opacity-60"></i>
            <p class="text-sm font-bold text-slate-200">No repositories in this sector</p>
            <p class="text-xs text-slate-500 mt-1">Try scanning a different sector above.</p>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
}

function filterProj(cat, btn) {
    document.querySelectorAll('#filter-container .tech-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    const filtered = cat === 'All' ? allRepos : allRepos.filter(r => r.language === cat);
    renderIDEPane(filtered);
}

function copyCloneCmd(url, btn) {
    navigator.clipboard.writeText(`git clone ${url}`);
    const originalText = btn.textContent;
    btn.textContent = 'COPIED ✓';
    btn.classList.add('is-copied');
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('is-copied');
    }, 2000);
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
    submitBtn.innerHTML = '<span>Transmitting...</span>';
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            showToast('Signal: message delivered successfully 🚀');
            form.reset();
        } else {
            showToast('Signal lost: not delivered · retry.');
        }
    } catch (error) {
        showToast('Signal lost: network offline.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (window.lucide) lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 7. Galaxy Toast Notification
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

// --------------------------------------------------------------------------
// 8. Galaxy Command Palette (Ctrl + K)
// --------------------------------------------------------------------------
let activeCmdIndex = 0;
let filteredCmdsList = [];

const paletteCommands = [
    { label: '◈ home — Jump to Hero / Overview', action: () => scrollToId('home'), icon: 'rocket', tag: 'SECTION' },
    { label: '◈ about — View Bio, Focus & Checklist', action: () => scrollToId('about'), icon: 'user-check', tag: 'SECTION' },
    { label: '◈ skills — Open Technical Arsenal', action: () => scrollToId('skills'), icon: 'cpu', tag: 'SECTION' },
    { label: '◈ projects — Open GitHub Repositories IDE', action: () => scrollToId('projects'), icon: 'folder-git-2', tag: 'SECTION' },
    { label: '◈ journey — Open Academic Journey Timeline', action: () => scrollToId('education'), icon: 'graduation-cap', tag: 'SECTION' },
    { label: '◈ contact — Open Message Channel', action: () => scrollToId('contact'), icon: 'mail', tag: 'SECTION' },
    { label: '✦ toggle starfield mode', action: () => toggleTheme(), icon: 'sun', tag: 'ACTION' },
    { label: '✦ open github profile', action: () => window.open('https://github.com/ChinmayGawad', '_blank'), icon: 'github', tag: 'EXTERNAL' },
    { label: '✦ open linkedin profile', action: () => window.open('https://www.linkedin.com/in/chinmay-gawad-7b3172256/', '_blank'), icon: 'linkedin', tag: 'EXTERNAL' },
    { label: '✦ send direct email', action: () => window.location.href = 'mailto:chinmaygawad365@gmail.com', icon: 'send', tag: 'ACTION' },
];

function scrollToId(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openCmdPalette() {
    const modal = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-input');
    if (!modal || !input) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    input.value = '';
    activeCmdIndex = 0;
    filterCmds('');
    setTimeout(() => input.focus(), 50);
}

function closeCmdPalette() {
    const modal = document.getElementById('cmd-palette-backdrop');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function filterCmds(query) {
    const q = (query || '').toLowerCase().trim();
    filteredCmdsList = paletteCommands.filter(c => 
        !q || c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q)
    );
    activeCmdIndex = 0;
    renderCmdList();
}

function renderCmdList() {
    const listEl = document.getElementById('cmd-list');
    if (!listEl) return;

    if (filteredCmdsList.length === 0) {
        listEl.innerHTML = `<p class="text-xs font-mono text-slate-500 p-4">No matching command in this sector</p>`;
        return;
    }

    let html = '';
    filteredCmdsList.forEach((cmd, idx) => {
        const isSelected = idx === activeCmdIndex;
        html += `
            <div onclick="executeCmdIndex(${idx})" class="cmd-item ${isSelected ? 'selected' : ''}">
                <div class="flex items-center gap-2.5 min-w-0">
                    <i data-lucide="${cmd.icon}" class="w-4 h-4 text-violet-400 flex-shrink-0"></i>
                    <span class="truncate font-bold">${cmd.label}</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-mono">${cmd.tag}</span>
            </div>
        `;
    });

    listEl.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function executeCmdIndex(idx) {
    const cmd = filteredCmdsList[idx];
    if (cmd && typeof cmd.action === 'function') {
        closeCmdPalette();
        cmd.action();
    }
}

function handleCmdKeyDown(e) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCmdsList.length > 0) {
            activeCmdIndex = (activeCmdIndex + 1) % filteredCmdsList.length;
            renderCmdList();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCmdsList.length > 0) {
            activeCmdIndex = (activeCmdIndex - 1 + filteredCmdsList.length) % filteredCmdsList.length;
            renderCmdList();
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCmdIndex(activeCmdIndex);
    } else if (e.key === 'Escape') {
        closeCmdPalette();
    }
}

// Global hotkey listener (Ctrl+K or Cmd+K or '/')
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmdPalette();
    } else if (e.key === 'Escape') {
        closeCmdPalette();
    }
});
