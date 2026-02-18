// Single Page Application - Section Switching
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Show/hide footer based on section
        const footer = document.getElementById('main-footer');
        // Footer is now visible on all pages including home
        footer.style.display = 'block';
        
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Navigation click handlers
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Allow external links (starting with http or containing .html)
        if (href.startsWith('http') || href.includes('.html')) {
            return; // Let the link work normally
        }
        
        // Handle internal section navigation
        e.preventDefault();
        const targetId = href.substring(1);
        showSection(targetId);
    });
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Initialize page - show home section and hide footer
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');
    
    // Initialize other features
    initializeAnimations();
    initializeForms();
    initializeCounters();
});

function initializeAnimations() {
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const fadeElements = document.querySelectorAll('.service-card, .news-card, .stat-item, .about-text, .contact-item');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initializeForms() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! We will get back to you soon.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

function initializeCounters() {
    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number
            if (target >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Initialize counter animations when statistics are visible
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                animateCounter(entry.target, number);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(55, 48, 163, 0.95) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Contact form handling is now in initializeForms()

// Newsletter form handling is now in initializeForms()

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Counter animation is now in initializeCounters()

// Add hover effects to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add hover effects to news cards
document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal animation for hero section
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-50px)';
        heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 300);
    }
    
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        heroImage.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 500);
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 30);
        }, 1000);
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add current year to footer
window.addEventListener('load', () => {
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace(/\d{4}/, currentYear);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// Add accessibility improvements
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #fbbf24';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Lazy loading for images (if supported)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// News Slideshow Functionality
let currentSlideIndex = 0;
let slideInterval;
let slides; // Declare slides in global scope

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    console.log('showSlide called with index:', index);
    
    if (slides.length === 0) return;
    
    // Wrap around if index is out of bounds
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;
    
    // Hide all slides with fade effect
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide with fade effect
    setTimeout(() => {
        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
        console.log('Showing slide:', currentSlideIndex);
    }, 50); // Small delay for smooth transition
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function autoSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length; // Loop back to 0 when reaching end
    showSlide(currentSlideIndex);
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(autoSlide, 2000); // Change slide every 2 seconds for smoother experience
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slideshow if it exists
    slides = document.querySelectorAll('.slide'); // Use global slides variable
    console.log('Found slides:', slides.length);
    
    if (slides.length > 0) {
        showSlide(0);
        // Start slideshow after a short delay for better UX
        setTimeout(() => {
            resetAutoSlide();
        }, 1000); // 1 second delay before starting auto-rotation
        
        // Pause auto-slide on hover
        const slideshow = document.querySelector('.news-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slideshow.addEventListener('mouseleave', resetAutoSlide);
            
            // Also pause on click/touch for mobile - toggle auto-slide
            slideshow.addEventListener('click', () => {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    slideInterval = null;
                    console.log('Slideshow paused');
                } else {
                    resetAutoSlide();
                    console.log('Slideshow resumed');
                }
            });
        }
    } else {
        console.log('No slides found');
    }
});

// Console welcome message
console.log('%cOffice of the Provincial Governor Website', 'color: #1e3a8a; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with dedication for public service', 'color: #3730a3; font-size: 14px;');
