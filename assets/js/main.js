// ============================================
// Nightingale v2.0 Landing Page JavaScript
// Modern Interactions & Animations
// ============================================

(function() {
    'use strict';

    // Mark JS as enabled to avoid hiding content when JS fails to run.
    document.documentElement.classList.add('js-enabled');

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initNavbar();
        initScrollAnimations();
        initCounterAnimation();
        initSmoothScroll();
        initMobileMenu();
        initParallax();
        initTooltips();
        initFAQ();
        initLifecycleTabs();
        initProductShowcase();
        initScansCarousel();
    });

    // Navbar scroll effect
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    // Scroll animations using Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // Counter animation for stats
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) {
            // Retry after a short delay if counters not found yet
            setTimeout(initCounterAnimation, 100);
            return;
        }
        
        const speed = 50; // Animation speed

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            if (target === 0) return; // Skip if no target
            
            let count = parseInt(counter.innerText) || 0;
            const increment = Math.max(1, target / speed);
            
            // Determine suffix based on label/content
            const statItem = counter.closest('.stat-item');
            const statLabel = statItem ? statItem.querySelector('.stat-label') : null;
            const labelText = statLabel ? statLabel.textContent.trim().toLowerCase() : '';
            
            let suffix = '+';
            if (labelText.includes('platform independent') || target === 100) {
                suffix = '%';
            }

            if (count < target) {
                count = Math.min(Math.ceil(count + increment), target);
                counter.innerText = count;
                setTimeout(() => animateCounter(counter), 20);
            } else {
                counter.innerText = target + suffix;
            }
        };

        // Function to start animation for a counter
        const startCounter = (counter) => {
            if (counter.classList.contains('counted')) return;
            counter.classList.add('counted');
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            if (target === 0) return;
            
            counter.innerText = '0';
            // Small delay to ensure DOM is ready
            setTimeout(() => animateCounter(counter), 50);
        };

        // Use IntersectionObserver with fallback
        let observer;
        try {
            observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px'
            });
        } catch (e) {
            console.warn('IntersectionObserver not supported, using fallback');
            observer = null;
        }

        // Initialize all counters - always start animation after delay
        counters.forEach((counter, index) => {
            // Reset to 0 if not already counted
            if (!counter.classList.contains('counted')) {
                counter.innerText = '0';
            }
            
            // Always start animation after a delay (for above-the-fold content)
            // Use longer delay to ensure page is fully loaded on deployment
            setTimeout(() => {
                if (!counter.classList.contains('counted')) {
                    startCounter(counter);
                }
            }, 1000 + (index * 150)); // Increased delay for deployment
            
            // Also observe for scroll-into-view
            if (observer) {
                observer.observe(counter);
            }
        });
    }
    
    // Also initialize on window load as fallback
    window.addEventListener('load', function() {
        // Double-check counters are animated after full page load
        setTimeout(() => {
            const counters = document.querySelectorAll('.stat-number:not(.counted)');
            if (counters.length > 0) {
                counters.forEach((counter, index) => {
                    setTimeout(() => {
                        if (!counter.classList.contains('counted')) {
                            const target = parseInt(counter.getAttribute('data-target')) || 0;
                            if (target > 0) {
                                counter.classList.add('counted');
                                counter.innerText = '0';
                                
                                const speed = 50;
                                const animateCounter = (counter) => {
                                    const target = parseInt(counter.getAttribute('data-target')) || 0;
                                    let count = parseInt(counter.innerText) || 0;
                                    const increment = Math.max(1, target / speed);
                                    
                                    const statItem = counter.closest('.stat-item');
                                    const statLabel = statItem ? statItem.querySelector('.stat-label') : null;
                                    const labelText = statLabel ? statLabel.textContent.trim().toLowerCase() : '';
                                    
                                    let suffix = '+';
                                    if (labelText.includes('platform independent') || target === 100) {
                                        suffix = '%';
                                    }

                                    if (count < target) {
                                        count = Math.min(Math.ceil(count + increment), target);
                                        counter.innerText = count;
                                        setTimeout(() => animateCounter(counter), 20);
                                    } else {
                                        counter.innerText = target + suffix;
                                    }
                                };
                                
                                setTimeout(() => animateCounter(counter), 50);
                            }
                        }
                    }, index * 150);
                });
            }
        }, 500);
    });

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const bar = document.querySelector('.announcement-bar');
                    const nav = document.getElementById('navbar');
                    const barH = bar ? bar.getBoundingClientRect().height : 0;
                    const navH = nav ? nav.getBoundingClientRect().height : 72;
                    const offsetTop = target.offsetTop - barH - navH;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenuToggle');
                    if (mobileMenu) {
                        mobileMenu.classList.remove('active');
                        document.querySelector('.nav-links')?.classList.remove('active');
                    }
                }
            });
        });
    }

    // Mobile menu toggle
    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggle && navLinks) {
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                    toggle.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }

    // Parallax effect for hero section
    function initParallax() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;

            if (scrolled < hero.offsetHeight) {
                const orbs = hero.querySelectorAll('.gradient-orb');
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.1;
                    orb.style.transform = `translateY(${rate * speed}px)`;
                });
            }
        });
    }

    // Tooltips for interactive elements
    function initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);

                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                tooltip.classList.add('show');
            });

            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    // Add active state to navigation links on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.feature-card, .tool-category, .recognition-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Performance optimization: Throttle scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply throttling to scroll-heavy functions
    window.addEventListener('scroll', throttle(function() {
        // Scroll-based animations can go here
    }, 16)); // ~60fps

    // Copy to clipboard functionality
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success feedback
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'Copied to clipboard!';
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    }

    // Make copyToClipboard available globally
    window.copyToClipboard = copyToClipboard;

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Lifecycle feature tabs (keyboard + ARIA)
    function initLifecycleTabs() {
        const tablist = document.querySelector('.lifecycle-tabs');
        if (!tablist) return;

        const tabs = Array.from(tablist.querySelectorAll('.lifecycle-tab'));
        const panels = tabs.map(function (_, i) {
            return document.getElementById('lifecycle-panel-' + i);
        }).filter(Boolean);

        if (tabs.length === 0 || panels.length === 0) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function selectTab(index) {
            if (index < 0 || index >= tabs.length) return;

            tabs.forEach(function (tab, i) {
                var active = i === index;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
                tab.tabIndex = active ? 0 : -1;

                if (panels[i]) {
                    if (active) {
                        panels[i].removeAttribute('hidden');
                        panels[i].classList.add('is-active');
                    } else {
                        panels[i].setAttribute('hidden', '');
                        panels[i].classList.remove('is-active');
                    }
                }
            });
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                selectTab(index);
            });
        });

        tablist.addEventListener('keydown', function (e) {
            var current = tabs.indexOf(document.activeElement);
            if (current === -1) return;

            var next = current;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                next = (current + 1) % tabs.length;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                next = (current - 1 + tabs.length) % tabs.length;
                e.preventDefault();
            } else if (e.key === 'Home') {
                next = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                next = tabs.length - 1;
                e.preventDefault();
            }

            if (next !== current) {
                selectTab(next);
                tabs[next].focus();
            }
        });

        if (reduceMotion) {
            document.querySelectorAll('.lifecycle-panel').forEach(function (el) {
                el.style.animation = 'none';
            });
        }
    }

    // Product showcase tabs (Console / VS Code / Scans / Access)
    function initProductShowcase() {
        const tablist = document.querySelector('.showcase-tabs');
        if (!tablist) return;

        const tabs = Array.from(tablist.querySelectorAll('.showcase-tab'));
        const panels = tabs.map(function (_, i) {
            return document.getElementById('showcase-panel-' + i);
        }).filter(Boolean);

        if (tabs.length === 0 || panels.length === 0) return;

        function selectTab(index) {
            if (index < 0 || index >= tabs.length) return;

            tabs.forEach(function (tab, i) {
                var active = i === index;
                tab.classList.toggle('is-active', active);
                tab.setAttribute('aria-selected', active ? 'true' : 'false');
                tab.tabIndex = active ? 0 : -1;

                if (panels[i]) {
                    if (active) {
                        panels[i].removeAttribute('hidden');
                        panels[i].classList.add('is-active');
                    } else {
                        panels[i].setAttribute('hidden', '');
                        panels[i].classList.remove('is-active');
                    }
                }
            });
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                selectTab(index);
            });
        });

        tablist.addEventListener('keydown', function (e) {
            var current = tabs.indexOf(document.activeElement);
            if (current === -1) return;

            var next = current;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                next = (current + 1) % tabs.length;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                next = (current - 1 + tabs.length) % tabs.length;
                e.preventDefault();
            } else if (e.key === 'Home') {
                next = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                next = tabs.length - 1;
                e.preventDefault();
            }

            if (next !== current) {
                selectTab(next);
                tabs[next].focus();
            }
        });
    }

    // Security scans screenshot carousel (inside Product tab)
    function initScansCarousel() {
        const root = document.getElementById('scans-carousel');
        if (!root) return;

        const slides = Array.from(root.querySelectorAll('.carousel-slide'));
        const dots = Array.from(root.querySelectorAll('.carousel-dot'));
        const prevBtn = root.querySelector('.carousel-prev');
        const nextBtn = root.querySelector('.carousel-next');
        if (slides.length === 0) return;

        var idx = 0;

        function go(n) {
            idx = (n + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                var on = i === idx;
                slide.classList.toggle('is-active', on);
                if (on) {
                    slide.removeAttribute('hidden');
                    slide.setAttribute('aria-hidden', 'false');
                } else {
                    slide.setAttribute('hidden', '');
                    slide.setAttribute('aria-hidden', 'true');
                }
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === idx);
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { go(i); });
        });

        go(0);
    }

    // FAQ accordion functionality
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', function() {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').classList.remove('show');
                    }
                });

                // Toggle current FAQ item
                item.classList.toggle('active');
                answer.classList.toggle('show');
            });
        });
    }

    // Console message for developers
    console.log('%c🦅 Nightingale v2.0', 'color: #5eead4; font-size: 20px; font-weight: bold;');
    console.log('%cDocker for Pentesters - Landing Page', 'color: #a1a1aa; font-size: 14px;');
    console.log('%cBuilt with ❤️ from 🇮🇳 by Raja Nagori for the security community', 'color: #7A8A9A; font-size: 12px;');

})();
