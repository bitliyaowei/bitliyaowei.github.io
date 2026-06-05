// 全屏彩色粒子连线背景（自适应深色/浅色模式 + 鼠标交互）
(function () {
    // ====================== 配置项（可自行调整） ======================
    const config = {
        particleCount: window.innerWidth < 768 ? 40 : 80, // 粒子数量（手机少，PC多）
        connectionDistance: 140,                         // 粒子连线最大距离
        mouseDistance: 200,                              // 鼠标感应距离
        zIndex: -1                                        // 画布层级（不遮挡页面）
    };

    // ====================== 创建画布样式 ======================
    const style = document.createElement('style');
    style.textContent = `
        #particle-bg-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: block;
            pointer-events: none; /* 鼠标穿透，不影响点击 */
            z-index: ${config.zIndex};
        }
    `;
    document.head.appendChild(style);

    // ====================== 创建画布 ======================
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-bg-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };

    // ====================== 检测系统主题（深色/浅色） ======================
    function getTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // ====================== 窗口大小变化时重置画布 ======================
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // ====================== 粒子类 ======================
    class Particle {
        constructor() {
            this.x = Math.random() * width;        // 随机X坐标
            this.y = Math.random() * height;       // 随机Y坐标
            this.vx = (Math.random() - 0.5) * 1;    // X轴移动速度
            this.vy = (Math.random() - 0.5) * 1;    // Y轴移动速度
            this.size = Math.random() * 2 + 1;      // 粒子大小
            this.hue = Math.random() * 360;         // 色相（0-360，彩色）
            this.saturation = 80;                   // 饱和度
        }

        // 更新粒子位置 + 鼠标交互
        update() {
            // 粒子移动
            this.x += this.vx;
            this.y += this.vy;

            // 边界反弹
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // 鼠标排斥效果
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.hypot(dx, dy);

                if (distance < config.mouseDistance) {
                    const force = (config.mouseDistance - distance) / config.mouseDistance;
                    this.x -= (dx / distance) * force * 3;
                    this.y -= (dy / distance) * force * 3;
                }
            }
        }

        // 绘制粒子
        draw() {
            const theme = getTheme();
            const lightness = theme === 'light' ? '50%' : '60%';
            this.color = `hsl(${this.hue}, ${this.saturation}%, ${lightness})`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // ====================== 初始化粒子 ======================
    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? 40 : 80;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    // ====================== 动画主循环 ======================
    function animateParticles() {
        ctx.clearRect(0, 0, width, height); // 清空画布

        // 遍历所有粒子
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            // 粒子之间连线
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                if (distance < config.connectionDistance) {
                    const opacity = 1 - distance / config.connectionDistance;
                    ctx.beginPath();
                    ctx.strokeStyle = p1.color;
                    ctx.globalAlpha = opacity * 0.6;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    // ====================== 监听事件 ======================
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // ====================== 启动 ======================
    resize();
    initParticles();
    animateParticles();
})();