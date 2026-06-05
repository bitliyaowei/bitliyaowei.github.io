// 设备判断：仅 PC 端显示雪花
if (!/phone|pad|pod|iphone|ipod|ios|ipad|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|webos|symbian|windows phone/i.test(navigator.userAgent)) {

    // 插入全屏画布
    document.write('<canvas id="snow-canvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;pointer-events:none"></canvas>');

    // 雪花动画主程序
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');

        // ================== 可配置参数 ==================
        const config = {
            flakeCount: 22,      // 雪花数量
            mouseRepelDist: 120, // 鼠标排斥距离
            color: '255,255,255',// 雪花颜色 RGB
            baseSize: 0.9,       // 基础大小
            baseSpeed: 0.22,      // 下落速度
            baseOpacity: 0.32,   // 透明度
            driftStep: 0.35      // 左右摆动幅度
        };

        // 兼容 requestAnimationFrame
        const raf = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    (cb => setTimeout(cb, 1000/60));

        let canvasW = window.innerWidth;
        let canvasH = window.innerHeight;
        let mouseX = -100;
        let mouseY = -100;
        let snowflakes = [];

        // 设置画布尺寸
        function resizeCanvas() {
            canvasW = window.innerWidth;
            canvasH = window.innerHeight;
            canvas.width = canvasW;
            canvas.height = canvasH;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 记录鼠标位置
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 创建单个雪花
        function createSnowflake() {
            return {
                x: Math.random() * canvasW,
                y: Math.random() * canvasH,
                size: Math.random() * 3 + config.baseSize,
                speed: Math.random() * 1 + config.baseSpeed,
                velX: 0,
                velY: Math.random() * 1 + config.baseSpeed,
                opacity: Math.random() * 0.5 + config.baseOpacity,
                step: 0,
                stepSize: Math.random() / 30 * config.driftStep
            };
        }

        // 初始化所有雪花
        function initSnow() {
            snowflakes = [];
            for (let i = 0; i < config.flakeCount; i++) {
                snowflakes.push(createSnowflake());
            }
        }

        // 雪花超出边界后重置
        function resetFlake(flake) {
            flake.x = Math.random() * canvasW;
            flake.y = 0;
            flake.size = Math.random() * 3 + config.baseSize;
            flake.speed = Math.random() * 1 + config.baseSpeed;
            flake.velY = flake.speed;
            flake.velX = 0;
            flake.opacity = Math.random() * 0.5 + config.baseOpacity;
        }

        // 每一帧渲染
        function render() {
            ctx.clearRect(0, 0, canvasW, canvasH);

            for (let flake of snowflakes) {
                // 计算鼠标距离
                const dx = mouseX - flake.x;
                const dy = mouseY - flake.y;
                const dist = Math.hypot(dx, dy);

                // 鼠标排斥效果
                if (dist < config.mouseRepelDist) {
                    const angle = Math.atan2(dy, dx);
                    const force = config.mouseRepelDist / (dist * dist) / 2;
                    flake.velX -= Math.cos(angle) * force;
                    flake.velY -= Math.sin(angle) * force;
                } else {
                    // 自然飘落
                    flake.velX *= 0.98;
                    if (flake.velY < flake.speed) {
                        flake.velY += 0.01;
                    }
                    flake.step += 0.05;
                    flake.velX += Math.cos(flake.step) * flake.stepSize;
                }

                // 更新位置
                flake.x += flake.velX;
                flake.y += flake.velY;

                // 边界判断
                if (flake.y > canvasH || flake.x < 0 || flake.x > canvasW) {
                    resetFlake(flake);
                }

                // 绘制雪花
                ctx.fillStyle = `rgba(${config.color}, ${flake.opacity})`;
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
                ctx.fill();
            }

            raf(render);
        }

        // 启动
        initSnow();
        render();
    });
}