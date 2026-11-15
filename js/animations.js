/**
 * Scroll Choreography
 * Reveals panels, fills HUD meters and runs numeric counters.
 * Uses IntersectionObserver so the page works without any animation library.
 */

class ScrollAnimations {
    constructor() {
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupReveals();
        this.setupCounters();
    }

    setupReveals() {
        const items = document.querySelectorAll('.reveal, .loadout-item, .player-card');

        if (!('IntersectionObserver' in window) || this.reduced) {
            items.forEach(el => el.classList.add('is-visible'));
            document.querySelector('.player-card')?.classList.add('is-live');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('player-card')) {
                    entry.target.classList.add('is-live');
                }
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '0px 0px -6% 0px',
            threshold: 0.12
        });

        items.forEach(el => observer.observe(el));
    }

    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const run = (el) => {
            const target = Number(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const pad = el.textContent.trim().replace(/[^0-9]/g, '').length || 2;

            if (this.reduced) {
                el.textContent = String(target).padStart(pad, '0') + suffix;
                return;
            }

            const duration = 1100;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = String(value).padStart(pad, '0') + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(run);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                run(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.6 });

        counters.forEach(el => observer.observe(el));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});
