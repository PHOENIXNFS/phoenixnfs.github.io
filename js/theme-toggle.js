/**
 * Theme Toggle
 * Handles dark/light mode switching with localStorage persistence
 */

class ThemeToggle {
    constructor() {
        this.toggleBtn = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.storageKey = 'portfolio-theme';
        
        this.init();
    }
    
    init() {
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem(this.storageKey) || 'dark';
        this.setTheme(savedTheme, false);
        
        // Add click event listener
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                const currentTheme = this.html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme, true);
            });
        }
        
        // Check system preference
        this.checkSystemPreference();
    }
    
    setTheme(theme, save = true) {
        this.html.setAttribute('data-theme', theme);
        
        if (save) {
            localStorage.setItem(this.storageKey, theme);
        }
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0f' : '#ffffff');
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    checkSystemPreference() {
        // Only check if no theme has been saved
        if (!localStorage.getItem(this.storageKey)) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light', false);
        }
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }
    
    getTheme() {
        return this.html.getAttribute('data-theme');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeToggle = new ThemeToggle();
});
