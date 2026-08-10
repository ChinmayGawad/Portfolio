/**
 * COSMIC ENGINE — Award-Winning Cinematic Space & Starfield Engine
 * Built with Three.js & GSAP ScrollTrigger
 * Chinmay Gawad Portfolio Redesign
 */

class CosmicEngine {
    constructor() {
        this.canvas = document.getElementById('galaxy-canvas');
        if (!this.canvas) return;

        this.isMobile = window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        this.particleCount = this.isMobile ? 6000 : 18000;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.starPoints = null;
        this.geometry = null;
        this.material = null;

        this.scrollProgress = 0;
        this.time = 0;
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

        this.states = {
            hero: new Float32Array(this.particleCount * 3),
            about: new Float32Array(this.particleCount * 3),
            skills: new Float32Array(this.particleCount * 3),
            projects: new Float32Array(this.particleCount * 3),
            journey: new Float32Array(this.particleCount * 3),
            contact: new Float32Array(this.particleCount * 3)
        };

        this.colorStates = {
            hero: new Float32Array(this.particleCount * 3),
            about: new Float32Array(this.particleCount * 3),
            skills: new Float32Array(this.particleCount * 3),
            projects: new Float32Array(this.particleCount * 3),
            journey: new Float32Array(this.particleCount * 3),
            contact: new Float32Array(this.particleCount * 3)
        };

        this.sizes = new Float32Array(this.particleCount);

        this.init();
    }

    init() {
        // 1. WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // 2. Camera & Scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 80);

        // 3. Generate State Geometries
        this.generateHeroState();
        this.generateAboutState();
        this.generateSkillsState();
        this.generateProjectsState();
        this.generateJourneyState();
        this.generateContactState();

        for (let i = 0; i < this.particleCount; i++) {
            this.sizes[i] = Math.random() * 2.4 + 1.1;
        }

        // 4. Build GPU Buffer Attributes
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.states.hero, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        this.geometry.setAttribute('aPosHero', new THREE.BufferAttribute(this.states.hero, 3));
        this.geometry.setAttribute('aPosAbout', new THREE.BufferAttribute(this.states.about, 3));
        this.geometry.setAttribute('aPosSkills', new THREE.BufferAttribute(this.states.skills, 3));
        this.geometry.setAttribute('aPosProjects', new THREE.BufferAttribute(this.states.projects, 3));
        this.geometry.setAttribute('aPosJourney', new THREE.BufferAttribute(this.states.journey, 3));
        this.geometry.setAttribute('aPosContact', new THREE.BufferAttribute(this.states.contact, 3));

        this.geometry.setAttribute('aColHero', new THREE.BufferAttribute(this.colorStates.hero, 3));
        this.geometry.setAttribute('aColAbout', new THREE.BufferAttribute(this.colorStates.about, 3));
        this.geometry.setAttribute('aColSkills', new THREE.BufferAttribute(this.colorStates.skills, 3));
        this.geometry.setAttribute('aColProjects', new THREE.BufferAttribute(this.colorStates.projects, 3));
        this.geometry.setAttribute('aColJourney', new THREE.BufferAttribute(this.colorStates.journey, 3));
        this.geometry.setAttribute('aColContact', new THREE.BufferAttribute(this.colorStates.contact, 3));

        // 5. GPU Shader Material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 0.0 },
                uTime: { value: 0.0 },
                uPixelRatio: { value: this.renderer.getPixelRatio() },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uClickPos: { value: new THREE.Vector2(0, 0) },
                uClickTime: { value: 0.0 }
            },
            vertexShader: `
                attribute float size;
                
                attribute vec3 aPosHero;
                attribute vec3 aPosAbout;
                attribute vec3 aPosSkills;
                attribute vec3 aPosProjects;
                attribute vec3 aPosJourney;
                attribute vec3 aPosContact;

                attribute vec3 aColHero;
                attribute vec3 aColAbout;
                attribute vec3 aColSkills;
                attribute vec3 aColProjects;
                attribute vec3 aColJourney;
                attribute vec3 aColContact;

                varying vec3 vColor;
                varying float vTwinkle;
                
                uniform float uProgress;
                uniform float uTime;
                uniform float uPixelRatio;
                uniform vec2 uMouse;
                uniform vec2 uClickPos;
                uniform float uClickTime;

                vec3 getPos(float p) {
                    if (p <= 1.0) return mix(aPosHero, aPosAbout, p);
                    if (p <= 2.0) return mix(aPosAbout, aPosSkills, p - 1.0);
                    if (p <= 3.0) return mix(aPosSkills, aPosProjects, p - 2.0);
                    if (p <= 4.0) return mix(aPosProjects, aPosJourney, p - 3.0);
                    return mix(aPosJourney, aPosContact, clamp(p - 4.0, 0.0, 1.0));
                }

                vec3 getCol(float p) {
                    if (p <= 1.0) return mix(aColHero, aColAbout, p);
                    if (p <= 2.0) return mix(aColAbout, aColSkills, p - 1.0);
                    if (p <= 3.0) return mix(aColSkills, aColProjects, p - 2.0);
                    if (p <= 4.0) return mix(aColProjects, aColJourney, p - 3.0);
                    return mix(aColJourney, aColContact, clamp(p - 4.0, 0.0, 1.0));
                }

                void main() {
                    vec3 pos = getPos(uProgress);
                    vColor = getCol(uProgress);

                    vTwinkle = sin(uTime * 2.2 + pos.x * 0.1 + pos.y * 0.1) * 0.35 + 0.65;

                    pos.y += sin(pos.x * 0.04 + uTime * 1.2) * 2.5;

                    vec3 mouseWorld = vec3(uMouse.x * 35.0, uMouse.y * 35.0, 0.0);
                    float dist = distance(pos, mouseWorld);
                    if (dist < 22.0) {
                        float pull = (1.0 - dist / 22.0) * 3.0;
                        vec3 dir = normalize(pos - mouseWorld);
                        pos += dir * pull;
                    }

                    // Dynamic Cosmic Shockwave on Mouse Click
                    if (uClickTime > 0.001) {
                        vec3 clickWorld = vec3(uClickPos.x * 40.0, uClickPos.y * 40.0, 0.0);
                        float cDist = distance(pos, clickWorld);
                        float waveRadius = (1.0 - uClickTime) * 60.0;
                        float waveThickness = 14.0;
                        float distFromWave = abs(cDist - waveRadius);
                        if (distFromWave < waveThickness) {
                            float force = (1.0 - distFromWave / waveThickness) * uClickTime * 14.0;
                            vec3 pushDir = cDist > 0.001 ? normalize(pos - clickWorld) : vec3(0.0, 1.0, 0.0);
                            pos += pushDir * force;
                        }
                    }

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * vTwinkle * (200.0 / -mvPosition.z) * uPixelRatio;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vTwinkle;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = smoothstep(0.5, 0.0, dist) * vTwinkle;
                    vec3 glowColor = vColor + vec3(0.2 * (1.0 - dist));

                    gl_FragColor = vec4(glowColor, alpha * 0.85);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.starPoints = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.starPoints);

        // 6. Listeners & GSAP ScrollTrigger
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onWindowResize());

        this.setupScrollTrigger();
        this.animate();
    }

    // ── STATE GENERATORS ───────────────────────────────────────────────────

    generateHeroState() {
        const count = this.particleCount;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 120 - 20;
            const y = Math.sin(x * 0.04) * 12 + Math.cos(z * 0.05) * 8 - 20;

            this.states.hero[i3] = x;
            this.states.hero[i3 + 1] = y;
            this.states.hero[i3 + 2] = z;

            const rChoice = Math.random();
            if (rChoice < 0.4) {
                this.colorStates.hero[i3] = 0.2; this.colorStates.hero[i3 + 1] = 0.6; this.colorStates.hero[i3 + 2] = 1.0;
            } else if (rChoice < 0.75) {
                this.colorStates.hero[i3] = 0.75; this.colorStates.hero[i3 + 1] = 0.35; this.colorStates.hero[i3 + 2] = 0.95;
            } else {
                this.colorStates.hero[i3] = 0.95; this.colorStates.hero[i3 + 1] = 0.45; this.colorStates.hero[i3 + 2] = 0.75;
            }
        }
    }

    generateAboutState() {
        const count = this.particleCount;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const radius = Math.pow(Math.random(), 0.7) * 55 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const x = 30 + radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            this.states.about[i3] = x;
            this.states.about[i3 + 1] = y;
            this.states.about[i3 + 2] = z;

            this.colorStates.about[i3] = 0.45; this.colorStates.about[i3 + 1] = 0.2; this.colorStates.about[i3 + 2] = 0.9;
        }
    }

    generateSkillsState() {
        const count = this.particleCount;
        const centers = [
            { x: -40, y: 20, z: 0, c: [0.2, 0.8, 1.0] },
            { x: 40, y: 20, z: 0, c: [0.75, 0.3, 0.95] },
            { x: -40, y: -20, z: 0, c: [1.0, 0.75, 0.2] },
            { x: 40, y: -20, z: 0, c: [0.2, 0.9, 0.6] }
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const center = centers[i % 4];

            const r = Math.pow(Math.random(), 2) * 20;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;

            this.states.skills[i3] = center.x + r * Math.sin(theta) * Math.cos(phi);
            this.states.skills[i3 + 1] = center.y + r * Math.sin(theta) * Math.sin(phi);
            this.states.skills[i3 + 2] = center.z + r * Math.cos(theta);

            this.colorStates.skills[i3] = center.c[0];
            this.colorStates.skills[i3 + 1] = center.c[1];
            this.colorStates.skills[i3 + 2] = center.c[2];
        }
    }

    generateProjectsState() {
        const count = this.particleCount;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = Math.random() * 60 + 10;
            const angle = Math.random() * Math.PI * 2;

            this.states.projects[i3] = Math.cos(angle) * r;
            this.states.projects[i3 + 1] = (Math.random() - 0.5) * 12;
            this.states.projects[i3 + 2] = Math.sin(angle) * r;

            this.colorStates.projects[i3] = 0.75; this.colorStates.projects[i3 + 1] = 0.25; this.colorStates.projects[i3 + 2] = 0.95;
        }
    }

    generateJourneyState() {
        const count = this.particleCount;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const progress = (i / count);
            const angle = progress * Math.PI * 6;
            const radius = 30;

            this.states.journey[i3] = Math.cos(angle) * radius;
            this.states.journey[i3 + 1] = (progress - 0.5) * 110;
            this.states.journey[i3 + 2] = Math.sin(angle) * radius;

            this.colorStates.journey[i3] = 0.3; this.colorStates.journey[i3 + 1] = 0.7; this.colorStates.journey[i3 + 2] = 0.9;
        }
    }

    generateContactState() {
        const count = this.particleCount;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const r = Math.random() * 160 + 10;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;

            this.states.contact[i3] = r * Math.sin(theta) * Math.cos(phi);
            this.states.contact[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            this.states.contact[i3 + 2] = r * Math.cos(theta);

            this.colorStates.contact[i3] = 0.3; this.colorStates.contact[i3 + 1] = 0.4; this.colorStates.contact[i3 + 2] = 0.7;
        }
    }

    // ── GSAP SCROLL TRIGGER ────────────────────────────────────────────────

    setupScrollTrigger() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.setupScrollTrigger(), 200);
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(this.material.uniforms.uProgress, {
            value: 5.0,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.0
            }
        });
    }

    // ── MOUSE INTERACTION & WINDOW RESIZE ──────────────────────────────────

    onMouseMove(e) {
        this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    }

    triggerClickShockwave(clientX, clientY) {
        if (!this.material || !this.material.uniforms) return;
        const nx = (clientX / window.innerWidth - 0.5) * 2;
        const ny = -(clientY / window.innerHeight - 0.5) * 2;
        this.material.uniforms.uClickPos.value.set(nx, ny);
        this.material.uniforms.uClickTime.value = 1.0;
    }

    onWindowResize() {
        if (!this.renderer || !this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }

    // ── RENDER LOOP ────────────────────────────────────────────────────────

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.015;
        this.material.uniforms.uTime.value = this.time;

        if (this.material && this.material.uniforms.uClickTime.value > 0.001) {
            this.material.uniforms.uClickTime.value *= 0.93;
        } else if (this.material) {
            this.material.uniforms.uClickTime.value = 0.0;
        }

        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

        this.material.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);

        this.camera.position.x = this.mouse.x * 4;
        this.camera.position.y = this.mouse.y * 4;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate engine when DOM is ready
let cosmicEngineInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    cosmicEngineInstance = new CosmicEngine();
});
