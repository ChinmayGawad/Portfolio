// ==========================================================================
// MAIN APPLICATION LOGIC — LINEAR / APPLE DARK PORTFOLIO
// Chinmay Gawad Portfolio Redesign
// ==========================================================================

const GITHUB_USERNAME = 'ChinmayGawad';
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_REPOS_URL = `https://github.com/${GITHUB_USERNAME}?tab=repositories`;

let allRepos = [];
let currentFilter = 'All';
let selectedRepo = null;

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initTypingEffect();
    initActiveNav();
    fetchRepos();
    initKeyboardShortcuts();

    if (window.lucide) {
        lucide.createIcons();
    }
});

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// 1. Custom Dot & Ring Cursor with Interactive Click Mechanics
// --------------------------------------------------------------------------
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const interactiveSelector = 'a, button, input, textarea, .glass-card, .tech-tag, .repo-item';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            document.body.classList.add('hovering-interactive');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            document.body.classList.remove('hovering-interactive');
        }
    });

    // MOUSE CLICK LISTENERS FOR VISUAL FEEDBACK & COSMIC SHOCKWAVE
    window.addEventListener('mousedown', () => {
        document.body.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
        document.body.classList.remove('clicking');
    });

    window.addEventListener('click', (e) => {
        createClickRipple(e.clientX, e.clientY);
        if (window.cosmicEngineInstance && typeof window.cosmicEngineInstance.triggerClickShockwave === 'function') {
            window.cosmicEngineInstance.triggerClickShockwave(e.clientX, e.clientY);
        }
    });
}

function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// --------------------------------------------------------------------------
// 2. Typing Console Effect
// --------------------------------------------------------------------------
function initTypingEffect() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const commands = [
        'booting agentic-ai core v2.0',
        'building native android apps · kotlin & mvvm',
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
            typeSpeed = 2000;
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
// 3. Navigation & Section Scrolling
// --------------------------------------------------------------------------
function navTo(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 220;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

// --------------------------------------------------------------------------
// 4. GitHub API Repositories Explorer
// --------------------------------------------------------------------------
async function fetchRepos() {
    const listPane = document.getElementById('repo-list-pane');
    const countEl = document.getElementById('repo-count');
    const aboutRepos = document.getElementById('about-repos');

    if (!listPane) return;

    if (countEl) countEl.textContent = 'Scanning...';

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`);
        if (!res.ok) throw new Error('API Error: ' + res.status);
        const data = await res.json();

        allRepos = data.filter(r => !r.fork);

        if (countEl) countEl.textContent = `${allRepos.length} repos`;
        if (aboutRepos) aboutRepos.textContent = `${allRepos.length}+`;

        buildFilters();

        if (allRepos.length > 0) {
            selectedRepo = allRepos[0];
            renderIDEPane(allRepos);
        }

    } catch (err) {
        console.error('GitHub API error:', err);
        if (countEl) countEl.textContent = 'Signal lost';

        allRepos = [
            { id: 1, name: 'Student Room Sharing App', description: 'Android application in Kotlin with MVVM and Room DB for room sharing and expense allocation.', language: 'Kotlin', stargazers_count: 5, forks_count: 2, size: 1420, updated_at: new Date().toISOString(), html_url: GITHUB_REPOS_URL },
            { id: 2, name: 'Nutrivision AI', description: 'Agentic AI vision app analyzing food meals, nutrients, and LLM dietary recommendations.', language: 'Python', stargazers_count: 8, forks_count: 3, size: 3200, updated_at: new Date().toISOString(), html_url: GITHUB_REPOS_URL },
            { id: 3, name: 'Password Strength Analyzer', description: 'Security utility examining password entropy, dictionary leaks, and strength metrics.', language: 'Java', stargazers_count: 4, forks_count: 1, size: 850, updated_at: new Date().toISOString(), html_url: GITHUB_REPOS_URL },
            { id: 4, name: 'Travel Expense Splitter', description: 'Kotlin mobile tool for trip group bill splitting and offline ledger calculation.', language: 'Kotlin', stargazers_count: 3, forks_count: 1, size: 1100, updated_at: new Date().toISOString(), html_url: GITHUB_REPOS_URL }
        ];

        buildFilters();
        selectedRepo = allRepos[0];
        renderIDEPane(allRepos);
    }
}

function buildFilters() {
    const container = document.getElementById('filter-container');
    if (!container) return;

    const langs = new Set();
    allRepos.forEach(r => { if (r.language) langs.add(r.language); });
    const langArr = Array.from(langs).sort();

    let html = `<button class="tech-tag active" onclick="filterProj('All', this)">ALL</button>`;
    langArr.forEach(l => {
        html += `<button class="tech-tag" onclick="filterProj('${l}', this)">${l}</button>`;
    });
    container.innerHTML = html;
}

function filterProj(cat, btn) {
    document.querySelectorAll('#filter-container .tech-tag').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = cat;
    const filtered = cat === 'All' ? allRepos : allRepos.filter(r => r.language === cat);
    renderIDEPane(filtered);
}

function renderIDEPane(repos) {
    const listPane = document.getElementById('repo-list-pane');
    if (!listPane) return;

    if (repos.length === 0) {
        listPane.innerHTML = `<p class="text-xs font-mono text-slate-400 p-4">No repositories found in this sector</p>`;
        return;
    }

    if (!repos.some(r => r.id === selectedRepo?.id)) {
        selectedRepo = repos[0];
    }

    let html = '';
    repos.forEach(repo => {
        const isActive = selectedRepo && repo.id === selectedRepo.id;

        html += `
            <div onclick="selectRepo(${repo.id})" class="repo-item ${isActive ? 'active-repo' : ''}">
                <div class="flex items-center gap-2.5 min-w-0 pr-2">
                    <i data-lucide="${repo.language === 'Kotlin' ? 'smartphone' : 'code-2'}" class="w-4 h-4 text-purple-400 flex-shrink-0"></i>
                    <span class="font-mono text-xs font-bold truncate text-white">${repo.name}</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-mono text-purple-400 font-bold">
                    <span>★ ${repo.stargazers_count}</span>
                </div>
            </div>
        `;
    });

    listPane.innerHTML = html;
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
    const desc = repo.description || 'Developer software repository hosted on GitHub.';
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;
    const url = repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`;
    const cloneUrl = `https://github.com/${GITHUB_USERNAME}/${repo.name}.git`;

    inspectPane.innerHTML = `
        <div>
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono">
                <span class="text-purple-400 font-bold">REPOSITORIES // INSPECTOR</span>
                <span class="text-slate-300 font-bold">${lang}</span>
            </div>

            <h3 class="text-2xl font-bold font-mono text-white mb-2">${repo.name}</h3>
            <p class="text-sm font-normal text-slate-200 leading-relaxed mb-6">${desc}</p>

            <div class="p-3.5 rounded-xl bg-black/80 border border-white/15 font-mono text-xs text-slate-200 flex items-center justify-between gap-2 mb-6">
                <span class="truncate">git clone ${cloneUrl}</span>
                <button onclick="copyCloneCmd('${cloneUrl}', this)" class="text-xs text-purple-400 font-bold hover:text-purple-300">COPY</button>
            </div>
        </div>

        <div class="space-y-4">
            <div class="grid grid-cols-3 gap-3 text-center font-mono text-xs p-3.5 rounded-xl bg-black/60 border border-white/15">
                <div>
                    <span class="text-purple-400 font-extrabold text-sm block">★ ${stars}</span>
                    <span class="text-[10px] text-slate-300 font-bold uppercase">STARS</span>
                </div>
                <div>
                    <span class="text-cyan-400 font-extrabold text-sm block">⑂ ${forks}</span>
                    <span class="text-[10px] text-slate-300 font-bold uppercase">FORKS</span>
                </div>
                <div>
                    <span class="text-emerald-400 font-extrabold text-sm block">${repo.size ? repo.size + ' KB' : 'ACTIVE'}</span>
                    <span class="text-[10px] text-slate-300 font-bold uppercase">SIZE</span>
                </div>
            </div>

            <div class="flex gap-3">
                <a href="${url}" target="_blank" class="glass-btn primary w-full justify-center">
                    <span>OPEN ON GITHUB</span>
                    <i data-lucide="external-link" class="w-4 h-4"></i>
                </a>
                <button onclick="openProjectModal(${repo.id})" class="glass-btn justify-center">
                    <i data-lucide="maximize-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `;

    if (window.lucide) lucide.createIcons();
}

function copyCloneCmd(url, btn) {
    navigator.clipboard.writeText(`git clone ${url}`);
    const originalText = btn.textContent;
    btn.textContent = 'COPIED ✓';
    setTimeout(() => { btn.textContent = originalText; }, 2000);
}

// --------------------------------------------------------------------------
// 5. Fullscreen Project Detail Overlay Modal
// --------------------------------------------------------------------------
function openProjectModal(repoId) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const repo = allRepos.find(r => r.id === repoId) || selectedRepo;
    if (!repo) return;

    document.getElementById('modal-title').textContent = repo.name;
    document.getElementById('modal-desc').textContent = repo.description || 'Developer project repository hosted on GitHub.';
    document.getElementById('modal-category').textContent = repo.language || 'PROJECT';
    document.getElementById('modal-github').href = repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`;

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = `
        <span class="tech-tag active">${repo.language || 'Code'}</span>
        <span class="tech-tag">★ ${repo.stargazers_count} Stars</span>
        <span class="tech-tag">⑂ ${repo.forks_count} Forks</span>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0', 'pointer-events-none');
    }, 10);
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// --------------------------------------------------------------------------
// 6. Web3Forms Contact Form Handler
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
            showToast('Signal transmitted successfully 🚀');
            form.reset();
        } else {
            showToast('Transmission error · try again.');
        }
    } catch (error) {
        showToast('Signal offline.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        if (window.lucide) lucide.createIcons();
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3500);
}

// --------------------------------------------------------------------------
// 7. Command Palette Modal (Ctrl + K)
// --------------------------------------------------------------------------
function initKeyboardShortcuts() {
    // Disable default right-click context menu and trigger cosmic click shockwave instead
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        createClickRipple(e.clientX, e.clientY);
        if (window.cosmicEngineInstance && typeof window.cosmicEngineInstance.triggerClickShockwave === 'function') {
            window.cosmicEngineInstance.triggerClickShockwave(e.clientX, e.clientY);
        }
    });

    window.addEventListener('keydown', (e) => {
        // Disable F12 and Inspect Developer Tool shortcuts
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
        ) {
            e.preventDefault();
            return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCmdPalette();
        } else if (e.key === 'Escape') {
            closeCmdPalette();
            closeProjectModal();
        }
    });
}

function openCmdPalette() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    if (!backdrop) return;
    backdrop.classList.remove('hidden');
    backdrop.classList.add('flex');
    populateCmdList('');
    const input = document.getElementById('cmd-input');
    if (input) {
        input.value = '';
        input.focus();
    }
}

function closeCmdPalette() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    if (!backdrop) return;
    backdrop.classList.add('hidden');
    backdrop.classList.remove('flex');
}

function populateCmdList(query) {
    const list = document.getElementById('cmd-list');
    if (!list) return;

    const commands = [
        { name: 'Jump to Home', action: () => navTo('home'), icon: 'rocket' },
        { name: 'Jump to About', action: () => navTo('about'), icon: 'user' },
        { name: 'Jump to Skills', action: () => navTo('skills'), icon: 'cpu' },
        { name: 'Jump to Projects', action: () => navTo('projects'), icon: 'folder' },
        { name: 'Jump to Academic Journey', action: () => navTo('education'), icon: 'graduation-cap' },
        { name: 'Jump to Contact', action: () => navTo('contact'), icon: 'mail' },
        { name: 'Open Resume PDF', action: () => window.open('pics/Chinmay Gawad Resmue.pdf', '_blank'), icon: 'file-text' },
        { name: 'Open GitHub Profile', action: () => window.open(GITHUB_PROFILE_URL, '_blank'), icon: 'github' },
        { name: 'Open LinkedIn Profile', action: () => window.open('https://www.linkedin.com/in/chinmay-gawad-7b3172256/', '_blank'), icon: 'linkedin' }
    ];

    const filtered = query ? commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : commands;

    let html = '';
    filtered.forEach(c => {
        html += `
            <div onclick="executeCmd('${c.name}')" class="p-2.5 rounded-lg hover:bg-white/10 cursor-pointer flex items-center justify-between text-white font-bold">
                <span class="flex items-center gap-2">
                    <i data-lucide="${c.icon}" class="w-4 h-4 text-purple-400"></i>
                    ${c.name}
                </span>
                <span class="text-[10px] text-slate-400">SECTOR</span>
            </div>
        `;
    });

    list.innerHTML = html;
    if (window.lucide) lucide.createIcons();
}

function filterCmds(val) {
    populateCmdList(val);
}

function executeCmd(name) {
    closeCmdPalette();
    if (name.includes('Home')) navTo('home');
    else if (name.includes('About')) navTo('about');
    else if (name.includes('Skills')) navTo('skills');
    else if (name.includes('Projects')) navTo('projects');
    else if (name.includes('Journey')) navTo('education');
    else if (name.includes('Contact')) navTo('contact');
    else if (name.includes('Resume')) window.open('pics/Chinmay Gawad Resmue.pdf', '_blank');
    else if (name.includes('GitHub')) window.open(GITHUB_PROFILE_URL, '_blank');
    else if (name.includes('LinkedIn')) window.open('https://www.linkedin.com/in/chinmay-gawad-7b3172256/', '_blank');
}
