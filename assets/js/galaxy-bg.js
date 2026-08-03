// ══════════════════════════════════════════════════════════════════════════════
// GALAXY SUPERNOVA BURST (REALISTIC):
// STAR BUILD-UP → WHITE-HOT FLASH (FULL-SCREEN EXPOSURE WASH) → FIREBALL DISC →
// BROKEN FILAMENTARY SHOCK FRONT + RAYLEIGH-TAYLOR FINGERS →
// DENSE CLUMPY EJECTA (COOLING DEBRIS) → PULSING REMNANT CORE WITH WISPS
// ══════════════════════════════════════════════════════════════════════════════
// Visual features:
//   • Full-screen exponential exposure wash + dimmer double pulse
//   • Blackbody-cooling fireball disc with boiling surface spots
//   • Clumpy ejecta with per-clump cohesion, power-law speeds & sizes
//   • Broken filamentary shock front, RT fingers, phase-shifted echo ring
//   • Screen shake, anamorphic streak, lens-flare ghosts
//   • Ambient star illumination from the blast
// Performance:
//   • DPR capped at 2, pooled particles (no per-frame allocation)
//   • 'lighter' composite for ALL glow passes, no shadowBlur
//   • Mobile particle budget at ~40%, max 2 concurrent events, ≤1600 particles
// ══════════════════════════════════════════════════════════════════════════════

(function () {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // ── Tunables ──────────────────────────────────────────────────────────────
    const BUILD_LEN = 55;          // frames of stellar build-up before detonation
    const EVENT_LIFE = 340;        // frames of expansion (~5.7 s)
    const FIREBALL_RISE = 28;      // frames for the fireball to reach max radius
    const FIREBALL_HOLD = 20;      // frames held at peak brightness
    const FIREBALL_FADE = 24;      // frames to fade the disc away
    const MAX_CONCURRENT = 2;      // simultaneous supernova events
    const MAX_TOTAL_PARTICLES = 1600; // global ejecta particle pool ceiling

    // Cap DPR at 2 for performance; the transform keeps all drawing math in CSS
    // pixels while the backing store renders at higher resolution.
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Touch devices get a reduced particle budget (≈40% of desktop).
    const isMobile = navigator.maxTouchPoints > 0;
    const EVENT_PARTICLES = isMobile ? 240 : 640;

    // ── Global visual state ───────────────────────────────────────────────────
    let width = 0;
    let height = 0;
    let stars = [];
    let supernovae = [];

    // Exposure wash (full-screen camera blowout) — decays ×0.88 per frame.
    let sceneFlash = 0;

    // Screen shake — a decaying random translation for a few frames.
    let shakeFrames = 0;
    let shakeAmp = 0;
    let shakeMax = 1;

    // ── Ambient star palette (white + nebula accents) ─────────────────────────
    const starPaletteDark = ['255, 255, 255', '167, 139, 250', '232, 121, 249', '34, 211, 238', '253, 224, 71'];
    const starPaletteLight = ['75, 85, 140', '124, 58, 237', '192, 38, 211', '8, 145, 178', '146, 110, 30'];

    // ── Color ramps ───────────────────────────────────────────────────────────
    // Fireball blackbody cooling: white → pale blue-white → white → pale yellow
    // → gold → orange → deep red.
    const FIREBALL_RAMP = [
        [255, 255, 255],
        [215, 235, 255],
        [255, 255, 255],
        [255, 244, 214],
        [255, 212, 128],
        [255, 150, 70],
        [200, 60, 40]
    ];
    // Ejecta debris cooling: white → pale violet → violet → magenta → gold →
    // orange → ember.
    const EJECTA_RAMP = [
        [255, 255, 255],
        [215, 190, 255],
        [167, 139, 250],
        [232, 121, 249],
        [253, 224, 71],
        [251, 146, 60],
        [180, 70, 40]
    ];

    // ── Mouse parallax state for the ambient stars ────────────────────────────
    const mouse = { x: width / 2, y: height / 2, active: false };
    let parallaxX = 0;
    let parallaxY = 0;
    let targetPX = 0;
    let targetPY = 0;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Click: ignite a supernova right at the cursor (scaled up for extra drama).
    window.addEventListener('click', (e) => {
        spawnSupernova(e.clientX, e.clientY, 1.9);
    });

    // ── Math helpers ──────────────────────────────────────────────────────────
    function clamp01(v) {
        return v < 0 ? 0 : v > 1 ? 1 : v;
    }
    function easeOutCubic(t) {
        const u = 1 - t;
        return 1 - u * u * u;
    }
    // Eased multi-stop color ramp: t is smoothstepped so the interpolation eases
    // between stops instead of snapping linearly through them.
    function colorRamp(t, stops) {
        const ct = clamp01(t);
        const f = ct * ct * (3 - 2 * ct) * (stops.length - 1);
        const i = Math.floor(f);
        const j = Math.min(i + 1, stops.length - 1);
        const frac = f - i;
        const a = stops[i];
        const b = stops[j];
        return [
            Math.round(a[0] + (b[0] - a[0]) * frac),
            Math.round(a[1] + (b[1] - a[1]) * frac),
            Math.round(a[2] + (b[2] - a[2]) * frac)
        ];
    }

    // ── Particle pooling (no per-frame allocation) ────────────────────────────
    const particleObjects = [];
    const freeParticles = [];

    function acquireParticle() {
        if (freeParticles.length) return freeParticles.pop();
        if (particleObjects.length < MAX_TOTAL_PARTICLES) {
            const p = { active: false };
            particleObjects.push(p);
            return p;
        }
        return null; // pool exhausted — caller skips the particle
    }
    function releaseParticle(p) {
        p.active = false;
        freeParticles.push(p);
    }

    // ── Ambient star layer (kept from the original; works well) ───────────────
    class Star {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = 0.4 + Math.random() * 1.2;
            this.depth = 0.3 + Math.random() * 0.7;
            this.twinkleSpeed = 0.008 + Math.random() * 0.03;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.baseAlpha = 0.3 + Math.random() * 0.5;
            this.vx = (Math.random() - 0.5) * 0.05;
            this.vy = (Math.random() - 0.5) * 0.05;
            this.big = Math.random() < 0.1;
            if (this.big) this.radius += 0.6;
            const idx = Math.floor(Math.random() * starPaletteDark.length);
            this.rgbDark = starPaletteDark[idx];
            this.rgbLight = starPaletteLight[idx];
        }
    }

    function initElements() {
        stars = [];
        const count = Math.min(Math.floor((width * height) / 12000), isMobile ? 110 : 170);
        for (let i = 0; i < count; i++) stars.push(new Star());
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.max(1, Math.floor(width * DPR));
        canvas.height = Math.max(1, Math.floor(height * DPR));
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        mouse.x = width / 2;
        mouse.y = height / 2;
        initElements();
    }

    window.addEventListener('resize', resize);
    resize();

    function drawStars(isLight) {
        // A detonation lights up the whole sky: every star gets brighter.
        const illum = 1 + sceneFlash * 0.3;
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.twinklePhase += s.twinkleSpeed;
            const twinkle = 0.5 + Math.sin(s.twinklePhase) * 0.5;
            let alpha = s.baseAlpha * (0.45 + twinkle * 0.55) * illum;
            if (isLight) alpha *= 0.6;
            const rgb = isLight ? s.rgbLight : s.rgbDark;

            s.x += s.vx + parallaxX * s.depth * 0.4;
            s.y += s.vy + parallaxY * s.depth * 0.4;
            if (s.x < -4) s.x = width + 4;
            else if (s.x > width + 4) s.x = -4;
            if (s.y < -4) s.y = height + 4;
            else if (s.y > height + 4) s.y = -4;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.fill();

            if (s.big) {
                // Wide soft halo for the few bright stars (additive glow pass).
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 2.6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.12})`;
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    }

    // ── Supernova construction ────────────────────────────────────────────────
    function spawnSupernova(cx, cy, scale) {
        // Enforce the concurrent-event cap by retiring the oldest remnant.
        if (supernovae.length >= MAX_CONCURRENT) {
            destroySupernova(supernovae.shift());
        }

        const sn = {
            x: cx,
            y: cy,
            scale,
            phase: 'build',
            build: BUILD_LEN,
            age: 0,
            life: EVENT_LIFE,
            flash: 0,              // per-event local bloom
            pulseCountdown: 0,     // frames until the dimmer second pulse
            core: 1,
            clumps: [],
            fireball: null,
            shock: null,
            flare: [],
            buildMotes: [],
            wisps: []
        };

        // Boiling surface motes seen during the last moments of build-up.
        for (let i = 0; i < 9; i++) {
            sn.buildMotes.push({
                ang: Math.random() * Math.PI * 2,
                dist: 0.75 + Math.random() * 0.5,
                speed: 0.02 + Math.random() * 0.05,
                size: (0.8 + Math.random() * 1.6) * scale
            });
        }

        // Spiraling wisps around the remnant core.
        for (let i = 0; i < 3; i++) {
            sn.wisps.push({
                ang: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03,
                len: (10 + Math.random() * 14) * scale,
                width: (0.7 + Math.random() * 0.9) * scale
            });
        }

        // Lens-flare ghosts spaced along the burst → screen-center line.
        const fdx = width / 2 - cx;
        const fdy = height / 2 - cy;
        const fdist = Math.hypot(fdx, fdy) || 1;
        const fux = fdx / fdist;
        const fuy = fdy / fdist;
        const flareFracs = [0.3, 0.55, 0.78, 1.0];
        const flareRgb = ['255, 255, 255', '190, 225, 255', '230, 200, 255', '255, 255, 255'];
        for (let i = 0; i < 4; i++) {
            sn.flare.push({
                x: cx + fux * fdist * flareFracs[i],
                y: cy + fuy * fdist * flareFracs[i],
                r: (16 - i * 3.5) * scale,
                rgb: flareRgb[i]
            });
        }

        // ── Dense clumpy ejecta ──
        // The shell front expands to ≈178 px × scale over EVENT_LIFE frames.
        const shellV = (170 * scale) / EVENT_LIFE;
        const clumpCount = 12 + Math.floor(Math.random() * 7);   // 12-18 clumps
        let budget = Math.round(EVENT_PARTICLES * (0.9 + Math.random() * 0.2));

        for (let c = 0; c < clumpCount && budget > 0; c++) {
            const biasAngle = Math.random() * Math.PI * 2;
            // Clump bulk velocity sits in the slow tier so clumps persist.
            const biasSpeed = 0.35 + Math.random() * 0.3;
            const count = Math.min(55, Math.max(15, Math.round(budget / (clumpCount - c))));
            budget -= count;

            const cl = {
                cx, cy,
                vx: Math.cos(biasAngle) * shellV * biasSpeed,
                vy: Math.sin(biasAngle) * shellV * biasSpeed,
                angle: Math.random() * Math.PI * 2,
                angularDrift: (Math.random() - 0.5) * 0.004, // slow spin
                orbitR: (4 + Math.random() * 8) * scale,     // anchor orbit radius
                cohesion: 0.012 + Math.random() * 0.02,      // pull toward anchor
                hueOffset: (Math.random() - 0.5) * 0.35,     // per-clump color shift
                particles: []
            };
            sn.clumps.push(cl);

            for (let i = 0; i < count; i++) {
                const p = acquireParticle();
                if (!p) { budget = 0; break; }

                // Power-law speed tiers: slow bulk / fast / hyper-velocity.
                const r = Math.random();
                let speedMul;
                let life;
                if (r < 0.65) {
                    speedMul = 0.4 + Math.random() * 0.3;      // 60-70% slow
                    life = 240 + Math.random() * 210;          // 240-450 frames
                } else if (r < 0.88) {
                    speedMul = 1.2 + Math.random() * 0.8;      // 20-25% fast
                    life = 80 + Math.random() * 70;            // 80-150 frames
                } else {
                    speedMul = 2.5 + Math.random() * 0.5;      // 5-10% hyper
                    life = 60 + Math.random() * 60;            // short, streaky
                }
                const speed = shellV * speedMul * (0.85 + Math.random() * 0.3);
                const angle = biasAngle + (Math.random() - 0.5) * 1.1;

                // Power-law sizes: few big bright chunks + many fine motes.
                const sr = Math.random();
                let size;
                if (sr < 0.08) size = (3 + Math.random() * 2) * scale;         // chunks
                else if (sr < 0.3) size = (1.1 + Math.random() * 1.4) * scale; // mid
                else size = (0.3 + Math.random() * 0.5) * scale;               // motes

                p.active = true;
                p.x = cx;
                p.y = cy;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.size = size;
                p.streak = speedMul > 1.2 || size >= 2.5; // fast or big → streak
                p.age = 0;
                p.life = life;
                cl.particles.push(p);
            }
        }

        supernovae.push(sn);
    }

    // Return a retired event's particles to the pool.
    function destroySupernova(sn) {
        for (let c = 0; c < sn.clumps.length; c++) {
            const arr = sn.clumps[c].particles;
            for (let i = 0; i < arr.length; i++) releaseParticle(arr[i]);
            arr.length = 0;
        }
        sn.clumps.length = 0;
    }

    // ── Detonation: switch from build-up to expansion, kick global effects ────
    function detonate(sn) {
        sn.phase = 'explode';
        sn.age = 0;
        sn.flash = 0.65;
        sn.pulseCountdown = 6 + Math.floor(Math.random() * 5); // 6-10 frames later

        sceneFlash = Math.max(sceneFlash, 0.6);              // full-screen exposure wash (toned down)
        shakeFrames = 12 + Math.floor(Math.random() * 4);  // 12-15 frames
        shakeAmp = 2 + Math.random() * 2;                  // 2-4 px
        shakeMax = shakeFrames;

        sn.shock = buildShock(sn);
        sn.fireball = buildFireball(sn);
    }

    // ── Shock-front geometry (precomputed; only noise evolves per frame) ──────
    function buildShock(sn) {
        const scale = sn.scale;
        const arcs = [];
        const arcCount = 12 + Math.floor(Math.random() * 7); // 12-18 broken arcs
        let a = Math.random() * Math.PI * 2;
        for (let i = 0; i < arcCount; i++) {
            const arcLen = 0.52 + Math.random() * 0.87;         // 30-80°
            const gap = 0.05 + Math.random() * 0.45;            // random gap
            const nPoints = 6 + Math.floor(Math.random() * 7);  // 6-12 noisy points
            const phases = new Float32Array(nPoints + 1);
            for (let k = 0; k <= nPoints; k++) phases[k] = Math.random() * Math.PI * 2;
            arcs.push({
                a0: a,
                a1: a + arcLen,
                rMul: 0.88 + Math.random() * 0.24,       // ±12% radial offset
                thickness: (1.5 + Math.random() * 2.5) * scale,
                alpha: 0.2 + Math.random() * 0.6,
                nPoints,
                phases
            });
            a += arcLen + gap;
        }

        // Rayleigh-Taylor fingers: thin spikes protruding past the front.
        const fingers = [];
        const fingerCount = 8 + Math.floor(Math.random() * 5); // 8-12
        for (let i = 0; i < fingerCount; i++) {
            fingers.push({
                angle: Math.random() * Math.PI * 2,
                len: 0.10 + Math.random() * 0.15,              // 10-25% of radius
                width: (1.2 + Math.random() * 1.6) * scale
            });
        }

        // Echo ring noise phases (phase-shifted from the main filaments).
        const echoPhases = new Float32Array(64);
        for (let i = 0; i < 64; i++) echoPhases[i] = Math.random() * Math.PI * 2;

        return { arcs, fingers, echoPhases };
    }

    // ── Fireball disc state ───────────────────────────────────────────────────
    function buildFireball(sn) {
        const boil = [];
        const boilCount = 3 + Math.floor(Math.random() * 2); // 3-4 boil spots
        for (let i = 0; i < boilCount; i++) {
            boil.push({
                ang: Math.random() * Math.PI * 2,
                dist: 0.15 + Math.random() * 0.4,
                speed: (0.003 + Math.random() * 0.007) * (Math.random() < 0.5 ? -1 : 1),
                size: 0.5 + Math.random() * 0.7
            });
        }
        return { t: 0, hold: 0, fade: 0, done: false, maxR: 90 * sn.scale, boil };
    }

    // ── Phase 1: stellar build-up (ease-out cubic + spike + boiling motes) ────
    function drawBuild(sn, dim) {
        sn.build -= 1;
        const bf = BUILD_LEN - sn.build;      // frames elapsed 0 → BUILD_LEN
        const progress = bf / BUILD_LEN;
        const b = easeOutCubic(progress);     // eased brightness ramp
        const spike = sn.build <= 10 ? (10 - sn.build) / 10 : 0; // last 10 frames
        const pulse = 0.75 + 0.25 * Math.sin(sn.build * 0.35);
        const coreR = (1.5 + b * 3) * sn.scale * (pulse + spike * 0.5);
        const haloR = coreR * (5 + b * 7 + spike * 8);
        const glow = Math.min(1, (b * 0.45 + spike * 0.5) * dim);
        const boost = 1 + spike * 1.4;        // rapid spike

        // Blue-shift toward white-blue during the final spike.
        const r = Math.round(255 * (1 - spike * 0.15));
        const g = Math.round(240 + spike * 15);
        const blue = 255;

        ctx.globalCompositeOperation = 'lighter';
        const halo = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, haloR);
        halo.addColorStop(0, `rgba(${r}, ${g}, ${blue}, ${Math.min(1, glow * boost)})`);
        halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sn.x, sn.y, Math.max(0.6, coreR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${blue}, ${Math.min(1, (0.7 + b * 0.3) * dim * boost)})`;
        ctx.fill();

        // Boiling surface motes — small bright cells churning on the star.
        for (let i = 0; i < sn.buildMotes.length; i++) {
            const m = sn.buildMotes[i];
            const ma = m.ang + sn.build * m.speed;
            const mr = coreR * m.dist;
            ctx.beginPath();
            ctx.arc(sn.x + Math.cos(ma) * mr, sn.y + Math.sin(ma) * mr, m.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 235, ${(0.5 + spike * 0.5) * dim})`;
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        if (sn.build <= 0) detonate(sn);
    }

    // ── Phase 2a: white-hot flash bloom + anamorphic streak + lens flare ──────
    function drawFlash(sn, dim) {
        const f = sn.flash;
        const fr = (30 + (1 - f) * 130) * sn.scale;
        const fa = f * 0.6 * dim;

        ctx.globalCompositeOperation = 'lighter';

        // Radial bloom.
        const bloom = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, fr);
        bloom.addColorStop(0, `rgba(255, 255, 255, ${fa})`);
        bloom.addColorStop(0.55, `rgba(210, 225, 255, ${fa * 0.25})`);
        bloom.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, fr, 0, Math.PI * 2);
        ctx.fill();

        // Anamorphic horizontal streak (wide, thin, additive).
        const sw = fr * 2.4;
        const sh = Math.max(2, fr * 0.16);
        const sg = ctx.createLinearGradient(sn.x - sw / 2, 0, sn.x + sw / 2, 0);
        sg.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sg.addColorStop(0.5, `rgba(255, 255, 255, ${fa * 0.3})`);
        sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sg;
        ctx.fillRect(sn.x - sw / 2, sn.y - sh / 2, sw, sh);

        // Lens-flare ghost circles along the burst → screen-center line.
        for (let i = 0; i < sn.flare.length; i++) {
            const lf = sn.flare[i];
            const lr = lf.r * (1 + f * 2);
            const lg = ctx.createRadialGradient(lf.x, lf.y, 0, lf.x, lf.y, lr);
            lg.addColorStop(0, `rgba(${lf.rgb}, ${fa * 0.2})`);
            lg.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = lg;
            ctx.beginPath();
            ctx.arc(lf.x, lf.y, lr, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2b: fireball disc with blackbody cooling + boil spots ───────────
    function updateAndDrawFireball(sn, dim) {
        const fb = sn.fireball;
        if (!fb || fb.done) return;

        if (fb.fade >= FIREBALL_FADE) fb.done = true;
        else if (fb.hold >= FIREBALL_HOLD) fb.fade += 1;
        else if (fb.t < 1) fb.t = Math.min(1, fb.t + 1 / FIREBALL_RISE);
        else fb.hold += 1;

        // Radius grows with a decelerating curve.
        const R = Math.max(1, fb.maxR * (1 - Math.pow(1 - fb.t, 0.7)));

        let alpha;
        if (fb.t < 1) alpha = easeOutCubic(fb.t) * 0.6 * dim;
        else if (fb.fade === 0) alpha = 0.6 * dim;
        else alpha = 0.6 * dim * (1 - fb.fade / FIREBALL_FADE);
        if (alpha <= 0.01) { fb.done = true; return; }

        // Cooling color progresses through the blackbody ramp.
        const cool = clamp01(fb.t * 0.5 + fb.hold * 0.012 + fb.fade * 0.028);
        const rgb = colorRamp(cool, FIREBALL_RAMP);

        ctx.globalCompositeOperation = 'lighter';

        // Solid center → transparent edge.
        const g = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, R);
        g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`);
        g.addColorStop(0.55, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.85})`);
        g.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, R, 0, Math.PI * 2);
        ctx.fill();

        // Bright boil spots that orbit slowly across the disc.
        for (let i = 0; i < fb.boil.length; i++) {
            const b = fb.boil[i];
            const ba = b.ang + sn.age * b.speed;
            const bx = sn.x + Math.cos(ba) * R * b.dist;
            const by = sn.y + Math.sin(ba) * R * b.dist;
            const bR = Math.max(2, R * 0.14 * b.size);
            const bg = ctx.createRadialGradient(bx, by, 0, bx, by, bR);
            bg.addColorStop(0, `rgba(255, 250, 235, ${alpha * 0.9})`);
            bg.addColorStop(1, 'rgba(255, 250, 235, 0)');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.arc(bx, by, bR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2c: broken filamentary shock front ──────────────────────────────
    function strokeArc(sn, arc, ringR, age, alpha, width, rgb, edgeOffset) {
        ctx.beginPath();
        const n = arc.nPoints;
        for (let i = 0; i <= n; i++) {
            const f = i / n;
            const a = arc.a0 + (arc.a1 - arc.a0) * f;
            const turb = 1 + 0.12 * (
                Math.sin(a * 5 + age * 0.06 + arc.phases[i]) +
                0.6 * Math.sin(a * 11 - age * 0.09 + arc.phases[i] * 1.7) +
                0.4 * Math.sin(a * 23 + age * 0.04 + arc.phases[i] * 2.3)
            );
            const r = ringR * arc.rMul * turb + edgeOffset;
            const px = sn.x + Math.cos(a) * r;
            const py = sn.y + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    function drawShock(sn, t, dim) {
        const ringAlpha = Math.pow(1 - t, 1.6) * 0.55 * dim;
        if (ringAlpha <= 0.02) return;
        const ringR = (8 + t * 170) * sn.scale;
        const age = sn.age;

        ctx.globalCompositeOperation = 'lighter';

        // Broken filaments, double-edged: inner blue-white, outer orange.
        const arcs = sn.shock.arcs;
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            if (arc.alpha * ringAlpha < 0.01) continue;
            strokeArc(sn, arc, ringR, age, ringAlpha * arc.alpha, arc.thickness + 2, [170, 205, 255], -2);
            strokeArc(sn, arc, ringR, age, ringAlpha * arc.alpha * 0.8, arc.thickness, [255, 160, 90], 2);
        }

        // Echo ring at 1.15× radius, phase-shifted noise.
        const eAlpha = ringAlpha * 0.4;
        if (eAlpha > 0.01) {
            const er = ringR * 1.15;
            const phases = sn.shock.echoPhases;
            ctx.beginPath();
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                const turb = 1 + 0.09 * (
                    Math.sin(a * 4 + age * 0.03 + phases[i]) +
                    0.7 * Math.sin(a * 9 - age * 0.05 + phases[(i * 3) % 64])
                );
                const r = er * turb;
                const px = sn.x + Math.cos(a) * r;
                const py = sn.y + Math.sin(a) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = `rgba(160, 180, 255, ${eAlpha})`;
            ctx.lineWidth = 1.2 * sn.scale;
            ctx.stroke();
        }

        // Rayleigh-Taylor fingers: tapering spikes past the front.
        const fingers = sn.shock.fingers;
        for (let i = 0; i < fingers.length; i++) {
            const f = fingers[i];
            const base = ringR * 0.95;
            const tip = ringR * (1 + f.len);
            const ca = Math.cos(f.angle);
            const sa = Math.sin(f.angle);
            const x1 = sn.x + ca * base;
            const y1 = sn.y + sa * base;
            const w2 = f.width / 2;
            ctx.beginPath();
            ctx.moveTo(x1 - sa * w2, y1 + ca * w2);
            ctx.lineTo(sn.x + ca * tip, sn.y + sa * tip);
            ctx.lineTo(x1 + sa * w2, y1 - ca * w2);
            ctx.closePath();
            ctx.fillStyle = `rgba(190, 215, 255, ${0.35 * ringAlpha})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2d: dense clumpy ejecta ─────────────────────────────────────────
    function drawEjecta(sn, dim) {
        let alive = 0;
        ctx.globalCompositeOperation = 'lighter';

        const clumps = sn.clumps;
        for (let c = 0; c < clumps.length; c++) {
            const cl = clumps[c];
            // Advance the clump centroid and its slow angular drift.
            cl.cx += cl.vx;
            cl.cy += cl.vy;
            cl.angle += cl.angularDrift;
            const ax = cl.cx + Math.cos(cl.angle) * cl.orbitR;
            const ay = cl.cy + Math.sin(cl.angle) * cl.orbitR;

            const arr = cl.particles;
            for (let i = arr.length - 1; i >= 0; i--) {
                const p = arr[i];
                p.age += 1;
                if (p.age > p.life) {
                    arr.splice(i, 1);
                    releaseParticle(p);
                    continue;
                }
                alive++;

                // Nearly ballistic; just enough drag to ease the fastest shrapnel.
                p.vx *= 0.997;
                p.vy *= 0.997;
                p.x += p.vx;
                p.y += p.vy;
                // Clump cohesion: gently pull each particle toward the drifting
                // anchor so clumps persist instead of scattering instantly.
                p.x += (ax - p.x) * cl.cohesion;
                p.y += (ay - p.y) * cl.cohesion;

                const pt = p.age / p.life;
                const cct = clamp01(pt + cl.hueOffset); // per-clump hue offset
                const rgb = colorRamp(cct, EJECTA_RAMP);
                const alpha = Math.pow(1 - pt, 1.3) * 0.9 * dim;

                // Big chunks get a soft halo.
                if (p.size >= 2.5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.12})`;
                    ctx.fill();
                }

                if (p.streak) {
                    // Two-segment streak: bright core + faint tail. No per-frame
                    // gradient allocation; still reads as smooth falloff under
                    // the 'lighter' composite.
                    const mag = Math.hypot(p.vx, p.vy) || 1;
                    const trail = Math.min(p.size * 9, mag * 5);
                    const ux = p.vx / mag;
                    const uy = p.vy / mag;
                    const mx = p.x - ux * trail * 0.5;
                    const my = p.y - uy * trail * 0.5;
                    ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
                    ctx.lineWidth = Math.max(0.4, p.size);
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mx, my);
                    ctx.stroke();
                    ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.35})`;
                    ctx.lineWidth = Math.max(0.3, p.size * 0.6);
                    ctx.beginPath();
                    ctx.moveTo(mx, my);
                    ctx.lineTo(p.x - ux * trail, p.y - uy * trail);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.max(0.3, p.size * (1 - pt * 0.5)), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
                    ctx.fill();
                }
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        return alive;
    }

    // ── Phase 2e: pulsing remnant core + spiraling wisps ──────────────────────
    function drawCore(sn, dim) {
        if (sn.core <= 0.02) return;
        const pulse = 0.75 + 0.25 * Math.sin(sn.age * 0.2);
        const coreR = 1.8 * sn.scale * pulse;

        ctx.globalCompositeOperation = 'lighter';

        // Blue-white pulsar glow.
        const g = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, coreR * 9);
        g.addColorStop(0, `rgba(200, 225, 255, ${0.8 * sn.core * dim * pulse})`);
        g.addColorStop(0.35, `rgba(160, 190, 255, ${0.35 * sn.core * dim * pulse})`);
        g.addColorStop(1, 'rgba(160, 190, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, coreR * 9, 0, Math.PI * 2);
        ctx.fill();

        // Compact core.
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, Math.max(0.5, coreR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 245, 255, ${0.95 * sn.core * dim})`;
        ctx.fill();

        // Thin spiraling wisps that brighten on a loop.
        const wAlpha = sn.core * dim * (0.3 + 0.25 * Math.sin(sn.age * 0.15 + 1));
        if (wAlpha > 0.02) {
            for (let i = 0; i < sn.wisps.length; i++) {
                const w = sn.wisps[i];
                const pts = 8;
                ctx.beginPath();
                for (let k = 0; k <= pts; k++) {
                    const f = k / pts;
                    const r = f * w.len;
                    const a = w.ang + f * 4 + sn.age * w.speed;
                    const px = sn.x + Math.cos(a) * r;
                    const py = sn.y + Math.sin(a) * r;
                    if (k === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = `rgba(185, 215, 255, ${wAlpha})`;
                ctx.lineWidth = Math.max(0.4, w.width);
                ctx.stroke();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        sn.core *= 0.99;
    }

    // ── Per-event master update ───────────────────────────────────────────────
    function drawSupernova(sn, isLight) {
        const dim = isLight ? 0.35 : 1;

        if (sn.phase === 'build') {
            drawBuild(sn, dim);
            return true;
        }

        sn.age += 1;
        const t = Math.min(1, sn.age / sn.life);

        // Double pulse: a dimmer second wash ~6-10 frames after detonation.
        if (sn.pulseCountdown > 0) {
            sn.pulseCountdown--;
            if (sn.pulseCountdown === 0) {
                sn.flash = Math.max(sn.flash, 0.35);
                sceneFlash = Math.max(sceneFlash, 0.25);
                shakeFrames = Math.max(shakeFrames, 5);
                shakeAmp = Math.max(shakeAmp, 1.8);
                shakeMax = Math.max(shakeMax, shakeFrames);
            }
        }

        // Local flash bloom + streak + flare ghosts.
        if (sn.flash > 0.02) {
            drawFlash(sn, dim);
            sn.flash *= 0.88;
        }

        // Fireball disc.
        updateAndDrawFireball(sn, dim);

        // Broken shock front.
        drawShock(sn, t, dim);

        // Clumpy ejecta.
        const alive = drawEjecta(sn, dim);

        // Remnant core + wisps.
        drawCore(sn, dim);

        // Keep the event alive while any component is still visible.
        const shockAlpha = Math.pow(1 - t, 1.6) * 0.55 * dim;
        return sn.flash > 0.02
            || sn.fireball.done === false
            || alive > 0
            || sn.core > 0.02
            || shockAlpha > 0.03;
    }

    // Occasionally a star detonates somewhere in the sky.
    let burstTimer = 60; // first burst ~1s after load
    function maybeSpawnBurst() {
        burstTimer -= 1;
        if (burstTimer > 0 || supernovae.length >= MAX_CONCURRENT) return;
        const margin = 90;
        spawnSupernova(
            margin + Math.random() * (width - margin * 2),
            margin + Math.random() * (height - margin * 2),
            1.0 + Math.random() * 0.5
        );
        burstTimer = 300 + Math.floor(Math.random() * 160); // every ~5-7.5s
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    function draw() {
        const isLight = document.documentElement.classList.contains('light-theme');

        // Smooth parallax easing toward the cursor.
        if (mouse.active) {
            targetPX = (mouse.x - width / 2) * 0.02;
            targetPY = (mouse.y - height / 2) * 0.02;
        }
        parallaxX += (targetPX - parallaxX) * 0.04;
        parallaxY += (targetPY - parallaxY) * 0.04;

        // Screen shake: decaying random translation.
        let shx = 0;
        let shy = 0;
        if (shakeFrames > 0) {
            const k = shakeFrames / shakeMax;
            shx = (Math.random() * 2 - 1) * shakeAmp * k;
            shy = (Math.random() * 2 - 1) * shakeAmp * k;
            shakeFrames--;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(shx, shy);

        drawStars(isLight);

        // Supernova events (newest drawn last, on top).
        for (let i = supernovae.length - 1; i >= 0; i--) {
            const alive = drawSupernova(supernovae[i], isLight);
            if (!alive) {
                destroySupernova(supernovae[i]);
                supernovae.splice(i, 1);
            }
        }

        ctx.restore();

        // Full-screen exposure wash — drawn outside the shake so no edge gaps.
        const dim = isLight ? 0.35 : 1;
        if (sceneFlash > 0.012) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 255, 255, ${sceneFlash * 0.4 * dim})`;
            ctx.fillRect(-20, -20, width + 40, height + 40);
            ctx.globalCompositeOperation = 'source-over';
        }
        sceneFlash *= 0.88; // exponential decay

        maybeSpawnBurst();

        animationFrameId = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            draw();
        }
    });

    draw();
})();
