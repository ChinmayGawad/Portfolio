// ══════════════════════════════════════════════════════════════════════════════
// GALAXY SUPERNOVA BURST (HYPER-REALISTIC & CINEMATIC):
// PRE-COLLAPSE GRAVITATIONAL IMPLOSION → WHITE-HOT FLASH & DIFFRACTION RAYS →
// RELATIVISTIC POLAR PLASMA JETS → TRIPLE-LAYER KINETIC SHOCKWAVE →
// EXPANDING NEBULAR REMNANT → DENSE CLUMPY EJECTA WITH MICRO-SPARKS →
// PULSING NEUTRON STAR CORE WITH SPIRALING WISPS
// ══════════════════════════════════════════════════════════════════════════════

(function () {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // ── Tunables ──────────────────────────────────────────────────────────────
    const BUILD_LEN = 60;          // frames of stellar build-up & implosion before detonation
    const EVENT_LIFE = 380;        // frames of expansion (~6.3 s)
    const FIREBALL_RISE = 30;      // frames for the fireball to reach max radius
    const FIREBALL_HOLD = 22;      // frames held at peak brightness
    const FIREBALL_FADE = 28;      // frames to fade the disc away
    const MAX_CONCURRENT = 2;      // simultaneous supernova events
    const MAX_TOTAL_PARTICLES = 2400; // global ejecta particle pool ceiling

    // Cap DPR at 2 for performance
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // Touch devices get a reduced particle budget (≈45% of desktop)
    const isMobile = navigator.maxTouchPoints > 0;
    const EVENT_PARTICLES = isMobile ? 320 : 800;

    // ── Global visual state ───────────────────────────────────────────────────
    let width = 0;
    let height = 0;
    let stars = [];
    let supernovae = [];

    // Exposure wash (full-screen camera blowout) — decays ×0.88 per frame.
    let sceneFlash = 0;

    // Screen shake — decaying random translation + rotational jolt.
    let shakeFrames = 0;
    let shakeAmp = 0;
    let shakeMax = 1;

    // ── Ambient star palette (white + nebula accents) ─────────────────────────
    const starPaletteDark = ['255, 255, 255', '167, 139, 250', '232, 121, 249', '34, 211, 238', '253, 224, 71'];
    const starPaletteLight = ['75, 85, 140', '124, 58, 237', '192, 38, 211', '8, 145, 178', '146, 110, 30'];

    // ── Color ramps ───────────────────────────────────────────────────────────
    // Fireball blackbody cooling: pure white → cyan white → solar yellow → gold → orange → deep ember.
    const FIREBALL_RAMP = [
        [255, 255, 255],
        [200, 240, 255],
        [255, 255, 255],
        [255, 246, 210],
        [255, 205, 110],
        [255, 140, 60],
        [200, 50, 40]
    ];
    // Ejecta debris cooling: white → electric cyan → violet → magenta → solar gold → flame orange → cosmic ash.
    const EJECTA_RAMP = [
        [255, 255, 255],
        [180, 240, 255],
        [167, 139, 250],
        [232, 121, 249],
        [253, 224, 71],
        [251, 146, 60],
        [180, 60, 40]
    ];
    // Nebula gas cloud cooling palette
    const NEBULA_RAMP = [
        [255, 255, 255],
        [160, 220, 255],
        [140, 90, 240],
        [200, 70, 210],
        [255, 140, 60],
        [100, 30, 80]
    ];

    // ── Mouse parallax state for ambient stars ────────────────────────────────
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

    // Click anywhere: ignite a supernova right at the cursor (scaled up for extra drama).
    window.addEventListener('click', (e) => {
        spawnSupernova(e.clientX, e.clientY, 1.95);
    });

    // ── Math helpers ──────────────────────────────────────────────────────────
    function clamp01(v) {
        return v < 0 ? 0 : v > 1 ? 1 : v;
    }
    function easeOutCubic(t) {
        const u = 1 - t;
        return 1 - u * u * u;
    }
    function easeInCubic(t) {
        return t * t * t;
    }
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
        return null;
    }
    function releaseParticle(p) {
        p.active = false;
        freeParticles.push(p);
    }

    // ── Ambient star layer ───────────────────────────────────────────────────
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
        const illum = 1 + sceneFlash * 0.45;
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
                ctx.globalCompositeOperation = 'lighter';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius * 2.6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.14})`;
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    }

    // ── Supernova construction ────────────────────────────────────────────────
    function spawnSupernova(cx, cy, scale) {
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
            flash: 0,
            pulseCountdown: 0,
            core: 1,
            jetAngle: Math.random() * Math.PI * 2, // Orientation of polar plasma jets
            jetLen: 0,                             // Current expanding length of jets
            diffractionAngle: Math.random() * Math.PI, // Initial rotation for starburst spikes
            clumps: [],
            fireball: null,
            shock: null,
            flare: [],
            buildMotes: [],
            implosionStreaks: [],
            nebulaBlobs: [],
            wisps: []
        };

        // Boiling surface motes during pre-detonation phase
        for (let i = 0; i < 12; i++) {
            sn.buildMotes.push({
                ang: Math.random() * Math.PI * 2,
                dist: 0.7 + Math.random() * 0.6,
                speed: 0.03 + Math.random() * 0.06,
                size: (0.9 + Math.random() * 1.8) * scale
            });
        }

        // Inward gravitational implosion streaks
        for (let i = 0; i < 16; i++) {
            const angle = Math.random() * Math.PI * 2;
            sn.implosionStreaks.push({
                angle,
                distStart: (45 + Math.random() * 65) * scale,
                speed: 1.5 + Math.random() * 2.0,
                width: (1.0 + Math.random() * 1.5) * scale
            });
        }

        // Spiraling wisps around the remnant core
        for (let i = 0; i < 4; i++) {
            sn.wisps.push({
                ang: Math.random() * Math.PI * 2,
                speed: 0.025 + Math.random() * 0.035,
                len: (12 + Math.random() * 16) * scale,
                width: (0.8 + Math.random() * 1.0) * scale
            });
        }

        // Lens-flare ghosts along line to screen center
        const fdx = width / 2 - cx;
        const fdy = height / 2 - cy;
        const fdist = Math.hypot(fdx, fdy) || 1;
        const fux = fdx / fdist;
        const fuy = fdy / fdist;
        const flareFracs = [0.25, 0.48, 0.72, 0.95];
        const flareRgb = ['255, 255, 255', '180, 235, 255', '240, 180, 255', '255, 220, 180'];
        for (let i = 0; i < 4; i++) {
            sn.flare.push({
                x: cx + fux * fdist * flareFracs[i],
                y: cy + fuy * fdist * flareFracs[i],
                r: (18 - i * 3.8) * scale,
                rgb: flareRgb[i]
            });
        }

        // Expanding soft nebular gas cloud blobs
        const blobCount = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < blobCount; i++) {
            const angle = (i / blobCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
            const speed = (0.25 + Math.random() * 0.35) * scale;
            sn.nebulaBlobs.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: (15 + Math.random() * 20) * scale,
                growth: (0.35 + Math.random() * 0.3) * scale,
                hueOffset: Math.random() * 0.3
            });
        }

        // Dense clumpy ejecta
        const shellV = (185 * scale) / EVENT_LIFE;
        const clumpCount = 14 + Math.floor(Math.random() * 6);
        let budget = Math.round(EVENT_PARTICLES * (0.9 + Math.random() * 0.2));

        for (let c = 0; c < clumpCount && budget > 0; c++) {
            const biasAngle = Math.random() * Math.PI * 2;
            const biasSpeed = 0.35 + Math.random() * 0.32;
            const count = Math.min(60, Math.max(16, Math.round(budget / (clumpCount - c))));
            budget -= count;

            const cl = {
                cx, cy,
                vx: Math.cos(biasAngle) * shellV * biasSpeed,
                vy: Math.sin(biasAngle) * shellV * biasSpeed,
                angle: Math.random() * Math.PI * 2,
                angularDrift: (Math.random() - 0.5) * 0.005,
                orbitR: (5 + Math.random() * 9) * scale,
                cohesion: 0.015 + Math.random() * 0.02,
                hueOffset: (Math.random() - 0.5) * 0.3,
                particles: []
            };
            sn.clumps.push(cl);

            for (let i = 0; i < count; i++) {
                const p = acquireParticle();
                if (!p) { budget = 0; break; }

                const r = Math.random();
                let speedMul, life;
                if (r < 0.62) {
                    speedMul = 0.4 + Math.random() * 0.35;    // Bulk ejecta
                    life = 260 + Math.random() * 220;
                } else if (r < 0.86) {
                    speedMul = 1.25 + Math.random() * 0.85;   // Fast shrapnel
                    life = 90 + Math.random() * 80;
                } else {
                    speedMul = 2.6 + Math.random() * 0.6;     // Hyper-velocity streaks
                    life = 65 + Math.random() * 65;
                }
                const speed = shellV * speedMul * (0.85 + Math.random() * 0.3);
                const angle = biasAngle + (Math.random() - 0.5) * 1.15;

                const sr = Math.random();
                let size;
                if (sr < 0.09) size = (3.2 + Math.random() * 2.2) * scale;
                else if (sr < 0.32) size = (1.2 + Math.random() * 1.5) * scale;
                else size = (0.35 + Math.random() * 0.55) * scale;

                p.active = true;
                p.x = cx;
                p.y = cy;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
                p.size = size;
                p.streak = speedMul > 1.2 || size >= 2.6;
                p.spark = size >= 2.8 && Math.random() < 0.4; // Can emit micro-sparks mid-flight
                p.age = 0;
                p.life = life;
                cl.particles.push(p);
            }
        }

        supernovae.push(sn);
    }

    function destroySupernova(sn) {
        for (let c = 0; c < sn.clumps.length; c++) {
            const arr = sn.clumps[c].particles;
            for (let i = 0; i < arr.length; i++) releaseParticle(arr[i]);
            arr.length = 0;
        }
        sn.clumps.length = 0;
    }

    // ── Detonation trigger ────────────────────────────────────────────────────
    function detonate(sn) {
        sn.phase = 'explode';
        sn.age = 0;
        sn.flash = 0.85;
        sn.pulseCountdown = 7 + Math.floor(Math.random() * 5);

        sceneFlash = Math.max(sceneFlash, 0.75); // Full-screen exposure wash
        shakeFrames = 15 + Math.floor(Math.random() * 5);
        shakeAmp = 3.5 + Math.random() * 2.5;
        shakeMax = shakeFrames;

        sn.shock = buildShock(sn);
        sn.fireball = buildFireball(sn);
    }

    // ── Precomputed shock geometry ─────────────────────────────────────────────
    function buildShock(sn) {
        const scale = sn.scale;
        const arcs = [];
        const arcCount = 14 + Math.floor(Math.random() * 6);
        let a = Math.random() * Math.PI * 2;
        for (let i = 0; i < arcCount; i++) {
            const arcLen = 0.45 + Math.random() * 0.8;
            const gap = 0.06 + Math.random() * 0.4;
            const nPoints = 8 + Math.floor(Math.random() * 6);
            const phases = new Float32Array(nPoints + 1);
            for (let k = 0; k <= nPoints; k++) phases[k] = Math.random() * Math.PI * 2;
            arcs.push({
                a0: a,
                a1: a + arcLen,
                rMul: 0.88 + Math.random() * 0.24,
                thickness: (1.8 + Math.random() * 2.8) * scale,
                alpha: 0.25 + Math.random() * 0.65,
                nPoints,
                phases
            });
            a += arcLen + gap;
        }

        // Rayleigh-Taylor plasma finger spikes
        const fingers = [];
        const fingerCount = 10 + Math.floor(Math.random() * 6);
        for (let i = 0; i < fingerCount; i++) {
            fingers.push({
                angle: Math.random() * Math.PI * 2,
                len: 0.12 + Math.random() * 0.18,
                width: (1.4 + Math.random() * 1.8) * scale
            });
        }

        const echoPhases = new Float32Array(64);
        for (let i = 0; i < 64; i++) echoPhases[i] = Math.random() * Math.PI * 2;

        return { arcs, fingers, echoPhases };
    }

    // ── Fireball disc state ───────────────────────────────────────────────────
    function buildFireball(sn) {
        const boil = [];
        const boilCount = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < boilCount; i++) {
            boil.push({
                ang: Math.random() * Math.PI * 2,
                dist: 0.15 + Math.random() * 0.45,
                speed: (0.004 + Math.random() * 0.008) * (Math.random() < 0.5 ? -1 : 1),
                size: 0.5 + Math.random() * 0.8
            });
        }
        return { t: 0, hold: 0, fade: 0, done: false, maxR: 98 * sn.scale, boil };
    }

    // ── Phase 1: Stellar Build-up & Gravitational Implosion ───────────────────
    function drawBuild(sn, dim) {
        sn.build -= 1;
        const bf = BUILD_LEN - sn.build;
        const progress = bf / BUILD_LEN;

        // Last 16 frames: Gravitational implosion snap!
        const isImploding = sn.build <= 16;
        const implosionProgress = isImploding ? (16 - sn.build) / 16 : 0;

        ctx.globalCompositeOperation = 'lighter';

        if (!isImploding) {
            // Swelling & pulsating star phase
            const b = easeOutCubic(progress);
            const pulse = 0.75 + 0.25 * Math.sin(sn.build * 0.35);
            const coreR = (1.8 + b * 3.2) * sn.scale * pulse;
            const haloR = coreR * (5.5 + b * 7.5);
            const glow = Math.min(1, b * 0.55 * dim);

            const halo = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, haloR);
            halo.addColorStop(0, `rgba(220, 240, 255, ${glow})`);
            halo.addColorStop(0.4, `rgba(170, 200, 255, ${glow * 0.4})`);
            halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(sn.x, sn.y, haloR, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(sn.x, sn.y, Math.max(0.6, coreR), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(240, 248, 255, ${Math.min(1, (0.7 + b * 0.3) * dim)})`;
            ctx.fill();

            // Surface motes orbiting core
            for (let i = 0; i < sn.buildMotes.length; i++) {
                const m = sn.buildMotes[i];
                const ma = m.ang + sn.build * m.speed;
                const mr = coreR * m.dist;
                ctx.beginPath();
                ctx.arc(sn.x + Math.cos(ma) * mr, sn.y + Math.sin(ma) * mr, m.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 245, 235, ${0.6 * dim})`;
                ctx.fill();
            }
        } else {
            // Collapse / Implosion phase: core rapidly contracts into a dense white-hot point
            const shrink = 1 - easeInCubic(implosionProgress);
            const coreR = Math.max(0.6, 5 * sn.scale * shrink);
            const haloR = Math.max(2, 35 * sn.scale * shrink);
            const flashBoost = 0.6 + implosionProgress * 0.4;

            // Concentric suction glow
            const halo = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, haloR);
            halo.addColorStop(0, `rgba(255, 255, 255, ${flashBoost * dim})`);
            halo.addColorStop(0.5, `rgba(180, 230, 255, ${flashBoost * 0.6 * dim})`);
            halo.addColorStop(1, 'rgba(180, 230, 255, 0)');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(sn.x, sn.y, haloR, 0, Math.PI * 2);
            ctx.fill();

            // Core point
            ctx.beginPath();
            ctx.arc(sn.x, sn.y, coreR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${dim})`;
            ctx.fill();

            // Inward space suction streaks accelerating into the collapsing core
            for (let i = 0; i < sn.implosionStreaks.length; i++) {
                const s = sn.implosionStreaks[i];
                const curDist = s.distStart * shrink;
                const tailDist = s.distStart * (shrink + 0.25);
                const ca = Math.cos(s.angle);
                const sa = Math.sin(s.angle);
                ctx.strokeStyle = `rgba(200, 235, 255, ${0.75 * implosionProgress * dim})`;
                ctx.lineWidth = s.width;
                ctx.beginPath();
                ctx.moveTo(sn.x + ca * tailDist, sn.y + sa * tailDist);
                ctx.lineTo(sn.x + ca * curDist, sn.y + sa * curDist);
                ctx.stroke();
            }
        }

        ctx.globalCompositeOperation = 'source-over';

        if (sn.build <= 0) detonate(sn);
    }

    // ── Phase 2a: Detonation Flash, Diffraction Rays & Lens Flare ─────────────
    function drawFlash(sn, dim) {
        const f = sn.flash;
        const fr = (35 + (1 - f) * 145) * sn.scale;
        const fa = f * 0.7 * dim;

        ctx.globalCompositeOperation = 'lighter';

        // 1. Concentric Radial Bloom
        const bloom = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, fr);
        bloom.addColorStop(0, `rgba(255, 255, 255, ${fa})`);
        bloom.addColorStop(0.35, `rgba(200, 240, 255, ${fa * 0.55})`);
        bloom.addColorStop(0.7, `rgba(220, 160, 255, ${fa * 0.25})`);
        bloom.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, fr, 0, Math.PI * 2);
        ctx.fill();

        // 2. Multi-Axis Diffraction Starburst Rays (8 spokes)
        const rayLen = fr * 2.8;
        const rayCount = 8;
        const baseAng = sn.diffractionAngle + sn.age * 0.005;
        for (let i = 0; i < rayCount; i++) {
            const ang = baseAng + (i / rayCount) * Math.PI * 2;
            const rx = Math.cos(ang) * rayLen;
            const ry = Math.sin(ang) * rayLen;
            const rgrad = ctx.createLinearGradient(sn.x, sn.y, sn.x + rx, sn.y + ry);
            rgrad.addColorStop(0, `rgba(255, 255, 255, ${fa * 0.4})`);
            rgrad.addColorStop(0.5, `rgba(180, 230, 255, ${fa * 0.2})`);
            rgrad.addColorStop(1, 'rgba(180, 230, 255, 0)');
            ctx.strokeStyle = rgrad;
            ctx.lineWidth = Math.max(1, (i % 2 === 0 ? 3.0 : 1.5) * sn.scale * f);
            ctx.beginPath();
            ctx.moveTo(sn.x, sn.y);
            ctx.lineTo(sn.x + rx, sn.y + ry);
            ctx.stroke();
        }

        // 3. Anamorphic Horizontal Lens Streak
        const sw = fr * 2.6;
        const sh = Math.max(2.5, fr * 0.18);
        const sg = ctx.createLinearGradient(sn.x - sw / 2, 0, sn.x + sw / 2, 0);
        sg.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sg.addColorStop(0.5, `rgba(255, 255, 255, ${fa * 0.35})`);
        sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sg;
        ctx.fillRect(sn.x - sw / 2, sn.y - sh / 2, sw, sh);

        // 4. Lens Flare Ghost Circles
        for (let i = 0; i < sn.flare.length; i++) {
            const lf = sn.flare[i];
            const lr = lf.r * (1 + f * 2.2);
            const lg = ctx.createRadialGradient(lf.x, lf.y, 0, lf.x, lf.y, lr);
            lg.addColorStop(0, `rgba(${lf.rgb}, ${fa * 0.22})`);
            lg.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = lg;
            ctx.beginPath();
            ctx.arc(lf.x, lf.y, lr, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2b: Relativistic Polar Plasma Jets (Gamma-Ray Burst) ────────────
    function drawPolarJets(sn, dim) {
        if (sn.age > 130) return;
        const jetProgress = Math.min(1, sn.age / 40);
        const fadeOut = Math.pow(1 - sn.age / 130, 1.4);
        const maxJetLen = 280 * sn.scale * jetProgress;
        sn.jetLen = maxJetLen;

        ctx.globalCompositeOperation = 'lighter';

        const angles = [sn.jetAngle, sn.jetAngle + Math.PI];
        for (let k = 0; k < 2; k++) {
            const ang = angles[k];
            const ca = Math.cos(ang);
            const sa = Math.sin(ang);
            const tipX = sn.x + ca * sn.jetLen;
            const tipY = sn.y + sa * sn.jetLen;

            // Outer plasma glow shaft
            const jg = ctx.createLinearGradient(sn.x, sn.y, tipX, tipY);
            jg.addColorStop(0, `rgba(255, 255, 255, ${0.8 * fadeOut * dim})`);
            jg.addColorStop(0.3, `rgba(160, 220, 255, ${0.5 * fadeOut * dim})`);
            jg.addColorStop(0.7, `rgba(220, 120, 255, ${0.3 * fadeOut * dim})`);
            jg.addColorStop(1, 'rgba(255, 120, 255, 0)');

            ctx.strokeStyle = jg;
            ctx.lineWidth = Math.max(1, 8.0 * sn.scale * fadeOut);
            ctx.beginPath();
            ctx.moveTo(sn.x, sn.y);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            // Inner high-energy laser core
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * fadeOut * dim})`;
            ctx.lineWidth = Math.max(0.6, 2.0 * sn.scale * fadeOut);
            ctx.beginPath();
            ctx.moveTo(sn.x, sn.y);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            // Bow-shock head at the tip of the jet
            const headR = (12 + sn.age * 0.15) * sn.scale;
            const hg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, headR);
            hg.addColorStop(0, `rgba(255, 240, 255, ${0.7 * fadeOut * dim})`);
            hg.addColorStop(0.5, `rgba(160, 200, 255, ${0.35 * fadeOut * dim})`);
            hg.addColorStop(1, 'rgba(160, 200, 255, 0)');
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(tipX, tipY, headR, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2c: Expanding Nebular Remnant Cloud Blobs ───────────────────────
    function drawNebula(sn, dim) {
        if (!sn.nebulaBlobs || !sn.nebulaBlobs.length) return;
        const t = Math.min(1, sn.age / sn.life);
        const alpha = Math.pow(1 - t, 1.2) * 0.35 * dim;
        if (alpha <= 0.01) return;

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < sn.nebulaBlobs.length; i++) {
            const b = sn.nebulaBlobs[i];
            b.x += b.vx;
            b.y += b.vy;
            b.r += b.growth;

            const cool = clamp01(t * 0.7 + b.hueOffset);
            const rgb = colorRamp(cool, NEBULA_RAMP);

            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.6})`);
            g.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.25})`);
            g.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2d: Blackbody Fireball Disc ─────────────────────────────────────
    function updateAndDrawFireball(sn, dim) {
        const fb = sn.fireball;
        if (!fb || fb.done) return;

        if (fb.fade >= FIREBALL_FADE) fb.done = true;
        else if (fb.hold >= FIREBALL_HOLD) fb.fade += 1;
        else if (fb.t < 1) fb.t = Math.min(1, fb.t + 1 / FIREBALL_RISE);
        else fb.hold += 1;

        const R = Math.max(1, fb.maxR * (1 - Math.pow(1 - fb.t, 0.7)));

        let alpha;
        if (fb.t < 1) alpha = easeOutCubic(fb.t) * 0.65 * dim;
        else if (fb.fade === 0) alpha = 0.65 * dim;
        else alpha = 0.65 * dim * (1 - fb.fade / FIREBALL_FADE);
        if (alpha <= 0.01) { fb.done = true; return; }

        const cool = clamp01(fb.t * 0.45 + fb.hold * 0.012 + fb.fade * 0.026);
        const rgb = colorRamp(cool, FIREBALL_RAMP);

        ctx.globalCompositeOperation = 'lighter';

        const g = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, R);
        g.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`);
        g.addColorStop(0.55, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.85})`);
        g.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, R, 0, Math.PI * 2);
        ctx.fill();

        // Hot boil spots orbiting disc surface
        for (let i = 0; i < fb.boil.length; i++) {
            const b = fb.boil[i];
            const ba = b.ang + sn.age * b.speed;
            const bx = sn.x + Math.cos(ba) * R * b.dist;
            const by = sn.y + Math.sin(ba) * R * b.dist;
            const bR = Math.max(2, R * 0.15 * b.size);
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

    // ── Phase 2e: Triple-Layer Kinetic Shockwave ─────────────────────────────
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
        const ringAlpha = Math.pow(1 - t, 1.5) * 0.6 * dim;
        if (ringAlpha <= 0.02) return;
        const ringR = (10 + t * 185) * sn.scale;
        const age = sn.age;

        ctx.globalCompositeOperation = 'lighter';

        // 1. Fast Precursor Ionization Ring (expanding ahead at 1.35x speed)
        const fastR = ringR * 1.35;
        const fastAlpha = ringAlpha * 0.35;
        if (fastAlpha > 0.01) {
            ctx.beginPath();
            ctx.arc(sn.x, sn.y, fastR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(160, 240, 255, ${fastAlpha})`;
            ctx.lineWidth = 1.2 * sn.scale;
            ctx.stroke();
        }

        // 2. Main Filamentary Shock Front with Dual Edge Color
        const arcs = sn.shock.arcs;
        for (let i = 0; i < arcs.length; i++) {
            const arc = arcs[i];
            if (arc.alpha * ringAlpha < 0.01) continue;
            strokeArc(sn, arc, ringR, age, ringAlpha * arc.alpha, arc.thickness + 2.5, [180, 230, 255], -2);
            strokeArc(sn, arc, ringR, age, ringAlpha * arc.alpha * 0.85, arc.thickness, [255, 170, 80], 2);
        }

        // 3. Echo Ring (at 1.16x radius)
        const eAlpha = ringAlpha * 0.42;
        if (eAlpha > 0.01) {
            const er = ringR * 1.16;
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
            ctx.strokeStyle = `rgba(180, 190, 255, ${eAlpha})`;
            ctx.lineWidth = 1.4 * sn.scale;
            ctx.stroke();
        }

        // Rayleigh-Taylor plasma finger spikes
        const fingers = sn.shock.fingers;
        for (let i = 0; i < fingers.length; i++) {
            const f = fingers[i];
            const base = ringR * 0.94;
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
            ctx.fillStyle = `rgba(200, 225, 255, ${0.38 * ringAlpha})`;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    // ── Phase 2f: Clumpy Ejecta with Micro-Sparks ─────────────────────────────
    function drawEjecta(sn, dim) {
        let alive = 0;
        ctx.globalCompositeOperation = 'lighter';

        const clumps = sn.clumps;
        for (let c = 0; c < clumps.length; c++) {
            const cl = clumps[c];
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

                p.vx *= 0.997;
                p.vy *= 0.997;
                p.x += p.vx;
                p.y += p.vy;
                p.x += (ax - p.x) * cl.cohesion;
                p.y += (ay - p.y) * cl.cohesion;

                const pt = p.age / p.life;
                const cct = clamp01(pt + cl.hueOffset);
                const rgb = colorRamp(cct, EJECTA_RAMP);
                const alpha = Math.pow(1 - pt, 1.3) * 0.92 * dim;

                // Heavy shrapnel halo
                if (p.size >= 2.6) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.14})`;
                    ctx.fill();

                    // Micro-spark emission for heavy shrapnel
                    if (p.spark && Math.random() < 0.25) {
                        const sx = p.x + (Math.random() - 0.5) * 6 * sn.scale;
                        const sy = p.y + (Math.random() - 0.5) * 6 * sn.scale;
                        ctx.beginPath();
                        ctx.arc(sx, sy, 0.8 * sn.scale, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 245, 200, ${alpha * 0.8})`;
                        ctx.fill();
                    }
                }

                if (p.streak) {
                    const mag = Math.hypot(p.vx, p.vy) || 1;
                    const trail = Math.min(p.size * 10, mag * 5.5);
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

    // ── Phase 2g: Pulsing Remnant Core & Magnetic Wisps ───────────────────────
    function drawCore(sn, dim) {
        if (sn.core <= 0.02) return;
        const pulse = 0.75 + 0.25 * Math.sin(sn.age * 0.22);
        const coreR = 2.0 * sn.scale * pulse;

        ctx.globalCompositeOperation = 'lighter';

        // Pulsar Glow
        const g = ctx.createRadialGradient(sn.x, sn.y, 0, sn.x, sn.y, coreR * 10);
        g.addColorStop(0, `rgba(200, 235, 255, ${0.85 * sn.core * dim * pulse})`);
        g.addColorStop(0.35, `rgba(170, 195, 255, ${0.38 * sn.core * dim * pulse})`);
        g.addColorStop(1, 'rgba(170, 195, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, coreR * 10, 0, Math.PI * 2);
        ctx.fill();

        // Core Point
        ctx.beginPath();
        ctx.arc(sn.x, sn.y, Math.max(0.6, coreR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 250, 255, ${0.95 * sn.core * dim})`;
        ctx.fill();

        // Magnetic Field Wisps
        const wAlpha = sn.core * dim * (0.32 + 0.28 * Math.sin(sn.age * 0.16 + 1));
        if (wAlpha > 0.02) {
            for (let i = 0; i < sn.wisps.length; i++) {
                const w = sn.wisps[i];
                const pts = 9;
                ctx.beginPath();
                for (let k = 0; k <= pts; k++) {
                    const f = k / pts;
                    const r = f * w.len;
                    const a = w.ang + f * 4.2 + sn.age * w.speed;
                    const px = sn.x + Math.cos(a) * r;
                    const py = sn.y + Math.sin(a) * r;
                    if (k === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.strokeStyle = `rgba(195, 225, 255, ${wAlpha})`;
                ctx.lineWidth = Math.max(0.4, w.width);
                ctx.stroke();
            }
        }

        ctx.globalCompositeOperation = 'source-over';
        sn.core *= 0.991;
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

        // Double pulse flash wave ~7-11 frames after detonation
        if (sn.pulseCountdown > 0) {
            sn.pulseCountdown--;
            if (sn.pulseCountdown === 0) {
                sn.flash = Math.max(sn.flash, 0.4);
                sceneFlash = Math.max(sceneFlash, 0.3);
                shakeFrames = Math.max(shakeFrames, 6);
                shakeAmp = Math.max(shakeAmp, 2.2);
                shakeMax = Math.max(shakeMax, shakeFrames);
            }
        }

        // 1. Flash Bloom & Starburst Rays
        if (sn.flash > 0.02) {
            drawFlash(sn, dim);
            sn.flash *= 0.88;
        }

        // 2. Relativistic Polar Plasma Jets
        drawPolarJets(sn, dim);

        // 3. Expanding Nebular Remnant Cloud
        drawNebula(sn, dim);

        // 4. Blackbody Fireball
        updateAndDrawFireball(sn, dim);

        // 5. Triple-Layer Kinetic Shockwave
        drawShock(sn, t, dim);

        // 6. Clumpy Ejecta
        const alive = drawEjecta(sn, dim);

        // 7. Remnant Core & Wisps
        drawCore(sn, dim);

        const shockAlpha = Math.pow(1 - t, 1.5) * 0.6 * dim;
        return sn.flash > 0.02
            || sn.fireball.done === false
            || alive > 0
            || sn.core > 0.02
            || shockAlpha > 0.03;
    }

    // Occasional sky starburst (~every 5-7.5 seconds)
    let burstTimer = 60;
    function maybeSpawnBurst() {
        burstTimer -= 1;
        if (burstTimer > 0 || supernovae.length >= MAX_CONCURRENT) return;
        const margin = 90;
        spawnSupernova(
            margin + Math.random() * (width - margin * 2),
            margin + Math.random() * (height - margin * 2),
            1.0 + Math.random() * 0.55
        );
        burstTimer = 300 + Math.floor(Math.random() * 160);
    }

    // ── Main animation loop ───────────────────────────────────────────────────
    function draw() {
        const isLight = document.documentElement.classList.contains('light-theme');

        // Smooth parallax easing toward cursor
        if (mouse.active) {
            targetPX = (mouse.x - width / 2) * 0.02;
            targetPY = (mouse.y - height / 2) * 0.02;
        }
        parallaxX += (targetPX - parallaxX) * 0.04;
        parallaxY += (targetPY - parallaxY) * 0.04;

        // Decaying screen shake
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

        // Supernova events
        for (let i = supernovae.length - 1; i >= 0; i--) {
            const alive = drawSupernova(supernovae[i], isLight);
            if (!alive) {
                destroySupernova(supernovae[i]);
                supernovae.splice(i, 1);
            }
        }

        ctx.restore();

        // Full-screen exposure wash
        const dim = isLight ? 0.35 : 1;
        if (sceneFlash > 0.012) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 255, 255, ${sceneFlash * 0.45 * dim})`;
            ctx.fillRect(-20, -20, width + 40, height + 40);
            ctx.globalCompositeOperation = 'source-over';
        }
        sceneFlash *= 0.88;

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
