// ══════════════════════════════════════════════════════════════════════════════
// NEXT-GEN CYBER MATRIX VOID: PERSPECTIVE GRID + MULTI-COLOR PARTICLES +
// CURSOR GRAVITY WELL + CLICK ENERGY RIPPLES & CODE SYMBOLS
// ══════════════════════════════════════════════════════════════════════════════

(function () {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = 0;
    let height = 0;
    let particles = [];
    let ripples = [];
    let codeFloating = [];

    const codeTokens = ['<AI/>', '{kt}', '01', 'fn()', 'android', '[RAG]', 'λ', 'MVVM', 'Room', 'python', 'exec'];

    const mouse = {
        x: null,
        y: null,
        radius: 220
    };

    // Track Mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Shockwave Energy Ripple on Click
    window.addEventListener('click', (e) => {
        ripples.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 180,
            alpha: 0.9,
            color: Math.random() > 0.5 ? '0, 240, 255' : '0, 255, 102'
        });
    });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initElements();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.85;
            this.vy = (Math.random() - 0.5) * 0.85;
            this.radius = Math.random() * 2.2 + 1;
            
            // Palette: Cyan, Violet, Emerald, Gold
            const paletteDark = ['0, 240, 255', '167, 139, 250', '0, 255, 102', '255, 183, 3'];
            const paletteLight = ['2, 132, 199', '126, 34, 206', '5, 150, 105', '217, 119, 6'];
            const colorIdx = Math.floor(Math.random() * paletteDark.length);
            
            this.rgbDark = paletteDark[colorIdx];
            this.rgbLight = paletteLight[colorIdx];
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
            this.pulse = Math.random() * Math.PI;
        }

        update() {
            this.pulse += this.pulseSpeed;
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse Gravity Attraction & Push
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    // Smooth magnetic swirl towards cursor
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }

        draw(isLight) {
            const rgb = isLight ? this.rgbLight : this.rgbDark;
            const currentRadius = this.radius + Math.sin(this.pulse) * 0.5;

            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${isLight ? 0.85 : 0.95})`;
            ctx.shadowBlur = isLight ? 4 : 12;
            ctx.shadowColor = `rgba(${rgb}, 0.8)`;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    class FloatingCode {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 20 + Math.random() * 100;
            this.vy = -(0.3 + Math.random() * 0.5);
            this.text = codeTokens[Math.floor(Math.random() * codeTokens.length)];
            this.alpha = 0.15 + Math.random() * 0.2;
            this.fontSize = 11 + Math.floor(Math.random() * 4);
        }

        update() {
            this.y += this.vy;
            if (this.y < -30) {
                this.reset();
            }
        }

        draw(isLight) {
            ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
            ctx.fillStyle = isLight ? `rgba(2, 132, 199, ${this.alpha * 0.8})` : `rgba(0, 240, 255, ${this.alpha})`;
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    function initElements() {
        particles = [];
        codeFloating = [];

        const count = Math.min(Math.floor((width * height) / 10000), 130);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        const tokenCount = Math.min(Math.floor(width / 70), 22);
        for (let i = 0; i < tokenCount; i++) {
            codeFloating.push(new FloatingCode());
        }
    }

    window.addEventListener('resize', resize);
    resize();

    // Draw Cyber Background Grid lines (Subtle 3D/Perspective effect)
    function drawGrid(isLight) {
        ctx.save();
        ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.25)' : 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 1;

        const gridSize = 60;
        const offsetX = (Date.now() * 0.005) % gridSize;

        for (let x = offsetX; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        const offsetY = (Date.now() * 0.005) % gridSize;
        for (let y = offsetY; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    function draw() {
        const isLight = document.documentElement.classList.contains('light-theme');

        ctx.clearRect(0, 0, width, height);

        // Render Layer 1: Ambient Grid
        drawGrid(isLight);

        // Render Layer 2: Floating Code Symbols
        for (let i = 0; i < codeFloating.length; i++) {
            codeFloating[i].update();
            codeFloating[i].draw(isLight);
        }

        // Render Layer 3: Particle Web & Laser Connections
        const maxDist = 140;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw(isLight);

            // Connect to mouse pointer
            if (mouse.x !== null && mouse.y !== null) {
                const dxM = mouse.x - p1.x;
                const dyM = mouse.y - p1.y;
                const distMSq = dxM * dxM + dyM * dyM;
                const mRadSq = mouse.radius * mouse.radius;

                if (distMSq < mRadSq) {
                    const alpha = (1 - Math.sqrt(distMSq) / mouse.radius) * 0.55;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = isLight 
                        ? `rgba(2, 132, 199, ${alpha})` 
                        : `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            // Connect to neighboring particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.32;
                    const rgb = isLight ? '2, 132, 199' : p1.rgbDark;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }

        // Render Layer 4: Click Energy Shockwave Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.radius += 4.5;
            r.alpha -= 0.02;

            if (r.alpha <= 0 || r.radius >= r.maxRadius) {
                ripples.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = isLight 
                ? `rgba(2, 132, 199, ${r.alpha})` 
                : `rgba(${r.color}, ${r.alpha})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgba(${r.color}, 0.8)`;
            ctx.stroke();
            ctx.restore();
        }

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
