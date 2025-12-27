// ===================================
// ZENITH AMBIENT - PARTICLE EFFECTS
// Theme-based dynamic particle system
// ===================================

// Theme-specific particle configurations
const THEME_PARTICLES = {
    snow: {
        type: 'snow',
        count: 100,
        color: '#ffffff',
        size: { min: 2, max: 6 },
        speed: { min: 1, max: 3 },
        wind: 0.5,
        emoji: '❄️'
    },
    rain: {
        type: 'rain',
        count: 150,
        color: 'rgba(100, 150, 255, 0.6)',
        size: { min: 1, max: 2 },
        speed: { min: 15, max: 25 },
        wind: 2,
        emoji: null
    },
    fire: {
        type: 'fire',
        count: 60,
        color: '#ff6b35',
        size: { min: 3, max: 8 },
        speed: { min: 2, max: 5 },
        wind: 0,
        emoji: '🔥'
    },
    forest: {
        type: 'leaves',
        count: 30,
        color: '#22c55e',
        size: { min: 8, max: 15 },
        speed: { min: 1, max: 2 },
        wind: 1,
        emoji: '🍃'
    },
    ocean: {
        type: 'bubbles',
        count: 40,
        color: 'rgba(50, 180, 220, 0.3)',
        size: { min: 5, max: 15 },
        speed: { min: 1, max: 2 },
        wind: 0.3,
        emoji: null
    },
    sunset: {
        type: 'dust',
        count: 50,
        color: 'rgba(255, 150, 100, 0.4)',
        size: { min: 2, max: 4 },
        speed: { min: 0.3, max: 0.8 },
        wind: 0.2,
        emoji: null
    },
    aurora: {
        type: 'stars',
        count: 80,
        color: 'rgba(100, 255, 200, 0.6)',
        size: { min: 1, max: 3 },
        speed: { min: 0.1, max: 0.3 },
        wind: 0,
        emoji: '✨'
    },
    sakura: {
        type: 'petals',
        count: 40,
        color: '#ffc0cb',
        size: { min: 8, max: 14 },
        speed: { min: 1, max: 2 },
        wind: 1.5,
        emoji: '🌸'
    },
    galaxy: {
        type: 'stars',
        count: 150,
        color: '#ffffff',
        size: { min: 1, max: 3 },
        speed: { min: 0.05, max: 0.15 },
        wind: 0,
        emoji: '⭐'
    },
    autumn: {
        type: 'leaves',
        count: 35,
        color: '#cd853f',
        size: { min: 10, max: 18 },
        speed: { min: 1, max: 2.5 },
        wind: 1.2,
        emoji: '🍂'
    },
    neon: {
        type: 'glow',
        count: 25,
        color: 'rgba(200, 100, 255, 0.6)',
        size: { min: 5, max: 15 },
        speed: { min: 0.5, max: 1.5 },
        wind: 0,
        emoji: null
    },
    desert: {
        type: 'dust',
        count: 60,
        color: 'rgba(200, 180, 140, 0.4)',
        size: { min: 1, max: 3 },
        speed: { min: 2, max: 4 },
        wind: 3,
        emoji: null
    },
    storm: {
        type: 'rain',
        count: 200,
        color: 'rgba(150, 150, 255, 0.5)',
        size: { min: 2, max: 3 },
        speed: { min: 20, max: 35 },
        wind: 5,
        emoji: null
    },
    retro: {
        type: 'grid',
        count: 30,
        color: 'rgba(0, 255, 255, 0.3)',
        size: { min: 2, max: 4 },
        speed: { min: 0.5, max: 1 },
        wind: 0,
        emoji: null
    }
};

class ThemeParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.currentTheme = null;
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
    }

    init() {
        this.container = document.getElementById('particles-container');
        if (!this.container) return;

        // Create canvas for smooth rendering
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setTheme(themeName) {
        if (this.currentTheme === themeName) return;
        this.currentTheme = themeName;
        this.stop();

        const config = THEME_PARTICLES[themeName];
        if (config) {
            this.createParticles(config);
            this.start();
        }
    }

    createParticles(config) {
        this.particles = [];

        for (let i = 0; i < config.count; i++) {
            this.particles.push(this.createParticle(config));
        }
    }

    createParticle(config) {
        const size = config.size.min + Math.random() * (config.size.max - config.size.min);
        const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);

        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: size,
            speed: speed,
            wind: config.wind,
            color: config.color,
            type: config.type,
            emoji: config.emoji,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            opacity: 0.3 + Math.random() * 0.7,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03
        };
    }

    start() {
        if (!this.ctx) return;
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.particles = [];
    }

    animate() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            this.updateParticle(p);
            this.drawParticle(p);

            // Reset if off screen
            if (this.isOffScreen(p)) {
                this.resetParticle(p, index);
            }
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateParticle(p) {
        switch (p.type) {
            case 'snow':
            case 'petals':
            case 'leaves':
                p.wobble += p.wobbleSpeed;
                p.y += p.speed;
                p.x += Math.sin(p.wobble) * 0.5 + p.wind;
                p.rotation += p.rotationSpeed;
                break;

            case 'rain':
                p.y += p.speed;
                p.x += p.wind;
                break;

            case 'fire':
                p.y -= p.speed;
                p.x += Math.sin(p.wobble) * 0.3;
                p.wobble += p.wobbleSpeed;
                p.opacity = Math.max(0, p.opacity - 0.005);
                if (p.opacity <= 0) {
                    p.y = this.canvas.height + 10;
                    p.opacity = 0.8;
                }
                break;

            case 'bubbles':
                p.y -= p.speed;
                p.x += Math.sin(p.wobble) * 0.5;
                p.wobble += p.wobbleSpeed;
                break;

            case 'stars':
                p.opacity = 0.3 + Math.abs(Math.sin(p.wobble)) * 0.7;
                p.wobble += p.wobbleSpeed;
                break;

            case 'dust':
                p.x += p.wind + Math.sin(p.wobble) * 0.2;
                p.y += Math.sin(p.wobble * 0.5) * 0.2;
                p.wobble += p.wobbleSpeed;
                break;

            case 'glow':
                p.wobble += p.wobbleSpeed;
                p.x += Math.sin(p.wobble) * 0.5;
                p.y += Math.cos(p.wobble * 0.7) * 0.3;
                p.size = p.size + Math.sin(p.wobble * 2) * 0.5;
                break;

            case 'grid':
                p.y += p.speed;
                p.opacity = 0.2 + Math.abs(Math.sin(p.wobble)) * 0.3;
                p.wobble += p.wobbleSpeed;
                break;
        }
    }

    drawParticle(p) {
        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;

        if (p.emoji && (p.type === 'snow' || p.type === 'petals' || p.type === 'leaves' || p.type === 'fire')) {
            // Draw emoji particles
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.font = `${p.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.emoji, 0, 0);
        } else if (p.type === 'rain') {
            // Draw rain drops as lines
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = p.size;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.wind * 2, p.y + p.speed);
            this.ctx.stroke();
        } else if (p.type === 'bubbles') {
            // Draw bubbles
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.stroke();
        } else if (p.type === 'glow') {
            // Draw glowing circles
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Draw circles for other types
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    isOffScreen(p) {
        const margin = 50;
        if (p.type === 'fire' || p.type === 'bubbles') {
            return p.y < -margin;
        }
        return p.y > this.canvas.height + margin ||
            p.x < -margin ||
            p.x > this.canvas.width + margin;
    }

    resetParticle(p, index) {
        const config = THEME_PARTICLES[this.currentTheme];
        if (!config) return;

        switch (p.type) {
            case 'rain':
            case 'snow':
            case 'leaves':
            case 'petals':
                p.x = Math.random() * this.canvas.width;
                p.y = -20;
                break;

            case 'fire':
                p.x = this.canvas.width * 0.3 + Math.random() * this.canvas.width * 0.4;
                p.y = this.canvas.height + 10;
                p.opacity = 0.8;
                break;

            case 'bubbles':
                p.x = Math.random() * this.canvas.width;
                p.y = this.canvas.height + 10;
                break;

            case 'dust':
                p.x = -20;
                p.y = Math.random() * this.canvas.height;
                break;

            default:
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
        }

        p.opacity = 0.3 + Math.random() * 0.7;
    }
}

// Legacy particle system for sound-based effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
    }

    init() {
        this.container = document.getElementById('particles-container');
    }

    updateFromSounds(activeSounds) {
        // This can be extended to add sound-specific effects
    }
}

// Zen mode canvas animation
class ZenCanvas {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.stars = [];
    }

    init() {
        this.canvas = document.getElementById('zen-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create stars
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                opacity: Math.random(),
                speed: 0.01 + Math.random() * 0.02
            });
        }
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.ctx) return;

        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#0a0a14');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animate stars
        this.stars.forEach(star => {
            star.opacity += star.speed;
            if (star.opacity > 1 || star.opacity < 0) {
                star.speed *= -1;
            }

            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity)})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Create global instances
const themeParticles = new ThemeParticleSystem();
const particleSystem = new ParticleSystem();
const zenCanvas = new ZenCanvas();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    themeParticles.init();
    particleSystem.init();
});

// Export
window.themeParticles = themeParticles;
window.particleSystem = particleSystem;
window.zenCanvas = zenCanvas;
window.THEME_PARTICLES = THEME_PARTICLES;
