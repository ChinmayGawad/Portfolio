// Vivid Dark Hacker Matrix Background Animation
(function () {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Hacker, binary & tech symbols
    const chars = '0123456789ABCDEF01</>{}[]();=>_$&*+~#@root$exec_kt_java_cpp_py';
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
        // Deep black background with slight alpha fade for glowing trail
        const isLight = document.documentElement.classList.contains('light-theme');
        ctx.fillStyle = isLight ? 'rgba(240, 253, 244, 0.15)' : 'rgba(3, 7, 18, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px "JetBrains Mono", "Fira Code", monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Leading drop character glows white/cyan, body is vivid neon green
            if (Math.random() > 0.95) {
                ctx.fillStyle = isLight ? '#0284c7' : '#ffffff'; // Leading white head
            } else if (Math.random() > 0.8) {
                ctx.fillStyle = isLight ? '#059669' : '#00ff66'; // Neon Matrix Green
            } else {
                ctx.fillStyle = isLight ? 'rgba(5, 150, 105, 0.3)' : 'rgba(0, 255, 102, 0.25)'; // Matrix green tail
            }

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
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
