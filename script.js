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
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => {
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

function submitRequest(event) {
    event.preventDefault();
    
    const formData = {
        type: currentRequestType,
        name: document.getElementById('reqName').value,
        phone: document.getElementById('reqPhone').value,
        office: document.getElementById('reqOffice').value,
        purpose: document.getElementById('reqPurpose').value,
        submittedAt: new Date().toISOString(),
        id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };
    
    // Handle file uploads if any
    const fileInput = document.getElementById('reqDocuments');
    if (fileInput.files.length > 0 && typeof handleFileUploadForEmail === 'function') {
        handleFileUploadForEmail(fileInput.files, formData);
    }
    
    // Store in localStorage (simulate submission)
    let requests = JSON.parse(localStorage.getItem('submittedRequests') || '[]');
    requests.push(formData);
    localStorage.setItem('submittedRequests', JSON.stringify(requests));
    
    // Store current request for receipt download
    localStorage.setItem('currentRequestReceipt', JSON.stringify(formData));
    
    // Send email notifications if email service is available
    if (typeof sendEmail === 'function' && typeof EMAIL_TEMPLATES !== 'undefined') {
        // Send to admin
        sendEmail('opg@bataan.gov.ph', EMAIL_TEMPLATES.newRequest, formData);
    }
    
    // Show success screen
    showRequestSuccessScreen(formData);
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
    
    // Sort by newest first
    const sortedRequests = [...requests].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    container.innerHTML = sortedRequests.map(req => `
        <div class="request-item" data-type="${req.type}" data-status="${req.status || 'pending'}">
            <div class="request-item-info">
                <h4>${requestTypeNames[req.type] || req.type}</h4>
                <p>Submitted by: ${req.name}</p>
                <div class="request-item-meta">
                    <span><i class="fas fa-phone"></i> ${req.phone}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(req.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}</span>
                </div>
            </div>
            <div class="request-item-id">${req.id}</div>
            <div class="request-item-status ${req.status || 'pending'}">${(req.status || 'pending').replace('-', ' ').toUpperCase()}</div>
        </div>
    `).join('');
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
    
    // Sort by newest first
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
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
    
    container.innerHTML = filtered.map(req => `
        <div class="request-item" data-type="${req.type}" data-status="${req.status || 'pending'}">
            <div class="request-item-info">
                <h4>${requestTypeNames[req.type] || req.type}</h4>
                <p>Submitted by: ${req.name}</p>
                <div class="request-item-meta">
                    <span><i class="fas fa-phone"></i> ${req.phone}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(req.submittedAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}</span>
                </div>
            </div>
            <div class="request-item-id">${req.id}</div>
            <div class="request-item-status ${req.status || 'pending'}">${(req.status || 'pending').replace('-', ' ').toUpperCase()}</div>
        </div>
    `).join('');
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


