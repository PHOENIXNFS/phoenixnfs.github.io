/**
 * Main Entry Point
 * Handles navigation, video modal, and other UI interactions
 */

class Main {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.videoModal = document.getElementById('video-modal');
        this.videoIframe = document.getElementById('video-iframe');
        this.playButtons = document.querySelectorAll('.play-btn');
        this.navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupVideoModal();
        this.setupSmoothScroll();
        this.setupScrollEffects();
        this.setupDropdowns();
        this.setupSlideshows();
    }
    
    setupNavigation() {
        // Navbar scroll effect
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    setupMobileMenu() {
        if (!this.menuToggle || !this.mobileMenu) return;
        
        this.menuToggle.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('active');
            this.menuToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.menuToggle.querySelectorAll('span');
            if (this.mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
        
        // Close menu on link click
        this.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.menuToggle.classList.remove('active');
                
                const spans = this.menuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }
    
    setupVideoModal() {
        if (!this.videoModal) return;
        
        // Open modal on play button click
        this.playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const videoUrl = btn.getAttribute('data-video');
                if (videoUrl) {
                    this.openVideoModal(videoUrl);
                }
            });
        });
        
        // Close modal on close button click
        const closeBtn = this.videoModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeVideoModal());
        }
        
        // Close modal on backdrop click
        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) {
                this.closeVideoModal();
            }
        });
        
        // Close modal on Escape key
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
        // Handle youtu.be short URLs
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        // Handle youtube.com/watch URLs
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v');
            return `https://www.youtube.com/embed/${videoId}`;
        }
        // Already embed format
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
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Mobile Tools submenu
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
        
        // Close dropdowns on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
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
                timer = setInterval(() => show(index + 1), 5000);
            };
            
            if (prev) prev.addEventListener('click', () => { show(index - 1); start(); });
            if (next) next.addEventListener('click', () => { show(index + 1); start(); });
            
            dots.forEach((dot, n) => {
                dot.addEventListener('click', () => { show(n); start(); });
            });
            
            // Pause while the pointer or keyboard focus is on the slideshow
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
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    setupScrollEffects() {
        // Active nav link highlighting
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.main = new Main();
});
