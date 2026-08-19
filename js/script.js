/* ============================================================
   VargeClinic — Production JavaScript
   All UI logic consolidated. Zero dependencies.
   ============================================================ */

// Global variables
let isFabOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeMobileMenu();
    initializeNavigation();
    initializeContactForm();
    initializeFab();
    initializeScrollAnimations();
    
    // Set minimum date for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Header scroll effect
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu on CTA button click
        const mobileCTABtns = mobileMenu.querySelectorAll('.mobile-cta .btn');
        mobileCTABtns.forEach(btn => {
            btn.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header') && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
        
        // Close mobile menu on window resize past breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling navigation
function initializeNavigation() {
    // Only intercept same-page anchor links (e.g. #about), not cross-page links (e.g. /#about)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Only handle pure hash links (#section), skip if it starts with /
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                scrollToSection(href);
            }
        });
    });
}

function scrollToSection(targetId) {
    var el = document.querySelector(targetId);
    if (el) {
        var headerHeight = 80;
        var top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
    } else {
        /* Element not on this page — navigate to index with hash */
        window.location.href = 'index.html' + targetId;
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form submission is handled by inline script in index.ejs
        // This just ensures the form exists
    }
}

function stopTestimonialRotation() {
    if (testimonialInterval) { clearInterval(testimonialInterval); testimonialInterval = null; }
}

/* ==========================================================
   CONTACT FORM — Google Apps Script integration
   ========================================================== */
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>]/g, '').trim();
}

function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* --- Honeypot check --- */
        var hp = form.querySelector('[name="website"]');
        if (hp && hp.value !== '') return; /* Bot detected — silently abort */

        var submitBtn = form.querySelector('[type="submit"]');
        var statusEl = document.getElementById('formStatus');

        /* --- Gather & sanitize fields --- */
        var data = new URLSearchParams();
        data.append('name', sanitizeInput(form.elements['name'].value));
        data.append('email', sanitizeInput(form.elements['email'].value));
        data.append('phone', sanitizeInput(form.elements['phone'].value));
        data.append('age', sanitizeInput(form.elements['age'].value));
        data.append('gender', sanitizeInput(form.elements['gender'].value));
        data.append('date', form.elements['date'].value);
        data.append('address', sanitizeInput(form.elements['address'].value));
        data.append('message', sanitizeInput(form.elements['message'].value));
        data.append('honeypot', '');

        /* --- Loading state --- */
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting\u2026';
        }
        if (statusEl) { statusEl.className = 'form-status'; statusEl.textContent = ''; }

        fetch(_sys_req_node, {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
                if (result.result === 'success') {
                    formSuccess(statusEl, form);
                } else {
                    throw new Error(result.error || 'Submission failed');
                }
            })
            .catch(function (err) {
                /*
                 * Google Apps Script processes the POST before CORS blocks
                 * the response. A TypeError usually means data was saved but
                 * the response was blocked. Show optimistic success.
                 */
                if (err instanceof TypeError || (err.message && err.message.indexOf('Failed to fetch') !== -1)) {
                    formSuccess(statusEl, form);
                } else {
                    if (statusEl) {
                        statusEl.className = 'form-status error';
                        statusEl.textContent = '\u2717 Something went wrong. Please call us at +91 7057 099 100.';
                    }
                }
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.innerHTML = 'Book Consultation';
                }
            });
    });
}

function formSuccess(statusEl, form) {
    if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '\u2713 Appointment request sent! We will contact you shortly to confirm.';
    }
    form.reset();
}

/* ==========================================================
   FLOATING ACTION BUTTON (FAB)
   ========================================================== */
function initFab() {
    var fabMain = document.getElementById('fabMain');
    if (!fabMain) return;

    document.addEventListener('click', function (e) {
        if (isFabOpen && !e.target.closest('.floating-buttons')) {
            toggleFab();
        }
    });
}

function toggleFab() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    if (!fabMain || !fabMenu) return;
    
    isFabOpen = !isFabOpen;
    fabMain.classList.toggle('active', isFabOpen);
    fabMenu.classList.toggle('active', isFabOpen);
}

/* ==========================================================
   SCROLL ANIMATIONS — IntersectionObserver
   ========================================================== */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll(
        '.about-image, .about-content, .service-card, .service-section'
    ).forEach(function (el) {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
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

// Add smooth scrolling for browsers that don't support it natively
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function(target) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition - 80;
        const distance = targetPosition - startPosition;
        const duration = Math.abs(distance) / 1000 * 600;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    };
    
    window.smoothScrollPolyfill = smoothScrollPolyfill;
}

/* ==========================================================
   GLOBAL EXPORTS — for onclick= handlers in HTML
   ========================================================== */
window.scrollToSection = scrollToSection;
window.toggleFab = toggleFab;
