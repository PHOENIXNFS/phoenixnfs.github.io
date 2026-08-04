/**
 * Contact Form Handler
 * Handles form validation and submission
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.status = document.getElementById('form-status');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.getAttribute('name');
        let isValid = true;
        let message = '';
        
        // Required check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.capitalizeFirst(name)} is required`;
        }
        
        // Email validation
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        
        // Message length
        if (name === 'message' && value && value.length < 10) {
            isValid = false;
            message = 'Message must be at least 10 characters';
        }
        
        if (!isValid) {
            this.showError(field, message);
        } else {
            this.clearError(field);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        field.style.borderColor = '#ef4444';
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 4px;
            display: block;
        `;
        field.parentElement.appendChild(errorEl);
    }
    
    clearError(field) {
        field.style.borderColor = '';
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const fields = this.form.querySelectorAll('input, textarea');
        let allValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            this.showStatus('Please fix the errors above', 'error');
            return;
        }
        
        // Disable submit button
        this.setSubmitLoading(true);
        
        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission (replace with actual endpoint)
        try {
            await this.submitForm(data);
            this.showStatus('Thank you! Your message has been sent.', 'success');
            this.form.reset();
        } catch (error) {
            this.showStatus('Something went wrong. Please try again later.', 'error');
        } finally {
            this.setSubmitLoading(false);
        }
    }
    
    async submitForm(data) {
        // Formspree endpoint - Replace YOUR_FORM_ID with your Formspree form ID
        const formspreeUrl = 'https://formspree.io/f/mdennaey';
        
        const response = await fetch(formspreeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Form submission failed');
        }
        
        return response.json();
    }
    
    showStatus(message, type) {
        if (!this.status) return;
        
        this.status.textContent = message;
        this.status.className = `form-status ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.status.className = 'form-status';
            this.status.textContent = '';
        }, 5000);
    }
    
    setSubmitLoading(loading) {
        if (!this.submitBtn) return;
        
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="30 60" stroke-dashoffset="0">
                        <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = `
                <span>Send Message</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
        }
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});
