// Single Page Application - Section Switching
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    console.log('Found sections:', sections.length);
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    console.log('Target section found:', targetSection ? 'YES' : 'NO', 'ID:', sectionId);
    
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Added active class to section');
        
        // Save current section to localStorage for refresh persistence
        localStorage.setItem('currentSection', sectionId);
        
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
        if (footer) footer.style.display = 'block';
        
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        console.error('Section not found:', sectionId);
    }
}

// Initialize page after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize clock
    updatePHTime();
    setInterval(updatePHTime, 1000);
    
    // Initialize navigation handlers
    initializeNavigation();
    
    // Check for saved section in localStorage
    const savedSection = localStorage.getItem('currentSection');
    if (savedSection && document.getElementById(savedSection)) {
        showSection(savedSection);
    } else {
        showSection('home');
    }
    
    // Initialize other features
    initializeAnimations();
    initializeForms();
    initializeCounters();
    initializeDashboard();
    initializeAIPModal();
});

// Navigation setup - called after DOM loads
function initializeNavigation() {
    // Navigation click handlers
    document.querySelectorAll('.nav-link:not(.nav-link-external)').forEach(link => {
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
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link (exclude external links)
        document.querySelectorAll('.nav-link:not(.nav-link-external)').forEach(n => {
            n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

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
    // Counter animation disabled - using static values from HTML
    // Previous animation was overwriting custom formats like "5M+"
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
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            if (hamburger) hamburger.classList.remove('active');
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

// Lazy loading for images (if supported) - exclude modal images
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
                
                // If already loaded, show immediately
                if (img.complete) {
                    img.style.opacity = '1';
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    // Only observe images NOT in the modal
    document.querySelectorAll('img:not(.modal-content img)').forEach(img => {
        imageObserver.observe(img);
    });
}

// Simple working slideshow with 2 second delay
let slideIndex = 0;
let slideInterval;

function initSimpleSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slideIndex = n;
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        
        slides[slideIndex].classList.add('active');
        if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(slideIndex + 1);
    }
    
    // Auto-play with 2 second delay
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 2000);
    }
    
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Initialize - fully automatic, no pause on hover
    showSlide(0);
    startSlideshow();
    
    // Dot click handlers - still allow manual navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleSlideshow);
} else {
    initSimpleSlideshow();
}

// Personnel Modal Functions
function openPersonnelModal(divisionId, divisionName) {
    const modal = document.getElementById('personnelModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Update modal title with division name
    modalTitle.innerHTML = `<i class="fas fa-users"></i> ${divisionName} - Key Personnel`;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    localStorage.setItem('modalOpen', 'true');
}

function closePersonnelModal() {
    const modal = document.getElementById('personnelModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
    localStorage.setItem('modalOpen', 'false');
}

// Close modal when clicking outside (on the modal backdrop)
document.addEventListener('click', function(event) {
    const modal = document.getElementById('personnelModal');
    if (event.target === modal) {
        closePersonnelModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePersonnelModal();
        closeServicesModal();
    }
});

// Services Data
const servicesData = {
    admin: {
        title: 'Administrative Services',
        services: [
            'Document Processing and Authentication',
            'Business Permit Applications',
            'Civil Registry Services',
            'Notary Public Services',
            'Government ID Processing',
            'Public Records Management',
            'Legal Document Review',
            'Citizen Complaint Handling'
        ]
    },
    community: {
        title: 'Community Programs',
        services: [
            'Livelihood Training Programs',
            'Senior Citizen Assistance',
            'Persons with Disability Support',
            'Women and Children Welfare',
            'Youth Development Programs',
            'Family Planning Services',
            'Community Organizing',
            'Barangay Development Support'
        ]
    },
    economic: {
        title: 'Economic Development',
        services: [
            'Business Registration Assistance',
            'Microfinance and Loan Programs',
            'Agricultural Support Services',
            'Investment Promotion',
            'Market Development',
            'Entrepreneurship Training',
            'Trade and Industry Support',
            'Tourism Development Programs'
        ]
    },
    education: {
        title: 'Education Support',
        services: [
            'Scholarship Programs',
            'School Building Maintenance',
            'Educational Material Assistance',
            'Teacher Training Programs',
            'Alternative Learning System',
            'College Education Support',
            'Technical-Vocational Training',
            'Library Services'
        ]
    },
    healthcare: {
        title: 'Healthcare Services',
        services: [
            'Free Medical Consultations',
            'Vaccination Programs',
            'Maternal and Child Health',
            'Dental Health Services',
            'Mental Health Support',
            'Medical Mission Programs',
            'Hospital Referral Services',
            'Health Education Campaigns'
        ]
    },
    infrastructure: {
        title: 'Infrastructure',
        services: [
            'Road Construction and Maintenance',
            'Bridge Repair and Construction',
            'Public Building Maintenance',
            'Water System Development',
            'Flood Control Projects',
            'Street Lighting Installation',
            'Drainage System Maintenance',
            'Public Market Development'
        ]
    }
};

// Services Modal Functions
function openServicesModal(categoryId) {
    const modal = document.getElementById('servicesModal');
    const modalTitle = document.getElementById('servicesModalTitle');
    const servicesList = document.getElementById('servicesList');
    
    const category = servicesData[categoryId];
    if (category) {
        modalTitle.innerHTML = `<i class="fas fa-list"></i> ${category.title}`;
        servicesList.innerHTML = category.services.map(service => 
            `<li><i class="fas fa-check-circle"></i> ${service}</li>`
        ).join('');
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServicesModal() {
    const modal = document.getElementById('servicesModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close services modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('servicesModal');
    if (event.target === modal) {
        closeServicesModal();
    }
});

// ==================== SIGN UP MODAL FUNCTIONS ====================
function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const phone = document.getElementById('signupPhone').value;
    
    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    // Store user data (in a real app, this would be sent to a server)
    const userData = {
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (for demo purposes)
    localStorage.setItem('userData', JSON.stringify(userData));
    
    alert('Account created successfully! Welcome to the Office of the Provincial Governor website.');
    
    // Close modal and reset form
    closeSignupModal();
    document.getElementById('signupForm').reset();
}

// Close signup modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('signupModal');
    if (event.target === modal) {
        closeSignupModal();
    }
});

// Console welcome message
console.log('%cOffice of the Provincial Governor Website', 'color: #1e3a8a; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with dedication for public service', 'color: #3730a3; font-size: 14px;');

// Philippines Time Clock
function updatePHTime() {
    const timeElement = document.getElementById('ph-time');
    if (timeElement) {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Manila',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        timeElement.textContent = now.toLocaleTimeString('en-US', options) + ' (GMT+8)';
    }
}

// Initialize clock after DOM loads - REMOVED: Now handled in main DOMContentLoaded
// document.addEventListener('DOMContentLoaded', () => {
//     updatePHTime();
//     setInterval(updatePHTime, 1000);
// });

// ==================== DASHBOARD FUNCTIONS ====================
// Simple XLSX parser for Excel/CSV files (lightweight implementation)
(function() {
    // Minimal XLSX parser for CSV and basic Excel
    window.XLSX = {
        read: function(data, opts) {
            // Try to detect if it's CSV or Excel
            const text = new TextDecoder().decode(data.slice(0, 100));
            if (text.includes('\n') && !text.includes('PK')) {
                // It's likely CSV
                return { SheetNames: ['Sheet1'], Sheets: { 'Sheet1': this.utils.csvToSheet(data) } };
            }
            // For simplicity, we'll assume CSV for now
            const fullText = new TextDecoder().decode(data);
            return { SheetNames: ['Sheet1'], Sheets: { 'Sheet1': this.utils.csvToSheet(data) } };
        },
        utils: {
            csvToSheet: function(data) {
                const text = new TextDecoder().decode(data);
                const lines = text.split('\n');
                const result = {};
                let maxCol = 0;
                lines.forEach((line, row) => {
                    const cells = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
                    cells.forEach((cell, col) => {
                        if (cell) {
                            const colLetter = String.fromCharCode(65 + col);
                            result[colLetter + (row + 1)] = { v: cell };
                            maxCol = Math.max(maxCol, col);
                        }
                    });
                });
                result['!ref'] = 'A1:' + String.fromCharCode(65 + maxCol) + lines.length;
                return result;
            },
            sheet_to_json: function(sheet, opts) {
                const range = sheet['!ref'] ? sheet['!ref'].split(':') : ['A1', 'A1'];
                const start = this.decodeCell(range[0]);
                const end = this.decodeCell(range[1]);
                const result = [];
                for (let row = start.row; row <= end.row; row++) {
                    const rowData = [];
                    for (let col = start.col; col <= end.col; col++) {
                        const cell = sheet[this.encodeCell(col, row)];
                        rowData.push(cell ? cell.v : '');
                    }
                    result.push(rowData);
                }
                return result;
            },
            json_to_sheet: function(data) {
                const result = {};
                if (!data.length) return result;
                const headers = Object.keys(data[0]);
                headers.forEach((h, i) => {
                    result[String.fromCharCode(65 + i) + '1'] = { v: h };
                });
                data.forEach((row, i) => {
                    headers.forEach((h, j) => {
                        result[String.fromCharCode(65 + j) + (i + 2)] = { v: row[h] };
                    });
                });
                result['!ref'] = 'A1:' + String.fromCharCode(65 + headers.length - 1) + (data.length + 1);
                return result;
            },
            book_new: function() { return { SheetNames: [], Sheets: {} }; },
            book_append_sheet: function(book, sheet, name) {
                book.SheetNames.push(name);
                book.Sheets[name] = sheet;
            },
            decodeCell: function(cell) {
                const col = cell.charCodeAt(0) - 65;
                const row = parseInt(cell.slice(1)) - 1;
                return { col, row };
            },
            encodeCell: function(col, row) {
                return String.fromCharCode(65 + col) + (row + 1);
            }
        },
        writeFile: function(book, filename) {
            const sheet = book.Sheets[book.SheetNames[0]];
            const range = sheet['!ref'] ? sheet['!ref'].split(':') : ['A1', 'A1'];
            const start = XLSX.utils.decodeCell(range[0]);
            const end = XLSX.utils.decodeCell(range[1]);
            let csv = '';
            for (let row = start.row; row <= end.row; row++) {
                const rowData = [];
                for (let col = start.col; col <= end.col; col++) {
                    const cell = sheet[XLSX.utils.encodeCell(col, row)];
                    rowData.push(cell ? '"' + cell.v + '"' : '');
                }
                csv += rowData.join(',') + '\n';
            }
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename.replace('.xlsx', '.csv');
            a.click();
        }
    };
})();

// Dashboard Variables
let budgetDataStore = [];
let budgetSections = [];
let currentBudgetData = [];
const DASHBOARD_PASSWORD = 'opgbataan2026'; // Simple password protection

// Open Dashboard Modal
function openDashboard() {
    document.getElementById('dashboardModal').classList.add('active');
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('dashboardPassword').value = '';
    document.getElementById('loginError').textContent = '';
    document.body.style.overflow = 'hidden';
}

// Close Dashboard Modal
function closeDashboard() {
    document.getElementById('dashboardModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Login to Dashboard
function loginDashboard() {
    const password = document.getElementById('dashboardPassword').value;
    if (password === DASHBOARD_PASSWORD) {
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').style.display = 'block';
        document.getElementById('loginError').textContent = '';
    } else {
        document.getElementById('loginError').textContent = 'Incorrect password. Please try again.';
    }
}

// Logout
function logoutDashboard() {
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('dashboardPassword').value = '';
}

// Open Budget Uploader
function openBudgetUploader() {
    const uploader = document.getElementById('budgetUploader');
    uploader.style.display = uploader.style.display === 'none' ? 'block' : 'none';
}

// Open Budget Viewer
function openBudgetViewer() {
    document.getElementById('budgetUploader').style.display = 'block';
    document.getElementById('budgetDataDisplay').style.display = 'block';
}

// Handle Budget File Upload
function handleBudgetFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            parseBudgetData(jsonData);
            
            document.getElementById('budgetDataDisplay').style.display = 'block';
            updateBudgetStats();
            updateBudgetTable();
            populateBudgetSectionFilter();
            
            alert('Budget data loaded successfully! ' + budgetDataStore.length + ' records found.');
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing file. Please ensure it is a valid Excel or CSV file.');
        }
    };
    reader.readAsArrayBuffer(file);
}

// Parse Budget Data
function parseBudgetData(rawData) {
    budgetDataStore = [];
    budgetSections = [];
    let currentSection = '';
    
    const startRow = 5;
    
    for (let i = startRow; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;
        
        if (row[0] && !row[1] && !row[2]) {
            currentSection = row[0].toString().trim();
            if (currentSection && !budgetSections.find(s => s.name === currentSection)) {
                budgetSections.push({ name: currentSection, items: 0, totalAmount: 0 });
            }
            continue;
        }
        
        if (row[0] && row[1]) {
            const item = {
                section: currentSection,
                program: row[0] ? row[0].toString().trim() : '',
                code: row[1] ? row[1].toString().trim() : '',
                unit: row[2] ? row[2].toString().trim() : '',
                appropriation: parseBudgetAmount(row[4]),
                ps: parseBudgetAmount(row[5]),
                mooe: parseBudgetAmount(row[6]),
                co: parseBudgetAmount(row[7]),
                fe: parseBudgetAmount(row[8]),
                total: parseBudgetAmount(row[9])
            };
            
            budgetDataStore.push(item);
            const section = budgetSections.find(s => s.name === currentSection);
            if (section) { section.items++; section.totalAmount += item.total; }
        }
    }
    currentBudgetData = [...budgetDataStore];
}

// Parse Amount
function parseBudgetAmount(value) {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    const cleaned = value.toString().replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
}

// Format Amount
function formatBudgetAmount(amount) {
    if (amount === 0) return '-';
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Update Budget Stats
function updateBudgetStats() {
    const totalItems = budgetDataStore.length;
    const totalAmount = budgetDataStore.reduce((sum, item) => sum + item.total, 0);
    const totalSections = budgetSections.length;
    
    const statsGrid = document.getElementById('budgetStatsGrid');
    statsGrid.innerHTML = `
        <div class="budget-stat-card">
            <div class="budget-stat-value">${totalItems}</div>
            <div class="budget-stat-label">Total Programs</div>
        </div>
        <div class="budget-stat-card">
            <div class="budget-stat-value">${totalSections}</div>
            <div class="budget-stat-label">Sections</div>
        </div>
        <div class="budget-stat-card">
            <div class="budget-stat-value">${formatBudgetAmount(totalAmount)}</div>
            <div class="budget-stat-label">Total Budget</div>
        </div>
    `;
}

// Update Budget Table
function updateBudgetTable() {
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = currentBudgetData.map(item => `
        <tr>
            <td><span class="section-tag">${item.section || 'N/A'}</span></td>
            <td>${item.program}</td>
            <td>${item.code}</td>
            <td>${item.unit}</td>
            <td class="amount">${formatBudgetAmount(item.total)}</td>
            <td class="amount">${formatBudgetAmount(item.ps)}</td>
            <td class="amount">${formatBudgetAmount(item.mooe)}</td>
            <td class="amount">${formatBudgetAmount(item.co)}</td>
            <td class="amount">${formatBudgetAmount(item.fe)}</td>
        </tr>
    `).join('');
    
    document.getElementById('recordCount').textContent = `${currentBudgetData.length} records`;
}

// Populate Section Filter
function populateBudgetSectionFilter() {
    const filter = document.getElementById('budgetSectionFilter');
    filter.innerHTML = '<option value="">All Sections</option>' +
        budgetSections.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

// Search Budget Data
function searchBudgetData() {
    const searchTerm = document.getElementById('budgetSearch').value.toLowerCase();
    currentBudgetData = budgetDataStore.filter(item =>
        item.program.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.unit.toLowerCase().includes(searchTerm)
    );
    updateBudgetTable();
}

// Filter by Section
function filterBudgetSection() {
    const section = document.getElementById('budgetSectionFilter').value;
    currentBudgetData = section ? budgetDataStore.filter(item => item.section === section) : [...budgetDataStore];
    updateBudgetTable();
}

// Export Budget
function exportBudget() {
    if (currentBudgetData.length === 0) {
        alert('No data to export. Please upload a file first.');
        return;
    }
    
    const exportData = currentBudgetData.map(item => ({
        'Section': item.section,
        'Program/PPA': item.program,
        'FPP Code': item.code,
        'Implementing Unit': item.unit,
        'Total Appropriation': item.total,
        'PS': item.ps,
        'MOOE': item.mooe,
        'CO': item.co,
        'FE': item.fe
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '2026 AIP Budget');
    XLSX.writeFile(wb, 'AIP_Budget_Export.xlsx');
}

// Clear Budget Data
function clearBudgetData() {
    if (confirm('Are you sure you want to clear all budget data?')) {
        budgetDataStore = [];
        budgetSections = [];
        currentBudgetData = [];
        document.getElementById('budgetDataDisplay').style.display = 'none';
        document.getElementById('budgetFileInput').value = '';
        alert('Budget data cleared.');
    }
}

// Dashboard initialization - called after DOM loads
function initializeDashboard() {
    // Close modal when clicking outside
    const dashboardModal = document.getElementById('dashboardModal');
    if (dashboardModal) {
        dashboardModal.addEventListener('click', function(e) {
            if (e.target === this) closeDashboard();
        });
    }
    
    // Drag and drop for dashboard uploader
    const uploadAreaDashboard = document.getElementById('uploadAreaDashboard');
    if (uploadAreaDashboard) {
        uploadAreaDashboard.addEventListener('dragover', (e) => { e.preventDefault(); uploadAreaDashboard.style.borderColor = '#1e3a8a'; });
        uploadAreaDashboard.addEventListener('dragleave', () => { uploadAreaDashboard.style.borderColor = '#cbd5e1'; });
        uploadAreaDashboard.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadAreaDashboard.style.borderColor = '#cbd5e1';
            if (e.dataTransfer.files.length > 0) {
                document.getElementById('budgetFileInput').files = e.dataTransfer.files;
                handleBudgetFile({ target: { files: e.dataTransfer.files } });
            }
        });
        uploadAreaDashboard.addEventListener('click', () => document.getElementById('budgetFileInput').click());
    }
}

// ==================== AIP VIEW MODAL FUNCTIONS ====================
let aipAllData = [];
let aipSections = [];
let aipFilteredData = [];
let aipCurrentView = 'category';

// AIP Modal initialization - called after DOM loads
function initializeAIPModal() {
    // Close modal when clicking outside
    const aipViewModal = document.getElementById('aipViewModal');
    if (aipViewModal) {
        aipViewModal.addEventListener('click', function(e) {
            if (e.target === this) closeAIPView();
        });
    }
    
    // Update current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
}

function openAIPView() {
    // Try to preload data if available
    if (typeof preloadAIPData === 'function') {
        preloadAIPData();
    }
    
    document.getElementById('aipViewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAIPData();
}

function closeAIPView() {
    document.getElementById('aipViewModal').classList.remove('active');
    document.body.style.overflow = '';
}

function switchAIPView(view) {
    aipCurrentView = view;
    
    // Update tabs
    document.querySelectorAll('.aip-view-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide views
    if (view === 'category') {
        document.getElementById('aipCategoryView').classList.add('active');
        document.getElementById('aipCategoryView').style.display = 'block';
        document.getElementById('aipTableView').style.display = 'none';
        renderAIPCategoryView();
    } else {
        document.getElementById('aipCategoryView').classList.remove('active');
        document.getElementById('aipCategoryView').style.display = 'none';
        document.getElementById('aipTableView').style.display = 'block';
        updateAIPTable();
    }
}

function loadAIPData() {
    // Load data from localStorage (synced from dashboard)
    const storedData = localStorage.getItem('aipBudgetData');
    const storedSections = localStorage.getItem('aipBudgetSections');
    
    if (storedData && storedSections) {
        aipAllData = JSON.parse(storedData);
        aipSections = JSON.parse(storedSections);
        aipFilteredData = [...aipAllData];
        
        document.getElementById('aipNoData').style.display = 'none';
        document.getElementById('aipDataDisplay').style.display = 'block';
        
        updateAIPSummary();
        updateAIPChart();
        
        if (aipCurrentView === 'category') {
            renderAIPCategoryView();
        } else {
            updateAIPTable();
        }
        
        populateAIPSectionFilter();
    } else {
        document.getElementById('aipNoData').style.display = 'block';
        document.getElementById('aipDataDisplay').style.display = 'none';
    }
}

function formatAIPAmount(amount) {
    if (!amount || amount === 0) return '₱0.00';
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateAIPSummary() {
    const totalItems = aipAllData.length;
    const totalAmount = aipAllData.reduce((sum, item) => sum + item.total, 0);
    const totalSections = aipSections.length;
    const avgAmount = totalItems > 0 ? totalAmount / totalItems : 0;
    
    document.getElementById('aipTotalPrograms').textContent = totalItems.toLocaleString();
    document.getElementById('aipTotalSections').textContent = totalSections;
    document.getElementById('aipTotalBudget').textContent = formatAIPAmount(totalAmount);
    document.getElementById('aipAvgBudget').textContent = formatAIPAmount(avgAmount);
}

function updateAIPChart() {
    const container = document.getElementById('aipBarChart');
    
    if (aipSections.length === 0) {
        container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No budget data available</p>';
        return;
    }
    
    const maxAmount = Math.max(...aipSections.map(s => s.totalAmount));
    
    container.innerHTML = aipSections.map(sec => {
        const percent = maxAmount ? (sec.totalAmount / maxAmount * 100).toFixed(1) : 0;
        return `
            <div class="aip-bar-item">
                <div class="aip-bar-label">${sec.name}</div>
                <div class="aip-bar-track">
                    <div class="aip-bar-fill" style="width: ${percent}%"></div>
                </div>
                <div class="aip-bar-value">${formatAIPAmount(sec.totalAmount)}</div>
            </div>
        `;
    }).join('');
}

// ==================== CATEGORY VIEW ====================
function renderAIPCategoryView() {
    const container = document.getElementById('aipBudgetTypes');
    
    if (aipSections.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No Budget Data</h3></div>';
        document.getElementById('aipCategoryCount').textContent = '0 budget types';
        return;
    }
    
    // Group data by section (budget type)
    const sectionData = {};
    aipSections.forEach(sec => {
        sectionData[sec.name] = {
            ...sec,
            programs: aipAllData.filter(item => item.section === sec.name)
        };
    });
    
    // Generate HTML for each budget type
    container.innerHTML = aipSections.map((sec, index) => {
        const data = sectionData[sec.name];
        return `
            <div class="aip-budget-type">
                <div class="aip-type-header" onclick="toggleBudgetType(${index})">
                    <div class="aip-type-title">
                        <i class="fas fa-folder"></i>
                        ${sec.name}
                    </div>
                    <div class="aip-type-stats">
                        <span class="aip-type-stat">
                            <i class="fas fa-file-alt"></i> ${sec.items} programs
                        </span>
                        <span class="aip-type-stat">
                            <i class="fas fa-money-bill-wave"></i> ${formatAIPAmount(sec.totalAmount)}
                        </span>
                    </div>
                    <i class="fas fa-chevron-down aip-type-toggle" id="toggle-${index}"></i>
                </div>
                <div class="aip-nature-list" id="nature-list-${index}">
                    ${renderProgramsByNature(data.programs)}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('aipCategoryCount').textContent = `${aipSections.length} budget types`;
}

function renderProgramsByNature(programs) {
    // Group programs by their nature (simplified - using first word of program name as nature)
    const natureGroups = {};
    
    programs.forEach(prog => {
        // Determine nature based on program keywords
        let nature = 'General';
        const progLower = prog.program.toLowerCase();
        
        if (progLower.includes('construction') || progLower.includes('building')) nature = 'Construction';
        else if (progLower.includes('procurement') || progLower.includes('purchase')) nature = 'Procurement';
        else if (progLower.includes('scholarship') || progLower.includes('education')) nature = 'Education';
        else if (progLower.includes('health') || progLower.includes('medical')) nature = 'Health';
        else if (progLower.includes('assistance') || progLower.includes('aid')) nature = 'Assistance';
        else if (progLower.includes('maintenance') || progLower.includes('operation')) nature = 'Operations';
        else if (progLower.includes('program') || progLower.includes('project')) nature = 'Programs';
        
        if (!natureGroups[nature]) natureGroups[nature] = [];
        natureGroups[nature].push(prog);
    });
    
    // Generate HTML for each nature group
    return Object.entries(natureGroups).map(([nature, items]) => `
        <div class="aip-nature-item">
            <div class="aip-nature-header">
                <span class="aip-nature-title"><i class="fas fa-tag"></i> ${nature}</span>
                <span class="aip-nature-count">${items.length} items</span>
            </div>
            <div class="aip-programs-list">
                ${items.map(item => `
                    <div class="aip-program-item">
                        <div class="aip-program-name">${item.program}</div>
                        <div class="aip-program-code">${item.code}</div>
                        <div class="aip-program-unit">${item.unit}</div>
                        <div class="aip-amount">${formatAIPAmount(item.total)}</div>
                        <div class="aip-amount">${formatAIPAmount(item.ps)}</div>
                        <div class="aip-amount">${formatAIPAmount(item.mooe)}</div>
                        <div class="aip-amount">${formatAIPAmount(item.co)}</div>
                        <div class="aip-amount">${formatAIPAmount(item.fe)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function toggleBudgetType(index) {
    const header = document.querySelector(`#nature-list-${index}`).previousElementSibling;
    const list = document.getElementById(`nature-list-${index}`);
    const toggle = document.getElementById(`toggle-${index}`);
    
    header.classList.toggle('collapsed');
    list.classList.toggle('collapsed');
    toggle.classList.toggle('collapsed');
}

function searchAIPCategory() {
    const searchTerm = document.getElementById('aipCategorySearch').value.toLowerCase();
    
    if (!searchTerm) {
        renderAIPCategoryView();
        return;
    }
    
    // Filter sections based on search
    const filteredSections = aipSections.filter(sec => 
        sec.name.toLowerCase().includes(searchTerm) ||
        aipAllData.some(item => 
            item.section === sec.name && (
                item.program.toLowerCase().includes(searchTerm) ||
                item.code.toLowerCase().includes(searchTerm)
            )
        )
    );
    
    // Temporarily update sections for rendering
    const originalSections = [...aipSections];
    aipSections = filteredSections;
    renderAIPCategoryView();
    aipSections = originalSections;
    
    document.getElementById('aipCategoryCount').textContent = `${filteredSections.length} of ${aipSections.length} budget types`;
}

// ==================== TABLE VIEW ====================
function updateAIPTable() {
    const tbody = document.getElementById('aipTableBody');
    tbody.innerHTML = aipFilteredData.map(item => `
        <tr>
            <td><span class="aip-section-tag">${item.section || 'N/A'}</span></td>
            <td>${item.program}</td>
            <td>${item.code}</td>
            <td>${item.unit}</td>
            <td class="aip-amount">${formatAIPAmount(item.total)}</td>
            <td class="aip-amount">${formatAIPAmount(item.ps)}</td>
            <td class="aip-amount">${formatAIPAmount(item.mooe)}</td>
            <td class="aip-amount">${formatAIPAmount(item.co)}</td>
            <td class="aip-amount">${formatAIPAmount(item.fe)}</td>
        </tr>
    `).join('');
    
    document.getElementById('aipRecordCount').textContent = `${aipFilteredData.length} records`;
}

function populateAIPSectionFilter() {
    const filter = document.getElementById('aipSectionFilter');
    filter.innerHTML = '<option value="">All Budget Types</option>' +
        aipSections.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

function searchAIPData() {
    const searchTerm = document.getElementById('aipSearchInput').value.toLowerCase();
    aipFilteredData = aipAllData.filter(item =>
        item.program.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.unit.toLowerCase().includes(searchTerm)
    );
    updateAIPTable();
}

function filterAIPSection() {
    const section = document.getElementById('aipSectionFilter').value;
    aipFilteredData = section ? aipAllData.filter(item => item.section === section) : [...aipAllData];
    updateAIPTable();
}

// ==================== STUNNING REQUESTS MODAL FUNCTIONS ====================
const requestTypes = {
    'governor-esig': {
        title: "Governor's E-Signature Request",
        icon: "fa-signature",
        description: "Request digital signature from the Governor for official documents"
    },
    'financial-assistance': {
        title: "Financial Assistance Application",
        icon: "fa-hand-holding-usd",
        description: "Apply for provincial financial aid and support programs"
    },
    'obr-signature': {
        title: "OBR Signature Request",
        icon: "fa-stamp",
        description: "Official Budget Review signature for financial documents"
    },
    'pr-signature': {
        title: "PR Signature Request",
        icon: "fa-file-contract",
        description: "Purchase Request approval signature for procurement"
    },
    'dtr': {
        title: "Daily Time Record (DTR)",
        icon: "fa-clock",
        description: "Submit and process employee time records"
    },
    'leave': {
        title: "Leave Application",
        icon: "fa-umbrella-beach",
        description: "Apply for vacation, sick, or emergency leave"
    },
    'certificate': {
        title: "Certificate Request",
        icon: "fa-certificate",
        description: "Request clearance, employment, or service certificates"
    },
    'travel': {
        title: "Travel Order Request",
        icon: "fa-plane",
        description: "Request official travel authorization"
    }
};

let currentRequestType = '';

function openRequestsModal() {
    const modal = document.getElementById('requestsModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Show the grid, hide the form
        showRequestsGrid();
    }
}

function closeRequestsModal() {
    const modal = document.getElementById('requestsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showRequestsGrid() {
    const grid = document.querySelector('.requests-grid');
    const form = document.getElementById('requestFormContainer');
    if (grid && form) {
        grid.style.display = 'grid';
        form.style.display = 'none';
    }
}

function openRequestForm(requestType) {
    currentRequestType = requestType;
    const grid = document.querySelector('.requests-grid');
    const form = document.getElementById('requestFormContainer');
    const formTitle = document.getElementById('requestFormTitle');
    
    if (grid && form && formTitle) {
        const requestInfo = requestTypes[requestType];
        formTitle.innerHTML = `<i class="fas ${requestInfo.icon}"></i> ${requestInfo.title}`;
        
        grid.style.display = 'none';
        form.style.display = 'block';
        
        // Reset form
        document.getElementById('requestForm').reset();
    }
}

function showRequestSuccessScreen(formData) {
    // Hide form
    document.getElementById('requestFormContainer').style.display = 'none';
    
    // Show success screen
    const successScreen = document.getElementById('requestSuccessScreen');
    successScreen.style.display = 'block';
    
    // Populate data
    document.getElementById('successRequestId').textContent = formData.id;
    document.getElementById('successTimestamp').textContent = new Date(formData.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) + ' (GMT+8)';
    
    // Set processing time based on request type
    const processingTimes = {
        'governor-esig': '1-2 days',
        'financial-assistance': '3-5 days',
        'obr-signature': '1-2 days',
        'pr-signature': '2-3 days',
        'dtr': 'Same day',
        'leave': '1-2 days',
        'certificate': '2-3 days',
        'travel': '2-3 days'
    };
    document.getElementById('successProcessingTime').textContent = processingTimes[formData.type] || '2-3 days';
    
    // Reset form for next time
    document.getElementById('requestForm').reset();
}

function downloadRequestReceipt() {
    const requestData = JSON.parse(localStorage.getItem('currentRequestReceipt') || '{}');
    if (!requestData.id) {
        showNotification('No receipt available', 'error');
        return;
    }
    
    const processingTimes = {
        'governor-esig': '1-2 days',
        'financial-assistance': '3-5 days',
        'obr-signature': '1-2 days',
        'pr-signature': '2-3 days',
        'dtr': 'Same day',
        'leave': '1-2 days',
        'certificate': '2-3 days',
        'travel': '2-3 days'
    };
    
    const requestTypeNames = {
        'governor-esig': "Governor's E-Signature",
        'financial-assistance': 'Financial Assistance',
        'obr-signature': 'OBR Signature',
        'pr-signature': 'PR Signature',
        'dtr': 'Daily Time Record (DTR)',
        'leave': 'Leave Application',
        'certificate': 'Certificate Request',
        'travel': 'Travel Order'
    };
    
    const receiptContent = `
========================================
   OFFICE OF THE PROVINCIAL GOVERNOR
         BATAAN PROVINCE
========================================

        REQUEST RECEIPT
----------------------------------------

Request ID: ${requestData.id}
Request Type: ${requestTypeNames[requestData.type] || requestData.type}

Submitted By:
  Name: ${requestData.name}
  Phone: ${requestData.phone}
  Office/Department: ${requestData.office || 'N/A'}

Details:
${requestData.purpose}

----------------------------------------
Submitted: ${new Date(requestData.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)
Status: Pending Review
Expected Processing: ${processingTimes[requestData.type] || '2-3 days'}
----------------------------------------

Thank you for using our e-Request system.
For inquiries, contact opg@bataan.gov.ph

========================================
    `;
    
    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Request_Receipt_${requestData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Receipt downloaded successfully!', 'success');
}

function showRequestsGrid() {
    const grid = document.querySelector('.requests-grid');
    const form = document.getElementById('requestFormContainer');
    const successScreen = document.getElementById('requestSuccessScreen');
    const trackInterface = document.getElementById('trackRequestInterface');
    const trackResult = document.getElementById('trackResult');
    const allRequestsInterface = document.getElementById('allRequestsInterface');
    
    if (grid && form) {
        grid.style.display = 'grid';
        form.style.display = 'none';
    }
    if (successScreen) {
        successScreen.style.display = 'none';
    }
    if (trackInterface) {
        trackInterface.style.display = 'none';
    }
    if (trackResult) {
        trackResult.style.display = 'none';
    }
    if (allRequestsInterface) {
        allRequestsInterface.style.display = 'none';
    }
}

function showAllRequestsInterface() {
    const grid = document.querySelector('.requests-grid');
    const allRequestsInterface = document.getElementById('allRequestsInterface');
    
    if (grid && allRequestsInterface) {
        grid.style.display = 'none';
        allRequestsInterface.style.display = 'block';
        renderAllRequests();
    }
}

function renderAllRequests() {
    const requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    const container = document.getElementById('allRequestsList');
    const countElement = document.getElementById('totalRequestsCount');
    
    if (countElement) {
        countElement.textContent = `${requests.length} total request${requests.length !== 1 ? 's' : ''}`;
    }
    
    if (requests.length === 0) {
        container.innerHTML = `
            <div class="empty-requests">
                <i class="fas fa-inbox"></i>
                <h3>No Requests Found</h3>
                <p>No requests have been submitted yet.</p>
            </div>
        `;
        return;
    }
    
    const requestTypeNames = {
        'governor-esig': "Governor's E-Signature",
        'financial-assistance': 'Financial Assistance',
        'obr-signature': 'OBR Signature',
        'pr-signature': 'PR Signature',
        'dtr': 'Daily Time Record (DTR)',
        'leave': 'Leave Application',
        'certificate': 'Certificate Request',
        'travel': 'Travel Order'
    };
    
    // Helper function to format time (for renderAllRequests)
    function formatTime(dateString, req) {
        // Use timestamp as fallback if submittedAt is missing
        const effectiveDate = dateString || (req ? req.timestamp : null);
        if (!effectiveDate) return 'N/A';
        try {
            const date = new Date(effectiveDate);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
        } catch (e) {
            return 'N/A';
        }
    }
    
    // Helper function to calculate running time (for renderAllRequests)
    function getRunningTime(submittedAt, status, completedAt, req) {
        // Use timestamp as fallback if submittedAt is missing
        const effectiveSubmittedAt = submittedAt || (req ? req.timestamp : null);
        if (!effectiveSubmittedAt) return 'N/A';
        
        const submitted = new Date(effectiveSubmittedAt);
        if (isNaN(submitted.getTime())) return 'N/A';
        
        const now = new Date();
        
        let diffMs;
        if (status === 'completed' && completedAt) {
            const completed = new Date(completedAt);
            if (isNaN(completed.getTime())) return 'N/A';
            diffMs = completed - submitted;
        } else {
            // For pending/processing - show time elapsed
            diffMs = now - submitted;
        }
        
        // Calculate all time units
        const diffSecs = Math.floor((diffMs / 1000) % 60);
        const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
        const diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        // Build formatted string
        const parts = [];
        if (diffDays > 0) parts.push(`${diffDays}d`);
        if (diffHrs > 0) parts.push(`${diffHrs}h`);
        if (diffMins > 0) parts.push(`${diffMins}m`);
        parts.push(`${diffSecs}s`);
        
        return parts.join(' ');
    }
    
    // Sort by newest first
    const sortedRequests = [...requests].sort((a, b) => new Date(b.submittedAt || b.timestamp) - new Date(a.submittedAt || a.timestamp));
    
    container.innerHTML = sortedRequests.map(req => {
        const submittedTime = formatTime(req.submittedAt, req);
        const runningTime = getRunningTime(req.submittedAt, req.status, req.statusUpdatedAt, req);
        const completedTime = req.status === 'completed' ? formatTime(req.statusUpdatedAt, req) : null;
        
        return `
        <div class="request-item" data-type="${req.type}" data-status="${req.status || 'pending'}">
            <div class="request-item-info">
                <h4>${requestTypeNames[req.type] || req.type}</h4>
                <p>Submitted by: ${req.name}</p>
                <div class="request-item-meta">
                    <span><i class="fas fa-phone"></i> ${req.phone}</span>
                    <span><i class="fas fa-clock"></i> <strong>Time Submitted:</strong> ${submittedTime} (GMT+8)</span>
                    ${req.status === 'completed' 
                        ? `<span><i class="fas fa-check-circle"></i> <strong>Time Completed:</strong> ${completedTime} (GMT+8)</span>`
                        : `<span><i class="fas fa-hourglass-half"></i> <strong>Running Time:</strong> ${runningTime}</span>`
                    }
                </div>
            </div>
            <div class="request-item-id">${req.id}</div>
            <div class="request-item-actions">
                <div class="request-item-status ${req.status || 'pending'}">${(req.status || 'pending').replace('-', ' ').toUpperCase()}</div>
                ${req.status === 'completed' ? `<button onclick="downloadCompletedRequest('${req.id}')" class="btn-download-completed" title="Download Completed Document"><i class="fas fa-download"></i></button>` : ''}
            </div>
        </div>
    `}).join('');
}

function filterAllRequests() {
    const searchTerm = document.getElementById('allRequestsSearch').value.toLowerCase();
    const typeFilter = document.getElementById('allRequestsFilter').value;
    const statusFilter = document.getElementById('allRequestsStatusFilter').value;
    
    const requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    const container = document.getElementById('allRequestsList');
    const countElement = document.getElementById('totalRequestsCount');
    
    const requestTypeNames = {
        'governor-esig': "Governor's E-Signature",
        'financial-assistance': 'Financial Assistance',
        'obr-signature': 'OBR Signature',
        'pr-signature': 'PR Signature',
        'dtr': 'Daily Time Record (DTR)',
        'leave': 'Leave Application',
        'certificate': 'Certificate Request',
        'travel': 'Travel Order'
    };
    
    let filtered = requests.filter(req => {
        const matchesSearch = !searchTerm || 
            req.name.toLowerCase().includes(searchTerm) || 
            req.id.toLowerCase().includes(searchTerm) || 
            (requestTypeNames[req.type] || req.type).toLowerCase().includes(searchTerm);
        
        const matchesType = !typeFilter || req.type === typeFilter;
        const matchesStatus = !statusFilter || (req.status || 'pending') === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    // Helper function to format time (for filterAllRequests)
    function formatTime(dateString, req) {
        // Use timestamp as fallback if submittedAt is missing
        const effectiveDate = dateString || (req ? req.timestamp : null);
        if (!effectiveDate) return 'N/A';
        try {
            const date = new Date(effectiveDate);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
        } catch (e) {
            return 'N/A';
        }
    }
    
    // Helper function to calculate running time (for filterAllRequests)
    function getRunningTime(submittedAt, status, completedAt, req) {
        // Use timestamp as fallback if submittedAt is missing
        const effectiveSubmittedAt = submittedAt || (req ? req.timestamp : null);
        if (!effectiveSubmittedAt) return 'N/A';
        
        const submitted = new Date(effectiveSubmittedAt);
        if (isNaN(submitted.getTime())) return 'N/A';
        
        const now = new Date();
        
        let diffMs;
        if (status === 'completed' && completedAt) {
            const completed = new Date(completedAt);
            if (isNaN(completed.getTime())) return 'N/A';
            diffMs = completed - submitted;
        } else {
            // For pending/processing - show time elapsed
            diffMs = now - submitted;
        }
        
        // Calculate all time units
        const diffSecs = Math.floor((diffMs / 1000) % 60);
        const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
        const diffHrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        // Build formatted string
        const parts = [];
        if (diffDays > 0) parts.push(`${diffDays}d`);
        if (diffHrs > 0) parts.push(`${diffHrs}h`);
        if (diffMins > 0) parts.push(`${diffMins}m`);
        parts.push(`${diffSecs}s`);
        
        return parts.join(' ');
    }
    
    // Sort by newest first
    filtered.sort((a, b) => new Date(b.submittedAt || b.timestamp) - new Date(a.submittedAt || a.timestamp));
    
    if (countElement) {
        countElement.textContent = `${filtered.length} request${filtered.length !== 1 ? 's' : ''} found`;
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-requests">
                <i class="fas fa-search"></i>
                <h3>No Matching Requests</h3>
                <p>No requests match your search criteria.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(req => {
        const submittedTime = formatTime(req.submittedAt, req);
        const runningTime = getRunningTime(req.submittedAt, req.status, req.statusUpdatedAt, req);
        const completedTime = req.status === 'completed' ? formatTime(req.statusUpdatedAt, req) : null;
        
        return `
        <div class="request-item" data-type="${req.type}" data-status="${req.status || 'pending'}">
            <div class="request-item-info">
                <h4>${requestTypeNames[req.type] || req.type}</h4>
                <p>Submitted by: ${req.name}</p>
                <div class="request-item-meta">
                    <span><i class="fas fa-phone"></i> ${req.phone}</span>
                    <span><i class="fas fa-clock"></i> <strong>Time Submitted:</strong> ${submittedTime} (GMT+8)</span>
                    ${req.status === 'completed' 
                        ? `<span><i class="fas fa-check-circle"></i> <strong>Time Completed:</strong> ${completedTime} (GMT+8)</span>`
                        : `<span><i class="fas fa-hourglass-half"></i> <strong>Running Time:</strong> ${runningTime}</span>`
                    }
                </div>
            </div>
            <div class="request-item-id">${req.id}</div>
            <div class="request-item-actions">
                <div class="request-item-status ${req.status || 'pending'}">${(req.status || 'pending').replace('-', ' ').toUpperCase()}</div>
                ${req.status === 'completed' ? `<button onclick="downloadCompletedRequest('${req.id}')" class="btn-download-completed" title="Download Completed Document"><i class="fas fa-download"></i></button>` : ''}
            </div>
        </div>
    `}).join('');
}

function downloadCompletedRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    const requestTypeNames = {
        'governor-esig': "Governor's E-Signature",
        'financial-assistance': 'Financial Assistance',
        'obr-signature': 'OBR Signature',
        'pr-signature': 'PR Signature',
        'dtr': 'Daily Time Record (DTR)',
        'leave': 'Leave Application',
        'certificate': 'Certificate Request',
        'travel': 'Travel Order'
    };
    
    const completedContent = `
========================================
   OFFICE OF THE PROVINCIAL GOVERNOR
         BATAAN PROVINCE
========================================

      COMPLETED REQUEST DOCUMENT
----------------------------------------

Request ID: ${request.id}
Request Type: ${requestTypeNames[request.type] || request.type}

Submitted By:
  Name: ${request.name}
  Phone: ${request.phone}
  Office/Department: ${request.office || 'N/A'}

Details:
${request.purpose}

----------------------------------------
Submitted: ${new Date(request.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)
Status: COMPLETED
Completed Date: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)
----------------------------------------

This document certifies that the request has been
processed and completed by the Office of the 
Provincial Governor.

For verification, contact opg@bataan.gov.ph
View all requests at: employee-dashboard.html

========================================
    `;
    
    // Create and download file
    const blob = new Blob([completedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Completed_Request_${request.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Completed document downloaded!', 'success');
}

function showTrackRequestInterface() {
    const grid = document.querySelector('.requests-grid');
    const trackInterface = document.getElementById('trackRequestInterface');
    const trackResult = document.getElementById('trackResult');
    
    if (grid && trackInterface) {
        grid.style.display = 'none';
        trackInterface.style.display = 'block';
    }
    if (trackResult) {
        trackResult.style.display = 'none';
    }
}

function trackRequest() {
    const requestId = document.getElementById('trackRequestId').value.trim();
    const resultDiv = document.getElementById('trackResult');
    
    if (!requestId) {
        showTrackResult(false, 'Please enter a Request ID');
        return;
    }
    
    // Search in localStorage
    const requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    const found = requests.find(r => r.id === requestId);
    
    if (found) {
        showTrackResult(true, found);
    } else {
        showTrackResult(false, 'Request not found. Please check your Request ID and try again.');
    }
}

function showTrackResult(found, data) {
    const resultDiv = document.getElementById('trackResult');
    
    if (!found) {
        resultDiv.className = 'track-result not-found';
        resultDiv.innerHTML = `
            <div class="track-result-header">
                <i class="fas fa-times-circle"></i>
                <h4>Request Not Found</h4>
            </div>
            <p style="color: #64748b; text-align: center;">${data}</p>
        `;
    } else {
        const requestTypeNames = {
            'governor-esig': "Governor's E-Signature",
            'financial-assistance': 'Financial Assistance',
            'obr-signature': 'OBR Signature',
            'pr-signature': 'PR Signature',
            'dtr': 'Daily Time Record (DTR)',
            'leave': 'Leave Application',
            'certificate': 'Certificate Request',
            'travel': 'Travel Order'
        };
        
        const processingTimes = {
            'governor-esig': '1-2 days',
            'financial-assistance': '3-5 days',
            'obr-signature': '1-2 days',
            'pr-signature': '2-3 days',
            'dtr': 'Same day',
            'leave': '1-2 days',
            'certificate': '2-3 days',
            'travel': '2-3 days'
        };
        
        resultDiv.className = 'track-result found';
        resultDiv.innerHTML = `
            <div class="track-result-header">
                <i class="fas fa-check-circle"></i>
                <h4>Request Found!</h4>
            </div>
            <div class="track-result-details">
                <div class="track-result-item">
                    <span class="track-result-label">Request ID:</span>
                    <span class="track-result-value">${data.id}</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Request Type:</span>
                    <span class="track-result-value">${requestTypeNames[data.type] || data.type}</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Submitted By:</span>
                    <span class="track-result-value">${data.name}</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Phone:</span>
                    <span class="track-result-value">${data.phone}</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Submitted:</span>
                    <span class="track-result-value">${new Date(data.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })} (GMT+8)</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Status:</span>
                    <span class="track-result-value" style="color: #d97706; font-weight: 700;">Pending Review</span>
                </div>
                <div class="track-result-item">
                    <span class="track-result-label">Expected Processing:</span>
                    <span class="track-result-value">${processingTimes[data.type] || '2-3 days'}</span>
                </div>
            </div>
        `;
    }
    
    resultDiv.style.display = 'block';
}

// Close requests modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('requestsModal');
    if (event.target === modal) {
        closeRequestsModal();
    }
});

// ==================== SIGN IN POPUP FUNCTION ====================
function openSignInPopup() {
    const popup = window.open('employee-dashboard.html', 'EmployeeDashboard', 'width=1400,height=900,scrollbars=yes,resizable=yes,top=50,left=50');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        alert('Please allow popups for this website to open the Sign In page.');
    }
    return false;
}

// ==================== PRICE LIST MODAL FUNCTIONS ====================
function openPriceListModal() {
    const modal = document.getElementById('priceListModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Show all categories by default
        filterPriceList('all');
    }
}

function closePriceListModal() {
    const modal = document.getElementById('priceListModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function filterPriceList(category) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.price-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick').includes(`'${category}'`)) {
            tab.classList.add('active');
        }
    });
    
    // Filter categories
    const categories = document.querySelectorAll('.price-category');
    categories.forEach(cat => {
        if (category === 'all') {
            cat.style.display = 'block';
        } else {
            const catType = cat.getAttribute('data-category');
            cat.style.display = catType === category ? 'block' : 'none';
        }
    });
    
    // Clear search when changing tabs
    const searchInput = document.getElementById('priceSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

function searchPriceList() {
    const searchTerm = document.getElementById('priceSearchInput').value.toLowerCase();
    const categories = document.querySelectorAll('.price-category');
    
    categories.forEach(category => {
        const items = category.querySelectorAll('tbody tr');
        let hasVisibleItems = false;
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = '';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide category based on whether it has visible items
        category.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Close price list modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('priceListModal');
    if (event.target === modal) {
        closePriceListModal();
    }
});

// Close price list modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePriceListModal();
    }
});



// ==================== FILE PREVIEW AND SIGNATURE FUNCTIONS ====================

// Store uploaded files with data
let uploadedFiles = [];
let signatureData = null;

// Convert File to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle file selection
async function handleFileSelect(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = Array.from(event.target.files);
    const container = document.getElementById('filePreviewContainer');
    const list = document.getElementById('filePreviewList');
    const uploadArea = document.getElementById('fileUploadArea');
    
    for (const file of files) {
        // Check if file already exists
        if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
            // Convert to base64 and store
            try {
                const data = await fileToBase64(file);
                uploadedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: data
                });
            } catch (err) {
                console.error('Error reading file:', err);
            }
        }
    }
    
    // Show container
    container.style.display = 'block';
    uploadArea.classList.add('has-files');
    
    // Render previews
    renderFilePreviews();
    
    // Clear the file input value so the same file can be selected again if needed
    event.target.value = '';
}

// Render file previews
function renderFilePreviews() {
    const list = document.getElementById('filePreviewList');
    list.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'file-preview-item';
        
        // Check if image
        const isImage = file.type && file.type.startsWith('image/');
        
        let iconHtml = '';
        if (isImage) {
            iconHtml = `<img src="${file.data}" class="file-preview-thumbnail" alt="${file.name}" onclick="viewFile(${index})">`;
        } else {
            let icon = 'fa-file';
            if (file.name.endsWith('.pdf')) icon = 'fa-file-pdf';
            else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) icon = 'fa-file-word';
            iconHtml = `<div class="file-preview-icon" onclick="viewFile(${index})"><i class="fas ${icon}"></i></div>`;
        }
        
        const size = formatFileSize(file.size);
        
        previewItem.innerHTML = `
            ${iconHtml}
            <div class="file-preview-info">
                <div class="file-preview-name" title="${file.name}">${file.name}</div>
                <div class="file-preview-size">${size}</div>
            </div>
            <div class="file-preview-actions">
                <button type="button" class="file-preview-btn" onclick="viewFile(${index})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button type="button" class="file-preview-btn remove" onclick="removeFile(${index})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        list.appendChild(previewItem);
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// View file
function viewFile(index) {
    const file = uploadedFiles[index];
    const isImage = file.type && file.type.startsWith('image/');
    
    if (isImage) {
        // Show image in modal
        showImageModal(file.data, file.name);
    } else {
        // For PDFs and docs, create a download/view link
        window.open(file.data, '_blank');
    }
}

// Show image modal
function showImageModal(imageUrl, title) {
    // Create modal if doesn't exist
    let modal = document.getElementById('imageViewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageViewModal';
        modal.className = 'image-view-modal';
        modal.innerHTML = `
            <div class="image-view-content">
                <div class="image-view-header">
                    <h3 id="imageViewTitle"></h3>
                    <button onclick="closeImageModal()" class="image-view-close">&times;</button>
                </div>
                <div class="image-view-body">
                    <img id="imageViewImg" src="" alt="">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .image-view-modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 5000;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .image-view-content {
                background: white;
                border-radius: 12px;
                max-width: 90%;
                max-height: 90%;
                overflow: hidden;
            }
            .image-view-header {
                background: #1e3a8a;
                color: white;
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .image-view-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }
            .image-view-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            .image-view-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .image-view-body {
                padding: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                max-height: 70vh;
                overflow: auto;
            }
            .image-view-body img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }
    
    modal.style.display = 'flex';
    document.getElementById('imageViewTitle').textContent = title;
    document.getElementById('imageViewImg').src = imageUrl;
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('imageViewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Remove file
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFilePreviews();
    
    // Hide container if no files
    if (uploadedFiles.length === 0) {
        document.getElementById('filePreviewContainer').style.display = 'none';
        document.getElementById('fileUploadArea').classList.remove('has-files');
    }
}

// ==================== SIGNATURE FUNCTIONS ====================

// Open signature pad
function openSignaturePad() {
    const modal = document.getElementById('signaturePadModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize canvas
    initSignatureCanvas();
}

// Close signature pad
function closeSignaturePad() {
    const modal = document.getElementById('signaturePadModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Signature canvas variables
let signatureCanvas = null;
let signatureCtx = null;
let isDrawing = false;

// Initialize signature canvas
function initSignatureCanvas() {
    signatureCanvas = document.getElementById('signatureCanvas');
    signatureCtx = signatureCanvas.getContext('2d');
    
    // Set canvas size
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCanvas.width = rect.width;
    signatureCanvas.height = rect.height;
    
    // Set drawing style
    signatureCtx.strokeStyle = '#1e3a8a';
    signatureCtx.lineWidth = 2;
    signatureCtx.lineCap = 'round';
    
    // Add event listeners
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    signatureCanvas.addEventListener('touchstart', handleTouch);
    signatureCanvas.addEventListener('touchmove', handleTouch);
    signatureCanvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.beginPath();
    signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    signatureCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    signatureCanvas.dispatchEvent(mouseEvent);
}

// Clear signature pad
function clearSignaturePad() {
    if (signatureCtx && signatureCanvas) {
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    }
}

// Save signature from pad
function saveSignatureFromPad() {
    if (!signatureCanvas) return;
    
    // Check if canvas is empty
    const pixelData = signatureCtx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height).data;
    const isEmpty = pixelData.every(pixel => pixel === 0);
    
    if (isEmpty) {
        alert('Please draw your signature first.');
        return;
    }
    
    // Convert to image
    signatureData = signatureCanvas.toDataURL('image/png');
    
    // Show preview
    showSignaturePreview(signatureData);
    
    // Close modal
    closeSignaturePad();
}

// Handle signature upload
function handleSignatureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, JPEG).');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        signatureData = e.target.result;
        showSignaturePreview(signatureData);
    };
    reader.readAsDataURL(file);
}

// Show signature preview
function showSignaturePreview(dataUrl) {
    const preview = document.getElementById('signaturePreview');
    const image = document.getElementById('signatureImage');
    
    image.src = dataUrl;
    preview.style.display = 'block';
}

// Remove signature
function removeSignature() {
    signatureData = null;
    document.getElementById('signaturePreview').style.display = 'none';
    document.getElementById('signatureImage').src = '';
    document.getElementById('signatureUpload').value = '';
}

// Update submitRequest to include files and signature
function submitRequest(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('reqName').value;
    const phone = document.getElementById('reqPhone').value;
    const office = document.getElementById('reqOffice').value;
    const purpose = document.getElementById('reqPurpose').value;
    
    // Get existing requests to calculate upload number per request type (all history)
    let requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    
    // Count ALL requests of the SAME request type (across all history)
    const typeRequests = requests.filter(req => req.type === currentRequestType);
    const uploadNumber = typeRequests.length + 1;
    
    // Create request ID in format MM/DD/YYYY-No. (per request type, all history)
    const requestId = `${todayStr}-${uploadNumber}`;
    
    // Create request object
    const requestData = {
        id: requestId,
        name: name,
        phone: phone,
        office: office,
        purpose: purpose,
        type: currentRequestType,
        status: 'pending',
        timestamp: now.toISOString(),
        submittedAt: now.toISOString(),
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size })),
        hasSignature: !!signatureData
    };
    
    // Save to localStorage
    requests.push(requestData);
    localStorage.setItem('submittedRequests', JSON.stringify(requests));
    
    // Store signature separately if exists
    if (signatureData) {
        localStorage.setItem('signature_' + requestData.id, signatureData);
    }
    
    // Show success screen
    showRequestSuccessScreen(requestData);
    
    // Close the requests modal
    closeRequestsModal();
    
    // Reset form
    document.getElementById('requestForm').reset();
    uploadedFiles = [];
    removeSignature();
    document.getElementById('filePreviewContainer').style.display = 'none';
    document.getElementById('fileUploadArea').classList.remove('has-files');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const imageModal = document.getElementById('imageViewModal');
    if (event.target === imageModal) {
        closeImageModal();
    }
    
    const sigModal = document.getElementById('signaturePadModal');
    if (event.target === sigModal) {
        closeSignaturePad();
    }
});

// Escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
        closeSignaturePad();
    }
});

// Drag and drop support
const fileUploadArea = document.getElementById('fileUploadArea');
if (fileUploadArea) {
    fileUploadArea.addEventListener('click', (e) => {
        // Don't trigger if clicking the file input directly (let the input handle it)
        if (e.target.id === 'reqDocuments') return;
        document.getElementById('reqDocuments').click();
    });
    
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#3b82f6';
        fileUploadArea.style.background = '#f0f9ff';
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.borderColor = '';
        fileUploadArea.style.background = '';
    });
    
    fileUploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '';
        fileUploadArea.style.background = '';
        
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
                try {
                    const data = await fileToBase64(file);
                    uploadedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        data: data
                    });
                } catch (err) {
                    console.error('Error reading file:', err);
                }
            }
        }
        
        document.getElementById('filePreviewContainer').style.display = 'block';
        fileUploadArea.classList.add('has-files');
        renderFilePreviews();
    });
}

// ==================== PRICE LIST COLLECTION FUNCTIONS ====================

// Store collected items
let collectedItems = JSON.parse(localStorage.getItem('priceListCollection') || '[]');

// Add item to collection
function addToCollection(item, unit, priceRange, avgPrice) {
    // Check if item already exists
    if (collectedItems.find(i => i.item === item)) {
        showNotification('Item already in collection!', 'warning');
        return;
    }
    
    collectedItems.push({
        item: item,
        unit: unit,
        priceRange: priceRange,
        avgPrice: avgPrice,
        addedAt: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('priceListCollection', JSON.stringify(collectedItems));
    
    // Update count
    updateCollectedCount();
    
    // Show notification
    showNotification(`${item} added to collection!`, 'success');
}

// Update collected count badge
function updateCollectedCount() {
    const badge = document.getElementById('collectedCount');
    if (badge) {
        badge.textContent = collectedItems.length;
        badge.style.display = collectedItems.length > 0 ? 'inline-flex' : 'none';
    }
}

// Show collected items
function showCollectedItems() {
    // Create modal if doesn't exist
    let modal = document.getElementById('collectedItemsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'collectedItemsModal';
        modal.className = 'collected-items-modal';
        modal.innerHTML = `
            <div class="collected-items-content">
                <div class="collected-items-header">
                    <h3><i class="fas fa-clipboard-list"></i> Collected Items</h3>
                    <button onclick="closeCollectedItems()" class="collected-items-close">&times;</button>
                </div>
                <div class="collected-items-body" id="collectedItemsBody">
                    <div class="collected-items-list" id="collectedItemsList"></div>
                </div>
                <div class="collected-items-footer">
                    <button onclick="clearCollection()" class="btn-clear-collection">
                        <i class="fas fa-trash"></i> Clear All
                    </button>
                    <button onclick="exportCollection()" class="btn-export-collection">
                        <i class="fas fa-download"></i> Export List
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .collected-items-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 5000;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .collected-items-modal.active {
                display: flex;
            }
            .collected-items-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .collected-items-header {
                background: #1e3a8a;
                color: white;
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .collected-items-header h3 {
                margin: 0;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .collected-items-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            .collected-items-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .collected-items-body {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }
            .collected-items-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .collected-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            .collected-item-info {
                flex: 1;
            }
            .collected-item-name {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 2px;
            }
            .collected-item-details {
                font-size: 0.85rem;
                color: #64748b;
            }
            .collected-item-price {
                font-weight: 600;
                color: #059669;
                font-size: 1rem;
            }
            .btn-remove-item {
                background: #fee2e2;
                color: #ef4444;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .btn-remove-item:hover {
                background: #ef4444;
                color: white;
            }
            .collected-items-empty {
                text-align: center;
                padding: 40px 20px;
                color: #64748b;
            }
            .collected-items-empty i {
                font-size: 3rem;
                margin-bottom: 10px;
                color: #cbd5e1;
            }
            .collected-items-footer {
                display: flex;
                gap: 10px;
                padding: 1rem;
                border-top: 1px solid #e2e8f0;
                justify-content: flex-end;
            }
            .btn-clear-collection {
                background: #fee2e2;
                color: #ef4444;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }
            .btn-clear-collection:hover {
                background: #ef4444;
                color: white;
            }
            .btn-export-collection {
                background: #1e3a8a;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }
            .btn-export-collection:hover {
                background: #1e40af;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Render collected items
    renderCollectedItems();
    
    // Show modal
    modal.classList.add('active');
}

// Render collected items list
function renderCollectedItems() {
    const list = document.getElementById('collectedItemsList');
    
    if (collectedItems.length === 0) {
        list.innerHTML = `
            <div class="collected-items-empty">
                <i class="fas fa-clipboard-list"></i>
                <p>No items collected yet.</p>
                <p>Click the + button on items to add them to your collection.</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = collectedItems.map((item, index) => `
        <div class="collected-item">
            <div class="collected-item-info">
                <div class="collected-item-name">${item.item}</div>
                <div class="collected-item-details">${item.unit} • Range: ${item.priceRange}</div>
            </div>
            <div class="collected-item-price">${item.avgPrice}</div>
            <button class="btn-remove-item" onclick="removeFromCollection(${index})" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove item from collection
function removeFromCollection(index) {
    collectedItems.splice(index, 1);
    localStorage.setItem('priceListCollection', JSON.stringify(collectedItems));
    renderCollectedItems();
    updateCollectedCount();
}

// Close collected items modal
function closeCollectedItems() {
    const modal = document.getElementById('collectedItemsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Clear all collected items
function clearCollection() {
    if (confirm('Are you sure you want to clear all collected items?')) {
        collectedItems = [];
        localStorage.removeItem('priceListCollection');
        renderCollectedItems();
        updateCollectedCount();
        showNotification('Collection cleared!', 'success');
    }
}

// Export collection to Word Document (.docx)
function exportCollection() {
    if (collectedItems.length === 0) {
        showNotification('No items to export!', 'warning');
        return;
    }
    
    // Create Word-compatible HTML content
    let content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Price List Collection</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #1e3a8a; font-size: 24px; margin-bottom: 10px; }
        .subtitle { color: #64748b; font-size: 12px; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1e3a8a; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) { background: #f8fafc; }
        .number { text-align: center; font-weight: bold; color: #64748b; }
        .price { color: #059669; font-weight: 600; }
    </style>
</head>
<body>
    <h1>Price List Collection</h1>
    <div class="subtitle">Generated: ${new Date().toLocaleString()}</div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 50px;">#</th>
                <th>Item</th>
                <th>Unit</th>
                <th>Price Range (PHP)</th>
                <th>Average Price</th>
            </tr>
        </thead>
        <tbody>
${collectedItems.map((item, index) => `
            <tr>
                <td class="number">${index + 1}</td>
                <td>${item.item}</td>
                <td>${item.unit}</td>
                <td>${item.priceRange}</td>
                <td class="price">${item.avgPrice}</td>
            </tr>
`).join('')}
        </tbody>
    </table>
</body>
</html>`;
    
    // Create and download as .doc file (Word can open HTML as doc)
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Price_List_Collection.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Collection exported to Word!', 'success');
}

// Update count on page load
updateCollectedCount();

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('collectedItemsModal');
    if (event.target === modal) {
        closeCollectedItems();
    }
});
