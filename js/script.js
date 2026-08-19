/* ============================================================
   VargeClinic — Production JavaScript
   All UI logic consolidated. Zero dependencies.
   ============================================================ */

var _sys_req_node = 'https://script.google.com/macros/library/d/1VzOMu2lH32aCGf654ZJ2AJaYwvzsAYYguqwbk541vR8AIj2AD4NksSFJ/6';

/* ---------- Gallery Slides Data ---------- */
var gallerySlides = [
    { before: 'img/gallery/g1b.webp', after: 'img/gallery/g1a.webp', title: 'Adult Orthodontics', description: '18-month treatment with Invisalign' },
    { before: 'img/gallery/g2b.webp', after: 'img/gallery/g2a.webp', title: 'Teen Braces', description: '24-month treatment with traditional braces' },
    { before: 'img/gallery/g3b.webp', after: 'img/gallery/g3a.webp', title: 'Ceramic Braces', description: '20-month treatment with ceramic braces' },
    { before: 'img/gallery/g4b.webp', after: 'img/gallery/g4a.webp', title: 'Invisalign Treatment', description: '15-month treatment with Invisalign' }
];

/* ---------- Testimonials Data ---------- */
var testimonials = [
    {
        gender: 'female',
        quote: "I'm so glad I chose Dr. Virangi Varge for my orthodontic treatment. She is not only highly skilled and knowledgeable but also incredibly calm and caring...",
        name: 'Harsha Barde',
        details: 'Age 28 \u2022 Invisalign'
    },
    {
        gender: 'male',
        quote: 'I recently completed 2-year orthodontic treatment with Dr. Virangi. Dr. Virangi and the whole team were consistently professional, attentive, and friendly...',
        name: 'Sandesh Harne',
        details: 'Age 34 \u2022 Traditional Braces'
    },
    {
        gender: 'female',
        quote: 'Dr. Virangi Varge mam is very dedicated towards her work. The only reason behind my wonderful smile is Dr. Virangi Varge mam...',
        name: 'Vaishnavi Dhawale',
        details: 'Age 22 \u2022 Ceramic Braces'
    },
    {
        gender: 'male',
        quote: 'Nice clean and healthy clinic with attentive staff. The dentist is knowledgeable and experienced. Explained everything clearly...',
        name: 'Prashant Bonde',
        details: 'Age 30 \u2022 Invisalign'
    },
    {
        gender: 'female',
        quote: 'Mam is one of the reason of my beautiful smile. Mam is very polite and best dentist doctor of Akola. Mam is knowledgeable person and nice treatment to gave her patient...',
        name: 'Divya Sarda',
        details: 'Age 27 \u2022 Ceramic Braces'
    },
    {
        gender: 'male',
        quote: "My son Mr. Shivesh A Sable is your regular patient and his experience is very good and progressive. The treatment fees anybody can afford. The Dr.'s behaviour is very good and simplicity...",
        name: 'Anoop Sable',
        details: 'Age 15 \u2022 Early Orthodontics'
    },
    {
        gender: 'female',
        quote: 'Akola is blessed with the efficient and knowledgeable Orthodontist\ud83d\udc4d...',
        name: 'Shilpa Bikkad',
        details: 'Age 27 \u2022 Ceramic Braces'
    },
    {
        gender: 'female',
        quote: 'Best dentist in town. Very polite doctor with great patient compliance. Will totally recommend...',
        name: 'Shlesha Shukla',
        details: 'Age 26 \u2022 Dental Implants'
    }
];

/* ---------- State ---------- */
var currentSlide = 0;
var currentTestimonial = 0;
var galleryInterval = null;
var testimonialInterval = null;
var isFabOpen = false;
var SLIDE_DELAY = 5000;
var TESTIMONIAL_DELAY = 6000;

/* ==========================================================
   DOM READY
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileMenu();
    initNavigation();
    initGallery();
    initTestimonials();
    initContactForm();
    initFab();
    initScrollAnimations();
    initDateInput();
});

/* ==========================================================
   HEADER — scroll shadow
   ========================================================== */
function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

/* ==========================================================
   MOBILE MENU
   ========================================================== */
function initMobileMenu() {
    var btn = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('active');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    /* Close menu when a nav link is tapped */
    menu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.remove('active');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', 'Open menu');
        });
    });
}

/* ==========================================================
   NAVIGATION — smooth scroll with header offset
   ========================================================== */
function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href !== '#') {
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

/* ==========================================================
   GALLERY
   ========================================================== */
function initGallery() {
    if (!gallerySlides.length) return;
    updateSlide();
    buildGalleryIndicators();
    startGalleryRotation();

    var slider = document.querySelector('.gallery-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopGalleryRotation);
        slider.addEventListener('mouseleave', startGalleryRotation);
    }
}

function updateSlide() {
    var content = document.querySelector('.gallery-content');
    if (!content || !gallerySlides[currentSlide]) return;
    var s = gallerySlides[currentSlide];

    content.innerHTML =
        '<div class="gallery-images">' +
        '<div class="gallery-image-container">' +
        '<div class="gallery-badge before">BEFORE</div>' +
        '<img src="' + s.before + '" alt="Before treatment \u2014 ' + s.title + '" class="gallery-image" loading="lazy">' +
        '</div>' +
        '<div class="gallery-image-container">' +
        '<div class="gallery-badge after">AFTER</div>' +
        '<img src="' + s.after + '" alt="After treatment \u2014 ' + s.title + '" class="gallery-image" loading="lazy">' +
        '</div>' +
        '</div>' +
        '<div class="gallery-info">' +
        '<h3 class="gallery-title">' + s.title + '</h3>' +
        '<p class="gallery-description">' + s.description + '</p>' +
        '</div>';

    document.querySelectorAll('.gallery-indicators .indicator').forEach(function (ind, i) {
        ind.classList.toggle('active', i === currentSlide);
    });
}

function buildGalleryIndicators() {
    var container = document.querySelector('.gallery-indicators');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < gallerySlides.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'indicator' + (i === currentSlide ? ' active' : '');
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.onclick = (function (idx) { return function () { goToSlide(idx); }; })(i);
        container.appendChild(btn);
    }
}

function changeSlide(dir) {
    currentSlide = (currentSlide + dir + gallerySlides.length) % gallerySlides.length;
    updateSlide();
    stopGalleryRotation();
    startGalleryRotation();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    stopGalleryRotation();
    startGalleryRotation();
}

function startGalleryRotation() {
    stopGalleryRotation();
    galleryInterval = setInterval(function () {
        currentSlide = (currentSlide + 1) % gallerySlides.length;
        updateSlide();
    }, SLIDE_DELAY);
}

function stopGalleryRotation() {
    if (galleryInterval) { clearInterval(galleryInterval); galleryInterval = null; }
}

/* ---------- Page Visibility API — pause all intervals ---------- */
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        stopGalleryRotation();
        stopTestimonialRotation();
    } else {
        if (gallerySlides.length) startGalleryRotation();
        if (testimonials.length) startTestimonialRotation();
    }
});

/* ==========================================================
   TESTIMONIALS
   ========================================================== */
function initTestimonials() {
    if (!testimonials.length) return;
    updateTestimonial();
    buildTestimonialIndicators();
    startTestimonialRotation();

    var main = document.getElementById('testimonialSlider');
    if (main) {
        main.addEventListener('mouseenter', stopTestimonialRotation);
        main.addEventListener('mouseleave', startTestimonialRotation);
    }
}

function updateTestimonial() {
    var t = testimonials[currentTestimonial];
    if (!t) return;

    var quoteEl = document.getElementById('testimonialQuote');
    var nameEl = document.getElementById('testimonialName');
    var detailsEl = document.getElementById('testimonialDetails');
    var imgEl = document.getElementById('testimonialImg');

    if (quoteEl) quoteEl.textContent = '\u201c' + t.quote + '\u201d';
    if (nameEl) nameEl.textContent = t.name;
    if (detailsEl) detailsEl.textContent = t.details;
    if (imgEl) {
        imgEl.src = t.gender === 'male' ? 'img/icon/male.webp' : 'img/icon/female.webp';
        imgEl.alt = t.name;
    }

    document.querySelectorAll('.testimonial-indicators .indicator').forEach(function (ind, i) {
        ind.classList.toggle('active', i === currentTestimonial);
    });
}

function buildTestimonialIndicators() {
    var container = document.querySelector('.testimonial-indicators');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < testimonials.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'indicator' + (i === currentTestimonial ? ' active' : '');
        btn.setAttribute('aria-label', 'View testimonial from ' + testimonials[i].name);
        btn.onclick = (function (idx) { return function () { goToTestimonial(idx); }; })(i);
        container.appendChild(btn);
    }
}

function changeTestimonial(dir) {
    currentTestimonial = (currentTestimonial + dir + testimonials.length) % testimonials.length;
    updateTestimonial();
    stopTestimonialRotation();
    startTestimonialRotation();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonial();
    stopTestimonialRotation();
    startTestimonialRotation();
}

function startTestimonialRotation() {
    stopTestimonialRotation();
    testimonialInterval = setInterval(function () {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonial();
    }, TESTIMONIAL_DELAY);
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
    var fabMain = document.getElementById('fabMain');
    var fabMenu = document.getElementById('fabMenu');
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

/* ==========================================================
   DATE INPUT — set min to today
   ========================================================== */
function initDateInput() {
    var dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
}

/* ==========================================================
   GLOBAL EXPORTS — for onclick= handlers in HTML
   ========================================================== */
window.scrollToSection = scrollToSection;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.changeTestimonial = changeTestimonial;
window.goToTestimonial = goToTestimonial;
window.toggleFab = toggleFab;
