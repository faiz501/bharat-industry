// Animation Controller for Nakoda Metal Industries Website
// Integrates AOS and custom animations

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.initCustomAnimations();
        this.setupPerformanceOptimizations();
        this.initParallaxEffects();
        this.initHoverAnimations();
    }

    // Initialize AOS (Animate On Scroll)
    // iOS-optimized AOS initialization
    initAOS() {
        if (typeof AOS !== 'undefined') {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

            AOS.init({
                duration: isIOS ? 400 : 800, // Shorter duration on iOS
                easing: 'ease-out',
                once: true,
                offset: isIOS ? 50 : 100,
                delay: 0,
                anchorPlacement: 'top-bottom',
                disable: function () {
                    // Disable on iOS devices with small screens
                    return isIOS && window.innerWidth < 768;
                }
            });

            // Force refresh on iOS
            if (isIOS) {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }
        }
    }


    // Initialize custom animations
    initCustomAnimations() {
        this.createScrollRevealAnimations();
        this.createTypewriterEffect();
        this.createFloatingElements();
        this.initTeamCardAnimations();
        this.initProductCardAnimations();
    }

    createScrollRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    createTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');

        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(element, text, 50);
                        observer.unobserve(element);
                    }
                });
            });

            observer.observe(element);
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    createFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating');

        floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            element.style.animationDelay = `${delay}s`;
            element.classList.add('floating-animation');
        });
    }

    initTeamCardAnimations() {
        const teamCards = document.querySelectorAll('.team-card');

        teamCards.forEach(card => {
            const cardInner = card.querySelector('.team-card-inner');

            if (!cardInner) return;

            // Enhanced hover effect
            card.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    cardInner.style.transform = 'rotateY(180deg) scale(1.02)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    cardInner.style.transform = 'rotateY(0deg) scale(1)';
                }
            });

            // Touch support for mobile
            let touchStartTime = 0;
            card.addEventListener('touchstart', () => {
                touchStartTime = Date.now();
            });

            card.addEventListener('touchend', () => {
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 500) { // Quick tap
                    card.classList.toggle('mobile-flipped');
                }
            });
        });
    }

    initProductCardAnimations() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            // Stagger animation on page load
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, Math.random() * 300);
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(card);

            // Enhanced hover effects
            card.addEventListener('mouseenter', () => {
                this.animateProductCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateProductCard(card, 'leave');
            });
        });
    }

    animateProductCard(card, action) {
        const img = card.querySelector('.product-img');
        const content = card.querySelector('.product-content');

        if (action === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            if (img) img.style.transform = 'scale(1.1)';
            if (content) content.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            if (img) img.style.transform = 'scale(1)';
            if (content) content.style.transform = 'translateY(0)';
        }
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    initHoverAnimations() {
        // Button hover animations
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });

            // Click animation
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(0) scale(0.98)';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
        });

        // Image hover animations
        const images = document.querySelectorAll('.image-placeholder, .team-photo');

        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
            });

            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        });

        // Navigation link animations
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Reduce animations on low-end devices
        if (this.isLowEndDevice()) {
            this.disableHeavyAnimations();
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
    }

    // Utility methods
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    isLowEndDevice() {
        // Simple heuristic for low-end device detection
        return navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    }

    disableHeavyAnimations() {
        // Disable complex animations on low-end devices
        const heavyAnimations = document.querySelectorAll('.heavy-animation');
        heavyAnimations.forEach(el => {
            el.classList.add('reduced-animation');
        });
    }

    disableAnimations() {
        // Disable all animations for users who prefer reduced motion
        if (typeof AOS !== 'undefined') {
            AOS.init({ disable: true });
        }

        document.body.classList.add('reduced-motion');
    }

    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }

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

    // Public API
    refresh() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    destroy() {
        // Cleanup animations
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
        });
    }
}

// iOS Safari Animation Fixes
class iOSAnimationFix {
    constructor() {
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (this.isIOS || this.isSafari) {
            this.initIOSFixes();
        }
    }

    initIOSFixes() {
        // Fix AOS for iOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600, // Shorter duration for iOS
                easing: 'ease-out',
                once: true,
                offset: 50,
                disable: function () {
                    return window.innerWidth < 768; // Disable on mobile
                }
            });
        }

        // Fix team card interactions for iOS
        this.fixTeamCards();

        // Force repaint on scroll
        this.forceRepaint();
    }

    fixTeamCards() {
        const teamCards = document.querySelectorAll('.team-card');

        teamCards.forEach(card => {
            // Add touch event listeners
            card.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            card.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

            // Force hardware acceleration
            card.style.webkitTransform = 'translate3d(0,0,0)';
            card.style.transform = 'translate3d(0,0,0)';
        });
    }

    handleTouchStart(e) {
        this.touchStartTime = Date.now();
    }

    handleTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;

        if (touchDuration < 500) { // Quick tap
            const card = e.currentTarget;
            card.classList.toggle('mobile-flipped');

            // Force repaint
            card.style.transform = 'translateZ(0)';
            setTimeout(() => {
                card.style.transform = '';
            }, 10);
        }
    }

    forceRepaint() {
        let ticking = false;

        const update = () => {
            // Force repaint of animated elements
            const animatedElements = document.querySelectorAll('[data-aos], .team-card, .product-card');
            animatedElements.forEach(el => {
                el.style.transform = el.style.transform;
            });
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }
}

// Initialize iOS fixes
document.addEventListener('DOMContentLoaded', () => {
    new iOSAnimationFix();
});


// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for use in other modules
window.AnimationController = AnimationController;
