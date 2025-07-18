
// Global variables
let currentGallerySlide = 0;
let currentTestimonialIndex = 0;
let isFabOpen = false;

// Gallery data
// Gallery functionality
let currentSlide = 0;
const totalSlides = gallerySlides.length;

// Initialize the gallery on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial slide
    updateSlide(currentSlide);
    
    // Update indicators based on total slides
    updateIndicators();
});

// Function to update indicators based on total slides
function updateIndicators() {
    const indicatorsContainer = document.querySelector('.gallery-indicators');
    indicatorsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'indicator' + (i === currentSlide ? ' active' : '');
        indicator.onclick = function() { goToSlide(i); };
        indicatorsContainer.appendChild(indicator);
    }
}

// Function to update the slide content
function updateSlide(index) {
    const galleryContent = document.querySelector('.gallery-content');
    const slide = gallerySlides[index];
    
    // Update the gallery content
    galleryContent.innerHTML = `
        <div class="gallery-images">
            <div class="gallery-image-container">
                <div class="gallery-badge before">BEFORE</div>
                <img src="${slide.before}" alt="Before treatment" class="gallery-image">
            </div>
            <div class="gallery-image-container">
                <div class="gallery-badge after">AFTER</div>
                <img src="${slide.after}" alt="After treatment" class="gallery-image">
            </div>
        </div>
        <div class="gallery-info">
            <h3 class="gallery-title">${slide.title}</h3>
            <p class="gallery-description">${slide.description}</p>
        </div>
    `;
    
    // Update active indicator
    document.querySelectorAll('.gallery-indicators .indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// Function to navigate to a specific slide
function goToSlide(index) {
    currentSlide = index;
    updateSlide(currentSlide);
}

// Function to change slides (previous/next)
function changeSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateSlide(currentSlide);
}

// Function to scroll to a section
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
// Testimonials data
const testimonials = [
    // 
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeMobileMenu();
    initializeNavigation();
    initializeGallery();
    initializeTestimonials();
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
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
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
    }
}

// Smooth scrolling navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });
}

// Scroll to section function
function scrollToSection(targetId) {
    const element = document.querySelector(targetId);
    if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Gallery functionality
function initializeGallery() {
    updateGallery();
}

function updateGallery() {
    const galleryCard = document.querySelector('.gallery-card');
    const indicators = document.querySelectorAll('.indicator');
    
    if (galleryCard && gallerySlides[currentGallerySlide]) {
        const slide = gallerySlides[currentGallerySlide];
        
        galleryCard.innerHTML = `
            <div class="gallery-content">
                <div class="gallery-images">
                    <div class="gallery-image-container">
                        <div class="gallery-badge before">BEFORE</div>
                        <img src="${slide.before}" alt="Before treatment" class="gallery-image">
                    </div>
                    <div class="gallery-image-container">
                        <div class="gallery-badge after">AFTER</div>
                        <img src="${slide.after}" alt="After treatment" class="gallery-image">
                    </div>
                </div>
                <div class="gallery-info">
                    <h3 class="gallery-title">${slide.title}</h3>
                    <p class="gallery-description">${slide.description}</p>
                </div>
            </div>
        `;
    }
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentGallerySlide);
    });
}

function changeSlide(direction) {
    currentGallerySlide = (currentGallerySlide + direction + gallerySlides.length) % gallerySlides.length;
    updateGallery();
}

function goToSlide(index) {
    currentGallerySlide = index;
    updateGallery();
}

// Testimonials functionality
function initializeTestimonials() {
    updateTestimonial();
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial();
    }, 5000);
}

function updateTestimonial() {
    const mainTestimonial = document.getElementById('mainTestimonial');
    const thumbs = document.querySelectorAll('.testimonial-thumb');
    
    if (mainTestimonial && testimonials[currentTestimonialIndex]) {
        const testimonial = testimonials[currentTestimonialIndex];
        
        mainTestimonial.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-avatar">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                </div>
                <div class="testimonial-text">
                    <div class="testimonial-stars">
                        ${'★'.repeat(testimonial.rating)}
                    </div>
                    <blockquote class="testimonial-quote">
                        "${testimonial.text}"
                    </blockquote>
                    <div class="testimonial-author">
                        <div class="author-name">${testimonial.name}</div>
                        <div class="author-details">Age ${testimonial.age} • ${testimonial.treatment}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update thumbnail active state
    thumbs.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentTestimonialIndex);
    });
}

function changeTestimonial(direction) {
    currentTestimonialIndex = (currentTestimonialIndex + direction + testimonials.length) % testimonials.length;
    updateTestimonial();
}

function selectTestimonial(index) {
    currentTestimonialIndex = index;
    updateTestimonial();
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                message: formData.get('message')
            };
            
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you! We will contact you soon to confirm your appointment.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Floating Action Button functionality
function initializeFab() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fabMain && fabMenu) {
        fabMain.addEventListener('click', toggleFab);
        
        // Close FAB when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.floating-buttons') && isFabOpen) {
                toggleFab();
            }
        });
    }
}

function toggleFab() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    isFabOpen = !isFabOpen;
    
    fabMain.classList.toggle('active', isFabOpen);
    fabMenu.classList.toggle('active', isFabOpen);
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.about-image, .about-content, .service-card');
    animatedElements.forEach(el => {
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
        const duration = Math.abs(distance) / 1000 * 600; // Adjust speed as needed
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
    
    // Override scrollToSection for older browsers
    window.smoothScrollPolyfill = smoothScrollPolyfill;
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.changeTestimonial = changeTestimonial;
window.selectTestimonial = selectTestimonial;
window.toggleFab = toggleFab;
