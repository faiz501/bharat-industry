// Main JavaScript for Nakoda Metal Industries Website
// Handles navigation, smooth scrolling, and core interactions

class NakodaMetalIndustries {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNavigation();
        this.initializeScrollEffects();
        this.initializeBackToTop();
        this.initializeProductFilters();
        this.initializeTeamCards();
        this.initializeScrollIndicator();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.handleDOMReady();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.handleWindowLoad();
        });

        // Scroll Events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps

        // Resize Events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleDOMReady() {
        // Initialize components that need DOM to be ready
        this.updateActiveNavLink();
        this.setupMobileMenu();
        this.initializeCounters();
        console.log('Nakoda Metal Industries website initialized');
    }

    handleWindowLoad() {
        // Handle actions after all resources are loaded
        this.hideLoadingStates();
        this.initializePerformanceOptimizations();
    }

    initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only handle internal links (starting with #)
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);

                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });

        // Update active link on scroll
        this.setupIntersectionObserver();
    }

    // Add this to the BharatIndustries class in main.js

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New content available, show update notification
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #B87333; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 10000; max-width: 300px;">
      <p style="margin: 0 0 10px 0; font-weight: 600;">Update Available</p>
      <p style="margin: 0 0 15px 0; font-size: 14px;">A new version of the website is available.</p>
      <button onclick="window.location.reload()" style="background: white; color: #B87333; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">Update Now</button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 8px;">Later</button>
    </div>
  `;
        document.body.appendChild(notification);
    }


    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (!hamburger || !navMenu) return;

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (!hamburger || !navMenu) return;

        const isActive = navMenu.classList.contains('active');

        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Update ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', !isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId = null) {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const id = href.substring(1); // Remove the #

            if (activeId === id) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const scrollY = window.scrollY;

        // Add scrolled class to navbar
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update back to top button
        this.updateBackToTop();

        // Update scroll progress for animations
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('scrollProgress', {
            detail: { percent: scrollPercent, scrollTop }
        }));
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const elementPosition = element.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    initializeScrollEffects() {
        // Add scroll-triggered animations for elements without AOS
        const elements = document.querySelectorAll('.scroll-animate');

        if (elements.length === 0) return;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => scrollObserver.observe(el));
    }

    initializeBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        if (!backToTopBtn) return;

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    updateBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        if (!backToTopBtn) return;

        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            if (isNaN(target)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, 0, target, 2000);
                        observer.unobserve(counter);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d\s]/g, ''); // Extract non-digit characters

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    initializeProductFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.filter-item');
        const productsContainer = document.getElementById('products-container');

        if (filterBtns.length === 0 || productCards.length === 0) return;

        // Add loading class initially
        productsContainer.classList.add('products-loading');

        // Remove loading after page load and AOS initialization
        setTimeout(() => {
            productsContainer.classList.remove('products-loading');
            // Refresh AOS after initial load
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 1000);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const filter = btn.getAttribute('data-filter');

                // Prevent multiple clicks during animation
                if (productsContainer.classList.contains('products-filtering')) return;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Add filtering class to disable AOS during filtering
                productsContainer.classList.add('products-filtering');

                // Temporarily disable AOS animations on product cards
                productCards.forEach(card => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                });

                // Filter products
                productCards.forEach((card, index) => {
                    const shouldShow = filter === 'all' || card.classList.contains(filter);

                    if (shouldShow) {
                        // Show card
                        card.classList.remove('filter-hide');
                        card.style.display = 'block';

                        setTimeout(() => {
                            card.classList.add('filter-show');
                        }, index * 50);
                    } else {
                        // Hide card
                        card.classList.remove('filter-show');
                        card.classList.add('filter-hide');

                        setTimeout(() => {
                            if (card.classList.contains('filter-hide')) {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });

                // Re-enable AOS and refresh after filtering animation
                setTimeout(() => {
                    productsContainer.classList.remove('products-filtering');

                    // Reset transitions to allow AOS to work
                    productCards.forEach(card => {
                        card.style.transition = '';
                    });

                    // Refresh AOS for visible elements
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, 800);
            });
        });

        // Initialize all cards as visible with proper classes
        productCards.forEach(card => {
            card.classList.add('filter-show');
        });
    }



    initializeTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');

        teamCards.forEach(card => {
            // Add keyboard support for accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Click to view team member details');

            // Handle keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('flipped');
                }
            });

            // Handle click for mobile devices
            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    card.classList.toggle('flipped');
                }
            });
        });
    }

    handleResize() {
        // Handle responsive adjustments
        const navMenu = document.getElementById('nav-menu');

        // Close mobile menu on desktop
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }

        // Update any size-dependent calculations
        this.updateScrollProgress();
    }

    hideLoadingStates() {
        // Remove loading states and show content
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.classList.remove('loading');
        });
    }

    initializePerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();

        // Initialize service worker if available
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
    }

    preloadCriticalResources() {
        const criticalImages = [
            'images/header-logo.png',
            'images/team-person-3.jpeg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Public API methods
    scrollToSection(sectionId) {
        this.smoothScrollTo(`#${sectionId}`);
    }

    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--copper-primary);
            color: white;
            border-radius: 8px;
            box-shadow: var(--shadow-medium);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add this method to your NakodaMetalIndustries class
    initializeScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const heroSection = document.querySelector('#home');

        if (!scrollIndicator || !heroSection) return;

        // Hide scroll indicator when clicking on it
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                this.smoothScrollTo('#about');
            }
        });

        // Show/hide scroll indicator based on hero section visibility
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Hero section is visible - show scroll indicator
                    scrollIndicator.classList.remove('hidden');
                } else {
                    // Hero section is not visible - hide scroll indicator
                    scrollIndicator.classList.add('hidden');
                }
            });
        }, {
            threshold: 0.3, // Show when 30% of hero is visible
            rootMargin: '0px 0px -100px 0px' // Add some margin for better UX
        });

        heroObserver.observe(heroSection);

        // Also hide on scroll past certain point
        window.addEventListener('scroll', this.throttle(() => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;

            if (scrollY > heroHeight * 0.7) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }, 16));
    }
}

// Initialize the application
const nakodaMetalIndustries = new NakodaMetalIndustries();

// Export for use in other modules
window.NakodaMetalIndustries = nakodaMetalIndustries;
