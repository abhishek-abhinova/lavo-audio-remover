// Main JavaScript functionality for lavo

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initMobileMenu();
    initLinkInput();
    initUploadBox();
    initThemeToggle();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', handleNavbarScroll);
});

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(248, 247, 252, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(248, 247, 252, 0.8)';
        navbar.style.boxShadow = 'none';
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

// Link input functionality
function initLinkInput() {
    const linkInput = document.getElementById('videoLink');
    const platformIcon = document.getElementById('platformIcon');
    
    if (linkInput) {
        linkInput.addEventListener('input', function() {
            const url = this.value.toLowerCase();
            detectPlatform(url, platformIcon);
            
            // Add input animation
            const container = this.closest('.link-input-container');
            if (url.length > 0) {
                container.classList.add('has-content');
            } else {
                container.classList.remove('has-content');
            }
        });
        
        linkInput.addEventListener('paste', function() {
            setTimeout(() => {
                const url = this.value.toLowerCase();
                detectPlatform(url, platformIcon);
            }, 100);
        });
    }
}

// Platform detection
function detectPlatform(url, iconElement) {
    let platform = 'link';
    let color = 'var(--primary)';
    let icon = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2"/>
        </svg>
    `;
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        platform = 'youtube';
        color = '#FF0000';
        icon = '<span style="font-weight: 600; font-size: 12px;">YT</span>';
    } else if (url.includes('instagram.com')) {
        platform = 'instagram';
        color = '#E4405F';
        icon = '<span style="font-weight: 600; font-size: 12px;">IG</span>';
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
        platform = 'facebook';
        color = '#1877F2';
        icon = '<span style="font-weight: 600; font-size: 12px;">FB</span>';
    } else if (url.includes('twitter.com') || url.includes('t.co')) {
        platform = 'twitter';
        color = '#1DA1F2';
        icon = '<span style="font-weight: 600; font-size: 12px;">TW</span>';
    } else if (url.includes('vimeo.com')) {
        platform = 'vimeo';
        color = '#1AB7EA';
        icon = '<span style="font-weight: 600; font-size: 12px;">VM</span>';
    }
    
    if (iconElement) {
        iconElement.innerHTML = icon;
        iconElement.style.background = color;
        iconElement.style.color = 'white';
        
        // Add detection animation
        iconElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            iconElement.style.transform = 'scale(1)';
        }, 150);
    }
}

// Upload box functionality
function initUploadBox() {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadBox && fileInput) {
        // Drag and drop events
        uploadBox.addEventListener('dragover', handleDragOver);
        uploadBox.addEventListener('dragleave', handleDragLeave);
        uploadBox.addEventListener('drop', handleDrop);
        uploadBox.addEventListener('click', () => fileInput.click());
        
        // File input change
        fileInput.addEventListener('change', handleFileSelect);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--primary)';
    this.style.background = 'rgba(106, 77, 255, 0.05)';
    this.style.transform = 'translateY(-2px) scale(1.02)';
}

function handleDragLeave(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--glass-border)';
    this.style.background = 'var(--glass)';
    this.style.transform = 'translateY(-4px) scale(1)';
}

function handleDrop(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--glass-border)';
    this.style.background = 'var(--glass)';
    this.style.transform = 'translateY(-4px) scale(1)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith('video/')) {
        showNotification('Please select a valid video file', 'error');
        return;
    }
    
    // Store file info and redirect
    const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        source: 'upload'
    };
    
    sessionStorage.setItem('videoData', JSON.stringify(fileData));
    window.location.href = 'fetch.html';
}

// Fetch video functionality
function fetchVideo() {
    const linkInput = document.getElementById('videoLink');
    const fetchBtn = document.querySelector('.fetch-btn');
    
    if (!linkInput || !linkInput.value.trim()) {
        showNotification('Please enter a valid video URL', 'error');
        return;
    }
    
    const url = linkInput.value.trim();
    
    // Validate URL
    if (!isValidUrl(url)) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }
    
    // Show loading state
    const originalText = fetchBtn.innerHTML;
    fetchBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Fetching...</span>
    `;
    fetchBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store video data
        const videoData = {
            url: url,
            title: 'Amazing Video Title That Could Be Very Long',
            duration: '2:34',
            size: '25.4 MB',
            resolution: '1920x1080',
            format: 'MP4',
            thumbnail: 'https://via.placeholder.com/320x180/6A4DFF/FFFFFF?text=Video+Preview',
            platform: detectPlatformName(url),
            source: 'link'
        };
        
        sessionStorage.setItem('videoData', JSON.stringify(videoData));
        window.location.href = 'fetch.html';
    }, 2000);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function detectPlatformName(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('twitter.com')) return 'Twitter';
    if (url.includes('vimeo.com')) return 'Vimeo';
    return 'Unknown';
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    // Add toggle animation
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .step, .trust-card, .trust-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '❌' : '✅'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'error' ? '#fee' : '#efe'};
        color: ${type === 'error' ? '#c33' : '#363'};
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        border: 1px solid ${type === 'error' ? '#fcc' : '#cfc'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for loading spinner and animations
const mainStyles = document.createElement('style');
mainStyles.textContent = `
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .link-input-container.has-content {
        border-color: var(--primary);
        box-shadow: 0 0 0 4px rgba(106, 77, 255, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .dark-theme {
        --background: #1A1A1A;
        --white: #2A2A2A;
        --dark-text: #FFFFFF;
        --subtext: #B0B0B0;
        --glass: rgba(42, 42, 42, 0.8);
        --glass-border: rgba(255, 255, 255, 0.1);
    }
    
    .platform-icon {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fetch-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .fetch-btn .loading-spinner {
        margin-right: 8px;
    }
`;
document.head.appendChild(mainStyles);