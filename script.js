document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas background
    const canvas = document.getElementById('gradient-canvas');
    const ctx = canvas.getContext('2d');
    
    // Enhanced space-themed color palette
    const colorScheme = [
        [5, 5, 25],     // Deep space
        [15, 25, 50],   // Cosmic blue
        [25, 15, 45],   // Purple nebula
        [10, 30, 60],   // Bright cosmic
        [20, 40, 80],   // Electric blue
        [30, 20, 70],   // Purple space
        [5, 20, 40],    // Deep blue
        [15, 35, 85]    // Brilliant blue
    ];
    
    let particles = [];
    const numParticles = 50;
    
    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.2,
            color: colorScheme[Math.floor(Math.random() * colorScheme.length)]
        });
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawNebula(timestamp) {
        if (!ctx || !canvas) return;
        
        const { width, height } = canvas;
        const time = timestamp * 0.0001;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(0, 0, width, height);
        
        // Create multiple nebula layers
        for (let layer = 0; layer < 3; layer++) {
            const layerTime = time + layer * 0.3;
            const flowX = Math.sin(layerTime * 0.5) * width * 0.1;
            const flowY = Math.cos(layerTime * 0.3) * height * 0.1;
            
            const gradient = ctx.createRadialGradient(
                width * 0.5 + flowX,
                height * 0.5 + flowY,
                0,
                width * 0.5 + flowX,
                height * 0.5 + flowY,
                Math.max(width, height) * 0.8
            );
            
            const colorIndex = (layer * 2) % colorScheme.length;
            const color = colorScheme[colorIndex];
            const nextColor = colorScheme[(colorIndex + 1) % colorScheme.length];
            
            const wave = Math.sin(layerTime) * 0.1;
            const r1 = Math.max(0, Math.min(255, color[0] + wave * 10));
            const g1 = Math.max(0, Math.min(255, color[1] + wave * 15));
            const b1 = Math.max(0, Math.min(255, color[2] + wave * 20));
            
            const r2 = Math.max(0, Math.min(255, nextColor[0] + wave * 5));
            const g2 = Math.max(0, Math.min(255, nextColor[1] + wave * 10));
            const b2 = Math.max(0, Math.min(255, nextColor[2] + wave * 15));
            
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${0.1 - layer * 0.02})`);
            gradient.addColorStop(0.5, `rgba(${r2}, ${g2}, ${b2}, ${0.05 - layer * 0.01})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;
            
            const pulseOpacity = particle.opacity + Math.sin(time * 2 + particle.x * 0.01) * 0.3;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particle.color[0] + 50}, ${particle.color[1] + 100}, ${particle.color[2] + 150}, ${pulseOpacity})`;
            ctx.fill();
            
            // Add particle glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particle.color[0] + 100}, ${particle.color[1] + 150}, ${particle.color[2] + 200}, ${pulseOpacity * 0.2})`;
            ctx.fill();
        });
        
        requestAnimationFrame(drawNebula);
    }
    
    requestAnimationFrame(drawNebula);
    
    // Video player functionality
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            // 使用Bilibili视频链接
            const videoUrl = 'https://www.bilibili.com/video/BV1zbuPzHEZS/?spm_id_from=333.1387.homepage.video_card.click&vd_source=fe2dde1eac0a47ba0201d2a71bacd79e';
            
            // 创建模态窗口来播放视频
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(10px);
            `;
            
            const videoContainer = document.createElement('div');
            videoContainer.style.cssText = `
                width: 90%;
                max-width: 800px;
                aspect-ratio: 16/9;
                background: #000;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            `;
            
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: -50px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 40px;
                cursor: pointer;
                z-index: 1001;
            `;
            
            // 使用iframe嵌入Bilibili视频
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
            `;
            
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            videoContainer.appendChild(iframe);
            modal.appendChild(closeButton);
            modal.appendChild(videoContainer);
            document.body.appendChild(modal);
        });
    }
    
    // Download button functionality
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.platform;
            const btnText = button.querySelector('.btn-text strong');
            const originalText = btnText.textContent;
            
            // 检查是否为 Mac 平台
            if (platform === 'mac') {
                // Mac 版本显示 Coming Soon 提示
                btnText.textContent = 'Coming Soon';
                button.style.transform = 'scale(0.98)';
                
                // 创建提示弹窗
                const alert = document.createElement('div');
                alert.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(240, 245, 255, 0.95);
                    color: #1a1a2e;
                    padding: 40px;
                    border-radius: 15px;
                    text-align: center;
                    z-index: 1000;
                    backdrop-filter: blur(15px);
                    border: 2px solid rgba(100, 181, 246, 0.3);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    max-width: 400px;
                `;
                
                alert.innerHTML = `
                    <h3 style="margin: 0 0 15px 0; color: #1565c0; font-size: 24px; font-weight: 600;">Mac Version Coming Soon</h3>
                    <p style="margin: 0 0 20px 0; color: #37474f; font-size: 16px; line-height: 1.5;">The Mac version is currently in development.</p>
                    <p style="margin: 0; color: #1976d2; font-size: 14px; font-weight: 500;">Please try the Windows version first</p>
                `;
                
                document.body.appendChild(alert);
                
                // 3秒后自动关闭提示
                setTimeout(() => {
                    document.body.removeChild(alert);
                    btnText.textContent = originalText;
                    button.style.transform = '';
                }, 3000);
                
                return; // 不执行后续的下载逻辑
            }
            
            // Windows 版本的正常下载逻辑
            btnText.textContent = 'Downloading...';
            button.style.transform = 'scale(0.98)';
            
            const downloadLinks = {
                windows: './downloads/mr-terrific-win.exe'
            };
            
            setTimeout(() => {
                // Simulate download
                const link = document.createElement('a');
                link.href = downloadLinks[platform];
                link.download = 'mr-terrific-win.exe';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Reset button
                setTimeout(() => {
                    btnText.textContent = originalText;
                    button.style.transform = '';
                }, 2000);
            }, 1000);
        });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        const floatingOrbs = document.querySelectorAll('.floating-orb');
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        floatingOrbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});