// Fetch page functionality

document.addEventListener('DOMContentLoaded', function() {
    initFetchPage();
    initOptionItems();
    initSpiralInput();
});

function initFetchPage() {
    // Get video data from sessionStorage
    const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
    
    if (videoData.url || videoData.name) {
        populateVideoInfo(videoData);
    }
    // Don't redirect - allow users to enter links directly
}

function detectPlatform(url) {
    const platformDots = document.querySelectorAll('.platform-dot');
    
    // Reset all dots
    platformDots.forEach(dot => {
        dot.style.opacity = '0.6';
        dot.style.transform = 'scale(1)';
    });
    
    // Highlight detected platform
    let detectedPlatform = null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        detectedPlatform = 'youtube';
    } else if (url.includes('instagram.com')) {
        detectedPlatform = 'instagram';
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
        detectedPlatform = 'facebook';
    } else if (url.includes('twitter.com') || url.includes('t.co')) {
        detectedPlatform = 'twitter';
    }
    
    if (detectedPlatform) {
        const platformDot = document.querySelector(`.platform-dot.${detectedPlatform}`);
        if (platformDot) {
            platformDot.style.opacity = '1';
            platformDot.style.transform = 'scale(1.3)';
        }
    }
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

function populateVideoInfo(data) {
    // Update video thumbnail
    const thumbnail = document.getElementById('videoThumbnail');
    if (thumbnail && data.thumbnail) {
        thumbnail.style.backgroundImage = `url(${data.thumbnail})`;
        thumbnail.style.backgroundSize = 'cover';
        thumbnail.style.backgroundPosition = 'center';
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
    
    // Update video platform
    const platform = document.getElementById('videoPlatform');
    if (platform && data.platform) {
        platform.textContent = data.platform;
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

function initOptionItems() {
    const optionItems = document.querySelectorAll('.option-item');
    
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                updateProcessButton();
            }
        });
    });
    
    // Listen for checkbox changes
    document.querySelectorAll('.option-toggle input').forEach(checkbox => {
        checkbox.addEventListener('change', updateProcessButton);
    });
}

function initSpiralInput() {
    const spiralInput = document.getElementById('videoLink');
    const spiralBtn = document.querySelector('.spiral-btn');
    
    if (spiralInput) {
        spiralInput.addEventListener('input', function() {
            const url = this.value.toLowerCase();
            detectPlatform(url);
            updateProcessButton();
        });
        
        spiralInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fetchVideoFromSpiral();
            }
        });
    }
}

function updateProcessButton() {
    const processBtn = document.querySelector('.process-btn');
    const videoLink = document.getElementById('videoLink').value.trim();
    const hasSelectedOptions = document.querySelectorAll('.option-toggle input:checked').length > 0;
    
    if (videoLink && hasSelectedOptions) {
        processBtn.disabled = false;
    } else {
        processBtn.disabled = true;
    }
}

function fetchVideoFromSpiral() {
    const linkInput = document.getElementById('videoLink');
    const spiralBtn = document.querySelector('.spiral-btn');
    
    if (!linkInput || !linkInput.value.trim()) {
        showNotification('Please enter a valid video URL', 'error');
        return;
    }
    
    const url = linkInput.value.trim();
    
    if (!isValidUrl(url)) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }
    
    // Show loading state
    spiralBtn.innerHTML = `
        <div class="loading-spinner"></div>
    `;
    spiralBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
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
        populateVideoInfo(videoData);
        
        // Reset button
        spiralBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        spiralBtn.disabled = false;
        
        showNotification('Video fetched successfully!', 'success');
    }, 1500);
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
    const videoData = JSON.parse(sessionStorage.getItem('videoData') || '{}');
    
    if (!videoData.url) {
        showNotification('Please fetch a video first', 'error');
        return;
    }
    
    // Get selected options
    const selectedOptions = [];
    document.querySelectorAll('.option-toggle input:checked').forEach(checkbox => {
        selectedOptions.push(checkbox.id);
    });
    
    const autoDownload = document.getElementById('autoDownload').checked;
    
    // Show loading state
    processBtn.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Processing...</span>
    `;
    processBtn.disabled = true;
    
    // Store processing options
    const processingOptions = {
        options: selectedOptions,
        autoDownload: autoDownload,
        timestamp: Date.now()
    };
    
    const combinedData = { ...videoData, ...processingOptions };
    sessionStorage.setItem('processingData', JSON.stringify(combinedData));
    
    // Simulate processing
    setTimeout(() => {
        if (autoDownload) {
            // Simulate auto-download
            simulateDownload(selectedOptions, videoData);
            showNotification('Files downloaded automatically!', 'success');
            
            // Reset form
            resetForm();
        } else {
            window.location.href = 'processing.html';
        }
    }, 2000);
}

function simulateDownload(options, videoData) {
    options.forEach(option => {
        const fileName = getFileName(option, videoData);
        
        // Create download link
        const link = document.createElement('a');
        link.href = '#'; // In real app, this would be the processed file URL
        link.download = fileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        // link.click(); // Uncomment for actual download
        document.body.removeChild(link);
        
        console.log(`Downloaded: ${fileName}`);
    });
}

function getFileName(option, videoData) {
    const baseName = videoData.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'video';
    
    switch (option) {
        case 'download':
            return `${baseName}.mp4`;
        case 'removeAudio':
            return `${baseName}_no_audio.mp4`;
        case 'extractAudio':
            return `${baseName}_audio.mp3`;
        default:
            return `${baseName}.mp4`;
    }
}

function resetForm() {
    document.getElementById('videoLink').value = '';
    document.querySelectorAll('.option-toggle input').forEach(checkbox => {
        checkbox.checked = checkbox.id === 'download';
    });
    
    const processBtn = document.querySelector('.process-btn');
    processBtn.innerHTML = '<span class="btn-text">Process Video</span><div class="btn-glow"></div>';
    processBtn.disabled = true;
    
    // Reset video info
    document.getElementById('videoTitle').textContent = 'Paste a video link above';
    document.getElementById('videoDuration').textContent = '--:--';
    document.getElementById('videoSize').textContent = '-- MB';
    document.getElementById('videoResolution').textContent = '--x--';
    document.getElementById('videoPlatform').textContent = '--';
    
    const thumbnail = document.getElementById('videoThumbnail');
    thumbnail.style.backgroundImage = 'none';
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