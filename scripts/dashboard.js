// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initSidebar();
    initUserMenu();
    checkUserAuth();
    loadDashboardData();
});

function initDashboard() {
    // Show overview section by default
    showSection('overview');
    
    // Initialize search functionality
    const searchInput = document.getElementById('historySearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Initialize filter
    const filterSelect = document.getElementById('historyFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
    
    // Check if user just upgraded
    const justUpgraded = sessionStorage.getItem('justUpgraded');
    if (justUpgraded) {
        showUpgradeSuccess();
        sessionStorage.removeItem('justUpgraded');
    }
}

function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const sectionId = this.getAttribute('href').substring(1);
                showSection(sectionId);
                
                // Update active state
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

function initUserMenu() {
    const userAvatar = document.querySelector('.user-avatar');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserMenu();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });
    }
}

function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('show');
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        if (sectionId === 'history') {
            loadHistoryData();
        }
    }
}

function checkUserAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    
    if (!user.email) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Update user avatar
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && user.name) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        userAvatar.textContent = initials;
    }
    
    // Update plan status
    updatePlanStatus(user.plan || 'free');
}

function updatePlanStatus(plan) {
    const planStatusCard = document.querySelector('.stat-card.premium');
    if (planStatusCard) {
        const statValue = planStatusCard.querySelector('.stat-value');
        const statChange = planStatusCard.querySelector('.stat-change');
        
        if (plan === 'premium') {
            statValue.textContent = 'Premium';
            statChange.textContent = 'Unlimited conversions';
            statChange.className = 'stat-change positive';
            
            // Hide upgrade card
            const upgradeCard = document.querySelector('.upgrade-card');
            if (upgradeCard) {
                upgradeCard.style.display = 'none';
            }
        } else {
            statValue.textContent = 'Free';
            statChange.textContent = '3/5 daily conversions used';
            statChange.className = 'stat-change';
        }
    }
}

function loadDashboardData() {
    // Simulate loading dashboard data
    const stats = {
        totalConversions: Math.floor(Math.random() * 50) + 10,
        storageSaved: (Math.random() * 5 + 1).toFixed(1),
        avgProcessingTime: Math.floor(Math.random() * 30) + 30,
        planStatus: sessionStorage.getItem('userPlan') || 'free'
    };
    
    // Update stats
    updateStats(stats);
    
    // Load recent activity
    loadRecentActivity();
}

function updateStats(stats) {
    const totalConversions = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const storageSaved = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const avgProcessingTime = document.querySelector('.stat-card:nth-child(3) .stat-value');
    
    if (totalConversions) {
        animateCounter(totalConversions, 0, stats.totalConversions, 1000);
    }
    
    if (storageSaved) {
        animateCounter(storageSaved, 0, parseFloat(stats.storageSaved), 1000, ' GB');
    }
    
    if (avgProcessingTime) {
        animateCounter(avgProcessingTime, 0, stats.avgProcessingTime, 1000, 's');
    }
}

function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutCubic(progress);
        
        if (suffix === ' GB') {
            element.textContent = current.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function loadRecentActivity() {
    // Activity data is already in HTML, add animations
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 150);
    });
}

function loadHistoryData() {
    const historyGrid = document.querySelector('.history-grid');
    const emptyState = document.getElementById('emptyState');
    
    // Simulate history data
    const historyItems = [
        {
            name: 'presentation_final.mp4',
            size: '18.2 MB',
            resolution: '1920x1080',
            duration: '2:34',
            date: '2 hours ago'
        },
        {
            name: 'meeting_recording.mp4',
            size: '45.1 MB',
            resolution: '1280x720',
            duration: '15:22',
            date: '1 day ago'
        },
        {
            name: 'tutorial_video.mp4',
            size: '12.8 MB',
            resolution: '1920x1080',
            duration: '3:45',
            date: '3 days ago'
        }
    ];
    
    if (historyItems.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    // Clear existing items except the first one (template)
    const existingItems = historyGrid.querySelectorAll('.history-item');
    for (let i = 1; i < existingItems.length; i++) {
        existingItems[i].remove();
    }
    
    // Add history items
    historyItems.slice(1).forEach((item, index) => {
        const historyItem = createHistoryItem(item);
        historyGrid.appendChild(historyItem);
        
        // Animate in
        setTimeout(() => {
            historyItem.style.opacity = '1';
            historyItem.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createHistoryItem(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.style.opacity = '0';
    div.style.transform = 'translateY(20px)';
    div.style.transition = 'all 0.4s ease-out';
    
    div.innerHTML = `
        <div class="history-thumbnail">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <polygon points="23,7 16,12 23,17" stroke="currentColor" stroke-width="2"/>
                <rect x="1" y="5" width="15" height="14" stroke="currentColor" stroke-width="2"/>
            </svg>
        </div>
        <div class="history-details">
            <h3>${item.name}</h3>
            <div class="history-meta">
                <span>${item.size}</span>
                <span>${item.resolution}</span>
                <span>${item.duration}</span>
            </div>
            <div class="history-date">Processed ${item.date}</div>
        </div>
        <div class="history-actions">
            <button class="action-btn" onclick="downloadFile('${item.name}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            <button class="action-btn" onclick="shareFile('${item.name}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            <button class="action-btn delete" onclick="deleteFile('${item.name}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
    `;
    
    return div;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        const fileName = item.querySelector('h3').textContent.toLowerCase();
        const isVisible = fileName.includes(searchTerm);
        
        item.style.display = isVisible ? 'flex' : 'none';
    });
}

function handleFilter(e) {
    const filterValue = e.target.value;
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach(item => {
        const fileName = item.querySelector('h3').textContent.toLowerCase();
        let isVisible = true;
        
        switch (filterValue) {
            case 'video':
                isVisible = fileName.includes('.mp4') || fileName.includes('.avi') || fileName.includes('.mov');
                break;
            case 'audio':
                isVisible = fileName.includes('.mp3') || fileName.includes('.wav') || fileName.includes('.aac');
                break;
            case 'recent':
                const date = item.querySelector('.history-date').textContent;
                isVisible = date.includes('hour') || date.includes('today');
                break;
            default:
                isVisible = true;
        }
        
        item.style.display = isVisible ? 'flex' : 'none';
    });
}

function downloadFile(fileName) {
    // Simulate file download
    showNotification(`Downloading ${fileName}...`, 'success');
    
    // Create dummy download
    const dummyContent = 'This is a simulated file download for the lavo demo.';
    const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function shareFile(fileName) {
    const shareUrl = `https://lavo.app/share/${generateRandomId()}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        showNotification('Share link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy share link', 'error');
    });
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        // Find and remove the history item
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent;
            if (itemName === fileName) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    item.remove();
                }, 300);
            }
        });
        
        showNotification(`${fileName} deleted successfully`, 'success');
    }
}

function viewBatch(batchId) {
    showNotification(`Viewing batch ${batchId} details...`, 'info');
    // In a real app, this would show batch details
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function showUpgradeSuccess() {
    const notification = document.createElement('div');
    notification.className = 'upgrade-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <div class="notification-text">
                <strong>Welcome to Premium!</strong>
                <p>You now have unlimited conversions and faster processing.</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
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
    }, 5000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `dashboard-notification ${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type]}</span>
        <span class="notification-message">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: white;
        color: ${colors[type]};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border-left: 4px solid ${colors[type]};
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.875rem;
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

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

// Add CSS for notification styles
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    .upgrade-notification .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }
    
    .upgrade-notification .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .upgrade-notification .notification-text strong {
        display: block;
        margin-bottom: 4px;
        font-size: 1rem;
    }
    
    .upgrade-notification .notification-text p {
        font-size: 0.875rem;
        opacity: 0.9;
        margin: 0;
    }
    
    .upgrade-notification .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        flex-shrink: 0;
    }
`;
document.head.appendChild(dashboardStyles);