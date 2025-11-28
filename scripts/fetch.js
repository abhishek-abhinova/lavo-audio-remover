// Fetch page functionality

document.addEventListener('DOMContentLoaded', function() {
    initFetchPage();
    initOptionTabs();
    initResolutionSelector();
    initToggleSwitches();
});

function initFetchPage() {
    // Get video data from sessionStorage
    const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
    
    if (videoData.url || videoData.name) {
        populateVideoInfo(videoData);
    } else {
        // Redirect back if no video data
        window.location.href = 'index.html';
    }
}

function populateVideoInfo(data) {
    // Update video thumbnail
    const thumbnail = document.getElementById('videoThumbnail');
    if (thumbnail && data.thumbnail) {
        thumbnail.src = data.thumbnail;
    }
    
    // Update video title
    const title = document.getElementById('videoTitle');
    if (title) {
        title.textContent = data.title || data.name || 'Video File';
    }
    
    // Update video duration
    const duration = document.getElementById('videoDuration');
    if (duration && data.duration) {
        duration.textContent = data.duration;
    }
    
    // Update video size
    const size = document.getElementById('videoSize');
    if (size) {
        size.textContent = data.size || formatFileSize(data.fileSize || 0);
    }
    
    // Update video resolution
    const resolution = document.getElementById('videoResolution');
    if (resolution && data.resolution) {
        resolution.textContent = data.resolution;
    }
    
    // Update video format
    const format = document.getElementById('videoFormat');
    if (format && data.format) {
        format.textContent = data.format;
    }
    
    // Update platform badge
    const platformBadge = document.getElementById('platformBadge');
    if (platformBadge && data.platform) {
        const platformIcon = platformBadge.querySelector('.platform-icon');
        const platformText = platformBadge.querySelector('span');
        
        if (platformIcon && platformText) {
            updatePlatformBadge(platformIcon, platformText, data.platform);
        }
    }
}

function updatePlatformBadge(iconElement, textElement, platform) {
    textElement.textContent = platform;
    
    // Update icon based on platform
    switch (platform.toLowerCase()) {
        case 'youtube':
            iconElement.className = 'platform-icon youtube';
            iconElement.textContent = 'YT';
            break;
        case 'instagram':
            iconElement.className = 'platform-icon instagram';
            iconElement.textContent = 'IG';
            break;
        case 'facebook':
            iconElement.className = 'platform-icon facebook';
            iconElement.textContent = 'FB';
            break;
        case 'twitter':
            iconElement.className = 'platform-icon twitter';
            iconElement.textContent = 'TW';
            break;
        case 'vimeo':
            iconElement.className = 'platform-icon vimeo';
            iconElement.textContent = 'VM';
            break;
        default:
            iconElement.className = 'platform-icon other';
            iconElement.textContent = 'MP4';
    }
}

function initOptionTabs() {
    const tabs = document.querySelectorAll('.option-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.option-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab and content
    const activeTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}Tab`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    
    // Add tab switch animation
    if (activeContent) {
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(10px)';
        setTimeout(() => {
            activeContent.style.transition = 'all 0.3s ease-out';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';
        }, 50);
    }
}

function initResolutionSelector() {
    const resolutionOptions = document.querySelectorAll('input[name="resolution"]');
    
    resolutionOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Add selection animation
            const card = this.nextElementSibling;
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // Update file sizes based on selection
            updateFileSizes(this.value);
        });
    });
}

function updateFileSizes(resolution) {
    const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
    const baseSize = videoData.fileSize || 26214400; // 25MB default
    
    // Calculate sizes based on resolution
    const sizeMultipliers = {
        '360p': 0.3,
        '480p': 0.6,
        '720p': 1.0,
        '1080p': 1.8,
        '4k': 4.5
    };
    
    const multiplier = sizeMultipliers[resolution] || 1.0;
    const newSize = Math.round(baseSize * multiplier);
    
    // Update the main video size display
    const videoSize = document.getElementById('videoSize');
    if (videoSize) {
        videoSize.textContent = formatFileSize(newSize);
    }
}

function initToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Add toggle animation
            const slider = this.nextElementSibling;
            slider.style.transform = 'scale(0.9)';
            setTimeout(() => {
                slider.style.transform = 'scale(1)';
            }, 150);
            
            // Handle mutual exclusivity for some options
            if (this.id === 'removeAudio' && this.checked) {
                const extractAudio = document.getElementById('extractAudio');
                if (extractAudio && extractAudio.checked) {
                    // Both can be selected, no conflict
                }
            }
        });
    });
}

function startProcessing() {
    const processBtn = document.querySelector('.process-btn');
    
    // Get selected options
    const selectedResolution = document.querySelector('input[name="resolution"]:checked')?.value || '720p';
    const removeAudio = document.getElementById('removeAudio')?.checked || false;
    const extractAudio = document.getElementById('extractAudio')?.checked || false;
    const compressVideo = document.getElementById('compressVideo')?.checked || false;
    const startTime = document.getElementById('startTime')?.value || '';
    const endTime = document.getElementById('endTime')?.value || '';
    
    // Validate options
    if (!removeAudio && !extractAudio && !compressVideo && !startTime && !endTime) {
        showNotification('Please select at least one processing option', 'error');
        return;
    }
    
    // Show loading state
    const originalContent = processBtn.innerHTML;
    processBtn.innerHTML = `
        <div class="btn-content">
            <div class="loading-spinner"></div>
            <span>Processing...</span>
        </div>
    `;
    processBtn.disabled = true;
    
    // Store processing options
    const processingOptions = {
        resolution: selectedResolution,
        removeAudio: removeAudio,
        extractAudio: extractAudio,
        compressVideo: compressVideo,
        startTime: startTime,
        endTime: endTime,
        timestamp: Date.now()
    };
    
    const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
    const combinedData = { ...videoData, ...processingOptions };
    
    sessionStorage.setItem('processingData', JSON.stringify(combinedData));
    
    // Simulate processing delay
    setTimeout(() => {
        window.location.href = 'processing.html';
    }, 2000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

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

// Add CSS for fetch page animations
const fetchStyles = document.createElement('style');
fetchStyles.textContent = `
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
    
    .process-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .tab-content {
        transition: all 0.3s ease-out;
    }
    
    .resolution-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .toggle-slider {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
`;
document.head.appendChild(fetchStyles);