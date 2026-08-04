/**
 * Three.js 3D Background Scene
 * Creates an interactive particle system that responds to mouse movement
 */

class ThreeScene {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.clock = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded');
            return;
        }
        
        this.setupScene();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Clock
        this.clock = new THREE.Clock();
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 500 : 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Accent color (6c63ff)
        const accentColor = new THREE.Color(0x6c63ff);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position - spread particles in a sphere
            const radius = 10 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) - 5;
            
            // Color - mix between white and accent color
            const mixRatio = Math.random();
            colors[i3] = mixRatio * accentColor.r;
            colors[i3 + 1] = mixRatio * accentColor.g;
            colors[i3 + 2] = mixRatio * accentColor.b;
            
            // Size
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Material
        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Points
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    setupEventListeners() {
        // Mouse move
        window.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            this.camera.position.y = -scrollY * 0.001;
        });
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Smooth mouse movement
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.05;
            this.particles.rotation.x = elapsedTime * 0.02;
            
            // Mouse influence
            this.particles.rotation.y += this.mouse.x * 0.1;
            this.particles.rotation.x += this.mouse.y * 0.1;
            
            // Subtle pulse effect
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + positions[i] * 0.1) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Camera movement
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.threeScene = new ThreeScene();
});
