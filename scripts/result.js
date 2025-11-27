// Result page functionality

document.addEventListener('DOMContentLoaded', function() {
    initResultPage();
    startSuccessAnimation();
    initDownloadButtons();
});

function initResultPage() {
    // Get completion data from sessionStorage
    const completionData = JSON.parse(sessionStorage.getItem('completionData') || '{}');
    const processingData = JSON.parse(sessionStorage.getItem('processingData') || '{}');
    
    if (completionData.completed) {
        updateResultInfo(completionData, processingData);
    }
    
    // Start particle animation
    setTimeout(startParticleAnimation, 1000);
}

function updateResultInfo(completionData, processingData) {
    // Update processing time
    const processingTimeEl = document.querySelector('.processing-time');
    if (processingTimeEl && completionData.processingTime) {
        processingTimeEl.innerHTML = `
            <span class="time-icon">⚡</span>
            Processed in ${completionData.processingTime} seconds
        `;
    }
    
    // Update file details
    if (processingData.fileName) {
        const fileNameInput = document.getElementById('fileName');
        if (fileNameInput) {
            const baseName = processingData.fileName.replace(/\.[^/.]+$/, "");
            fileNameInput.value = baseName + '_muted';
        }
    }
    
    // Update file sizes
    const videoSizeEl = document.getElementById('videoSize');
    const originalSize = processingData.fileSize || 26214400; // 25MB default
    const reducedSize = Math.round(originalSize * 0.72); // Simulate 28% reduction
    
    if (videoSizeEl) {
        videoSizeEl.textContent = formatFileSize(reducedSize);
    }
    
    // Update download card file sizes
    const downloadCards = document.querySelectorAll('.file-size');
    downloadCards.forEach((card, index) => {
        if (index === 0) { // Video file
            card.textContent = `${formatFileSize(reducedSize)} • MP4`;
        } else if (index === 1) { // Audio file
            const audioSize = Math.round(originalSize * 0.12); // Simulate audio size
            card.textContent = `${formatFileSize(audioSize)} • MP3`;
        }
    });
}

function startSuccessAnimation() {
    // Animate success elements in sequence
    const successCircle = document.querySelector('.success-circle');
    const successTitle = document.querySelector('.success-title');
    const successSubtitle = document.querySelector('.success-subtitle');
    
    // Success circle animation
    setTimeout(() => {
        if (successCircle) {
            successCircle.style.animation = 'success-bounce 0.8s ease-out';
        }
    }, 200);
    
    // Title animation
    setTimeout(() => {
        if (successTitle) {
            successTitle.style.opacity = '0';
            successTitle.style.transform = 'translateY(20px)';
            successTitle.style.transition = 'all 0.6s ease-out';
            setTimeout(() => {
                successTitle.style.opacity = '1';
                successTitle.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 600);
    
    // Subtitle animation
    setTimeout(() => {
        if (successSubtitle) {
            successSubtitle.style.opacity = '0';
            successSubtitle.style.transform = 'translateY(20px)';
            successSubtitle.style.transition = 'all 0.6s ease-out';
            setTimeout(() => {
                successSubtitle.style.opacity = '1';
                successSubtitle.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 800);
    
    // Animate result container
    setTimeout(() => {
        const resultContainer = document.querySelector('.result-container');
        if (resultContainer) {
            resultContainer.style.opacity = '0';
            resultContainer.style.transform = 'translateY(30px)';
            resultContainer.style.transition = 'all 0.8s ease-out';
            setTimeout(() => {
                resultContainer.style.opacity = '1';
                resultContainer.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 1000);
}

function startParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        setTimeout(() => {
            particle.style.animation = `particle-float 3s ease-out infinite`;
            particle.style.animationDelay = `${index * 0.5}s`;
        }, index * 200);
    });
}

function initDownloadButtons() {
    // Add click animations to download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Download functionality
function downloadFile(type) {
    const processingData = JSON.parse(sessionStorage.getItem('processingData') || '{}');
    let fileName = 'processed_file';
    
    if (processingData.fileName) {
        const baseName = processingData.fileName.replace(/\.[^/.]+$/, "");
        fileName = baseName;
    }
    
    // Get custom filename if set
    const customName = document.getElementById('fileName')?.value;
    if (customName && customName.trim()) {
        fileName = customName.trim();
    }
    
    if (type === 'video') {
        // Simulate video download
        simulateDownload(`${fileName}_muted.mp4`, 'video/mp4');
        showToast('Video download started!');
    } else if (type === 'audio') {
        // Simulate audio download
        simulateDownload(`${fileName}_audio.mp3`, 'audio/mp3');
        showToast('Audio download started!');
    }
}

function simulateDownload(filename, mimeType) {
    // Create a dummy blob for demonstration
    const dummyContent = 'This is a simulated file download for the lavo demo.';
    const blob = new Blob([dummyContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyShareLink() {
    // Generate a dummy share link
    const shareLink = `https://lavo.app/share/${generateRandomId()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareLink).then(() => {
        showToast('Share link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Share link copied to clipboard!');
    });
}

function renameFile() {
    const fileNameInput = document.getElementById('fileName');
    const newName = fileNameInput.value.trim();
    
    if (!newName) {
        showToast('Please enter a valid filename', 'error');
        return;
    }
    
    // Update display
    showToast('File renamed successfully!');
    
    // Add visual feedback
    fileNameInput.style.background = 'rgba(16, 185, 129, 0.1)';
    fileNameInput.style.borderColor = '#10b981';
    
    setTimeout(() => {
        fileNameInput.style.background = '';
        fileNameInput.style.borderColor = '';
    }, 2000);
}

function reprocessVideo() {
    // Store current settings and redirect to upload
    const currentData = {
        reprocess: true,
        originalFile: sessionStorage.getItem('processingData')
    };
    
    sessionStorage.setItem('reprocessData', JSON.stringify(currentData));
    window.location.href = 'upload.html';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastIcon = document.querySelector('.toast-icon');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toastIcon.textContent = type === 'error' ? '❌' : '✅';
        
        // Update toast styling based on type
        if (type === 'error') {
            toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            toast.style.background = '#fef2f2';
        } else {
            toast.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            toast.style.background = 'var(--white)';
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Video player interactions
document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.querySelector('.video-player');
    const video = document.querySelector('#resultVideo');
    const overlay = document.querySelector('.video-overlay');
    
    if (videoPlayer && video && overlay) {
        overlay.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        });
        
        video.addEventListener('play', function() {
            overlay.style.opacity = '0';
        });
        
        video.addEventListener('pause', function() {
            overlay.style.opacity = '1';
        });
        
        video.addEventListener('ended', function() {
            overlay.style.opacity = '1';
        });
    }
});

// Add CSS for animations
const resultStyles = document.createElement('style');
resultStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .result-container {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .success-title,
    .success-subtitle {
        opacity: 0;
        transform: translateY(20px);
    }
`;
document.head.appendChild(resultStyles);