/**
 * Three.js environment
 * Animated wireframe terrain field sweeping toward the camera.
 */

class ThreeScene {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.points = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.clock = null;
        this.animationId = null;
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.cols = 110;
        this.rows = 62;
        this.spacing = 1.7;

        this.init();
    }

    init() {
        if (!this.canvas) return;
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded — falling back to CSS grid background');
            return;
        }

        try {
            this.setupScene();
            this.createTerrain();
            this.bindEvents();
            this.animate();
        } catch (error) {
            console.warn('WebGL terrain unavailable', error);
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x05070b, 24, 66);

        this.camera = new THREE.PerspectiveCamera(
            58,
            window.innerWidth / window.innerHeight,
            0.1,
            220
        );
        this.camera.position.set(0, 5.4, 15);
        this.camera.lookAt(0, 0.4, -14);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        this.renderer.setClearColor(0x000000, 0);

        this.clock = new THREE.Clock();
    }

    createTerrain() {
        const count = this.cols * this.rows;
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const near = new THREE.Color(0xc8ff45);
        const far = new THREE.Color(0x1f7f96);

        const width = this.cols * this.spacing;
        const depth = this.rows * this.spacing;

        let i = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const i3 = i * 3;

                const x = (col - this.cols / 2) * this.spacing;
                const z = 10 - row * this.spacing;

                positions[i3] = x;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = z;

                const depthRatio = row / this.rows;
                const color = near.clone().lerp(far, depthRatio * depthRatio);

                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;

                i++;
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.062,
            vertexColors: true,
            transparent: true,
            opacity: 0.82,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false,
            fog: true
        });

        this.points = new THREE.Points(geometry, material);
        this.points.frustumCulled = false;
        this.scene.add(this.points);

        this.basePositions = positions.slice();
        this.terrainWidth = width;
        this.terrainDepth = depth;

        this.applyTheme(document.documentElement.getAttribute('data-theme'));
    }

    bindEvents() {
        window.addEventListener('pointermove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (!this.renderer || !this.camera) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('themechange', (event) => {
            this.applyTheme(event.detail.theme);
        });
    }

    applyTheme(theme) {
        if (!this.points) return;

        const isLight = theme === 'light';
        const material = this.points.material;

        material.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
        material.opacity = isLight ? 0.45 : 0.82;

        if (this.scene.fog) {
            this.scene.fog.color.set(isLight ? 0xf3f4ef : 0x05070b);
        }

        const near = new THREE.Color(isLight ? 0x4a7a00 : 0xc8ff45);
        const far = new THREE.Color(isLight ? 0x8c99a6 : 0x1f7f96);
        const colors = this.points.geometry.attributes.color;
        const total = colors.count;

        for (let i = 0; i < total; i++) {
            const row = Math.floor(i / this.cols);
            const ratio = row / this.rows;
            const color = near.clone().lerp(far, ratio * ratio);
            colors.setXYZ(i, color.r, color.g, color.b);
        }

        colors.needsUpdate = true;
    }

    updateTerrain(time) {
        const positions = this.points.geometry.attributes.position;
        const array = positions.array;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const index = row * this.cols + col;
                const i3 = index * 3;

                const x = this.basePositions[i3];
                const z = this.basePositions[i3 + 2];

                const height =
                    Math.sin(x * 0.14 + time * 0.55) * 0.85 +
                    Math.cos(z * 0.2 + time * 0.4) * 0.7 +
                    Math.sin((x + z) * 0.09 + time * 0.25) * 0.45;

                const horizonFade = 0.35 + (1 - row / this.rows) * 0.65;
                array[i3 + 1] = height * horizonFade;
            }
        }

        positions.needsUpdate = true;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();

        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.045;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.045;

        if (this.points && !this.reduced) {
            this.updateTerrain(time);
        }

        this.camera.position.x = this.mouse.x * 1.8;
        this.camera.position.y = 5.4 + this.mouse.y * 0.5;
        this.camera.lookAt(0, 0.4, -14);

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.threeScene = new ThreeScene();
});
