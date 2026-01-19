/**
 * KONDRATJEVA BYGG - Main JavaScript
 * Professional Painting & Glazing Services
 * Oslo, Norway
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileNav = document.getElementById('mobileNav');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // ============================================
    // Mobile Navigation
    // ============================================
    function initMobileNav() {
        if (!mobileToggle || !mobileNav) return;

        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Show loading state
            submitButton.classList.add('loading');
            submitButton.textContent = 'Sender...';
            submitButton.disabled = true;

            // Gather form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                projectType: document.getElementById('projectType').value,
                area: document.getElementById('area').value,
                description: document.getElementById('description').value,
                siteVisit: document.getElementById('siteVisit').checked
            };

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);

                // Show success message
                showFormMessage('success', 'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis samme dag.');

                // Reset form
                contactForm.reset();

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                // Show error message
                showFormMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.');
            } finally {
                // Reset button
                submitButton.classList.remove('loading');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });

        // Form validation feedback
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });
    }

    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('invalid');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.classList.add('invalid');
                return false;
            }
        }

        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s+()-]{8,}$/;
            if (!phoneRegex.test(field.value)) {
                field.classList.add('invalid');
                return false;
            }
        }

        field.classList.remove('invalid');
        return true;
    }

    function showFormMessage(type, message) {
        if (!formMessage) return;

        formMessage.className = 'form-message ' + type;
        formMessage.textContent = message;
        formMessage.style.display = 'block';

        // Auto-hide success message after 10 seconds
        if (type === 'success') {
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    function simulateFormSubmission(data) {
        // This simulates a form submission
        // Replace with actual API call (e.g., Resend API)
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                // Log form data for debugging
                console.log('Form submitted:', data);

                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 1500);
        });
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .approach-card, .project-card, .testimonial');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            observer.observe(element);
        });
    }

    // ============================================
    // Click-to-Call on Mobile
    // ============================================
    function initClickToCall() {
        // Phone links are already set up with tel: protocol
        // This adds tracking or analytics if needed
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Track phone call clicks (add analytics here if needed)
                console.log('Phone call initiated');
            });
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(function(img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // Handle Hash Links on Page Load
    // ============================================
    function initHashScroll() {
        if (window.location.hash) {
            setTimeout(function() {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // ============================================
    // Current Year in Footer
    // ============================================
    function updateYear() {
        const yearElements = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();

        yearElements.forEach(function(element) {
            element.textContent = currentYear;
        });
    }

    // ============================================
    // Add CSS for invalid fields
    // ============================================
    function addValidationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.invalid,
            .form-group select.invalid,
            .form-group textarea.invalid {
                border-color: #e74c3c;
                box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // Service Worker Registration (optional)
    // ============================================
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Uncomment to enable service worker
                // navigator.serviceWorker.register('/sw.js')
                //     .then(function(registration) {
                //         console.log('SW registered:', registration);
                //     })
                //     .catch(function(error) {
                //         console.log('SW registration failed:', error);
                //     });
            });
        }
    }

    // ============================================
    // Initialize All Functions
    // ============================================
    function init() {
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollAnimations();
        initClickToCall();
        initLazyLoading();
        initHashScroll();
        updateYear();
        addValidationStyles();
        registerServiceWorker();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
