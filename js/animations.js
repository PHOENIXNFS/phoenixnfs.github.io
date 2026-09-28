/**
 * GSAP Scroll Animations
 * Handles all scroll-triggered animations using GSAP and ScrollTrigger
 */

class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }
        
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize animations
        this.heroAnimations();
        this.sectionAnimations();
        this.gameCardAnimations();
        this.pluginAnimations();
        this.contactAnimations();
    }
    
    heroAnimations() {
        const heroTimeline = gsap.timeline({ delay: 0.3 });
        
        heroTimeline
            .to('.hero-greeting', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            })
            .to('.hero-name', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3')
            .to('.hero-title', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4')
            .to('.hero-description', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.3')
            .to('.hero-cta', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.3')
            .to('.hero-social', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.3');
    }
    
    sectionAnimations() {
        // About section
        gsap.to('#about .section-title', {
            scrollTrigger: {
                trigger: '#about .section-title',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('.about-text p', {
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        });
        
        gsap.to('.skill-item', {
            scrollTrigger: {
                trigger: '.skills-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        // Games section
        gsap.to('#games .section-title', {
            scrollTrigger: {
                trigger: '#games .section-title',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('#games .section-subtitle', {
            scrollTrigger: {
                trigger: '#games .section-subtitle',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        // Projects section
        gsap.to('#projects .section-title', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('#projects .section-subtitle', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            ease: 'power3.out'
        });
        
        gsap.to('.project-card', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });
        
        // Plugin section
        gsap.to('#plugin .section-title', {
            scrollTrigger: {
                trigger: '#plugin .section-title',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        // Contact section
        gsap.to('#contact .section-title', {
            scrollTrigger: {
                trigger: '#contact .section-title',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('#contact .section-subtitle', {
            scrollTrigger: {
                trigger: '#contact .section-subtitle',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
    }
    
    gameCardAnimations() {
        gsap.to('.game-card', {
            scrollTrigger: {
                trigger: '.games-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: {
                each: 0.15,
                from: 'start'
            },
            ease: 'power3.out'
        });
    }
    
    pluginAnimations() {
        gsap.to('.plugin-description-full', {
            scrollTrigger: {
                trigger: '.plugin-description-full',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('.plugin-video', {
            scrollTrigger: {
                trigger: '.plugin-layout',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.to('.plugin-features-grid .feature-item', {
            scrollTrigger: {
                trigger: '.plugin-features-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
    
    contactAnimations() {
        gsap.to('.contact-form-container', {
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        gsap.to('.info-card', {
            scrollTrigger: {
                trigger: '.contact-info',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});
