/**
 * Main controller
 * Navigation, mobile menu, trailer modal, slideshows, HUD readouts.
 */

class Main {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.videoModal = document.getElementById('video-modal');
        this.videoIframe = document.getElementById('video-iframe');
        this.playButtons = document.querySelectorAll('.play-btn');
        this.navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
        this.scrollBar = document.getElementById('scroll-bar');
        this.roleText = document.getElementById('role-text');
        this.glow = document.querySelector('.cursor-glow');
        this.playerCard = document.getElementById('player-card');
        this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupVideoModal();
        this.setupSmoothScroll();
        this.setupScrollEffects();
        this.setupDropdowns();
        this.setupDownloadMenus();
        this.setupSlideshows();
        this.setupRoleTicker();
        this.setupCursorGlow();
        this.setupCardTilt();
        this.setupFeatureSpotlight();
    }

    setupNavigation() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    setupMobileMenu() {
        if (!this.menuToggle || !this.mobileMenu) return;

        const resetHamburger = () => {
            const spans = this.menuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        };

        this.menuToggle.addEventListener('click', () => {
            const isOpen = this.mobileMenu.classList.toggle('active');
            this.menuToggle.classList.toggle('active', isOpen);

            const spans = this.menuToggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                resetHamburger();
            }
        });

        this.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.menuToggle.classList.remove('active');
                resetHamburger();
            });
        });
    }

    setupVideoModal() {
        if (!this.videoModal) return;

        this.playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = btn.getAttribute('data-video');
                if (videoUrl) this.openVideoModal(videoUrl);
            });
        });

        const closeBtn = this.videoModal.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeVideoModal());

        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) this.closeVideoModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoModal.classList.contains('active')) {
                this.closeVideoModal();
            }
        });
    }

    openVideoModal(url) {
        const embedUrl = this.getEmbedUrl(url);
        this.videoIframe.src = embedUrl + '?autoplay=1';
        this.videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    getEmbedUrl(url) {
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v');
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    }

    closeVideoModal() {
        this.videoModal.classList.remove('active');
        this.videoIframe.src = '';
        document.body.style.overflow = '';
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdown.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });

            dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    dropdown.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        });

        document.addEventListener('click', (e) => {
            dropdowns.forEach(dropdown => {
                if (dropdown.contains(e.target)) return;
                dropdown.classList.remove('open');
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.querySelectorAll('.mobile-submenu').forEach(submenu => {
            const toggle = submenu.querySelector('.mobile-submenu-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', () => {
                const isOpen = submenu.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen);
            });

            submenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    submenu.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    setupDownloadMenus() {
        const menus = document.querySelectorAll('.cv-menu');
        if (!menus.length) return;

        menus.forEach(menu => {
            const trigger = menu.querySelector('.cv-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.toggle('open');
                trigger.setAttribute('aria-expanded', String(isOpen));
            });

            menu.querySelectorAll('.cv-menu-list a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('open');
                    trigger.setAttribute('aria-expanded', 'false');
                });
            });
        });

        document.addEventListener('click', (e) => {
            menus.forEach(menu => {
                if (menu.contains(e.target)) return;
                menu.classList.remove('open');
                const trigger = menu.querySelector('.cv-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            menus.forEach(menu => {
                menu.classList.remove('open');
                const trigger = menu.querySelector('.cv-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    setupSlideshows() {
        document.querySelectorAll('.slideshow').forEach(root => {
            const slides = Array.from(root.querySelectorAll('.slide'));
            const dots = Array.from(root.querySelectorAll('.slide-dot'));
            const prev = root.querySelector('.slide-prev');
            const next = root.querySelector('.slide-next');

            if (slides.length < 2) return;

            let index = 0;
            let timer = null;

            const show = (i) => {
                index = (i + slides.length) % slides.length;
                slides.forEach((slide, n) => slide.classList.toggle('active', n === index));
                dots.forEach((dot, n) => dot.classList.toggle('active', n === index));
            };

            const stop = () => {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            };

            const start = () => {
                stop();
                if (this.reduced) return;
                timer = setInterval(() => show(index + 1), 5000);
            };

            if (prev) prev.addEventListener('click', () => { show(index - 1); start(); });
            if (next) next.addEventListener('click', () => { show(index + 1); start(); });

            dots.forEach((dot, n) => {
                dot.addEventListener('click', () => { show(n); start(); });
            });

            root.addEventListener('mouseenter', stop);
            root.addEventListener('mouseleave', start);
            root.addEventListener('focusin', stop);
            root.addEventListener('focusout', start);

            start();
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const navHeight = this.navbar ? this.navbar.offsetHeight : 0;
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

                window.scrollTo({
                    top: offsetTop,
                    behavior: this.reduced ? 'auto' : 'smooth'
                });
            });
        });
    }

    setupScrollEffects() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-links > a');

        const syncProgress = () => {
            if (!this.scrollBar) return;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = max > 0 ? window.scrollY / max : 0;
            this.scrollBar.style.width = `${Math.min(ratio * 100, 100)}%`;
        };

        let queued = false;
        const onScroll = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                syncProgress();
                highlight();
            });
        };

        const highlight = () => {
            const line = window.scrollY + (this.navbar ? this.navbar.offsetHeight : 0) + 90;
            let current = '';

            sections.forEach(section => {
                if (line >= section.offsetTop) current = section.id;
            });

            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        syncProgress();
        highlight();
    }

    setupRoleTicker() {
        if (!this.roleText) return;

        const roles = [
            'Gameplay Systems Programmer',
            'Unreal Engine 5 Specialist',
            'Procedural Systems Engineer',
            'Unity / C# Developer'
        ];

        if (this.reduced) return;

        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = false;

        const tick = () => {
            const current = roles[roleIndex];

            if (!deleting) {
                charIndex++;
                this.roleText.textContent = current.slice(0, charIndex);

                if (charIndex >= current.length) {
                    deleting = true;
                    setTimeout(tick, 2200);
                    return;
                }
                setTimeout(tick, 55);
            } else {
                charIndex--;
                this.roleText.textContent = current.slice(0, charIndex);

                if (charIndex <= 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(tick, 260);
                    return;
                }
                setTimeout(tick, 28);
            }
        };

        setTimeout(tick, 2400);
    }

    setupCursorGlow() {
        if (!this.glow || this.reduced) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            this.glow.style.display = 'none';
            return;
        }

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let targetX = x;
        let targetY = y;

        window.addEventListener('pointermove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        }, { passive: true });

        const render = () => {
            x += (targetX - x) * 0.08;
            y += (targetY - y) * 0.08;
            this.glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    setupFeatureSpotlight() {
        // Tiles expand on hover; the pointer also drives an accent spotlight.
        document.querySelectorAll('.feature-item').forEach(tile => {
            tile.addEventListener('pointermove', (e) => {
                const rect = tile.getBoundingClientRect();
                tile.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                tile.style.setProperty('--my', `${e.clientY - rect.top}px`);
            }, { passive: true });
        });
    }

    setupCardTilt() {
        if (!this.playerCard || this.reduced) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        const strength = 7;

        this.playerCard.addEventListener('pointermove', (e) => {
            const rect = this.playerCard.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;

            this.playerCard.style.transform =
                `perspective(900px) rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-3px)`;
        });

        this.playerCard.addEventListener('pointerleave', () => {
            this.playerCard.style.transform = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.main = new Main();
});
