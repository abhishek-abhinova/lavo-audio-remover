// Upload page functionality

let selectedFile = null;
let uploadProgress = 0;

document.addEventListener('DOMContentLoaded', function() {
    initFileUpload();
    initToggleSwitches();
    initQualitySelector();
});

// File upload functionality
function initFileUpload() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const filePreview = document.getElementById('filePreview');
    const processBtn = document.getElementById('processBtn');

    // Drag and drop events
    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);
    dropzone.addEventListener('drop', handleDrop);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    function handleDragOver(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
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

        // Validate file size (100MB for free users)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            showNotification('File size exceeds 100MB limit. Upgrade to Premium for larger files.', 'error');
            return;
        }

        selectedFile = file;
        displayFilePreview(file);
        
        // Hide upload area and show preview
        uploadArea.style.display = 'none';
        filePreview.style.display = 'block';
        processBtn.disabled = false;
        
        // Add animation
        filePreview.style.opacity = '0';
        filePreview.style.transform = 'translateY(20px)';
        setTimeout(() => {
            filePreview.style.transition = 'all 0.5s ease-out';
            filePreview.style.opacity = '1';
            filePreview.style.transform = 'translateY(0)';
        }, 100);
    }

    function displayFilePreview(file) {
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const videoPreview = document.getElementById('videoPreview');

        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);

        // Create video preview
        const url = URL.createObjectURL(file);
        videoPreview.src = url;
        
        videoPreview.addEventListener('loadedmetadata', function() {
            const duration = document.getElementById('fileDuration');
            const resolution = document.getElementById('fileResolution');
            
            duration.textContent = formatDuration(this.duration);
            resolution.textContent = `${this.videoWidth}x${this.videoHeight}`;
        });
    }
}

// Replace file functionality
function replaceFile() {
    const uploadArea = document.getElementById('uploadArea');
    const filePreview = document.getElementById('filePreview');
    const processBtn = document.getElementById('processBtn');
    const fileInput = document.getElementById('fileInput');

    selectedFile = null;
    uploadArea.style.display = 'block';
    filePreview.style.display = 'none';
    processBtn.disabled = true;
    fileInput.value = '';
}

// Toggle switches functionality
function initToggleSwitches() {
    const removeAudioToggle = document.getElementById('removeAudio');
    const extractAudioToggle = document.getElementById('extractAudio');

    removeAudioToggle.addEventListener('change', function() {
        if (this.checked && extractAudioToggle.checked) {
            // Both can be selected
        }
        updateProcessButton();
    });

    extractAudioToggle.addEventListener('change', function() {
        if (this.checked && !removeAudioToggle.checked) {
            // At least one option must be selected
        }
        updateProcessButton();
    });
}

// Quality selector functionality
function initQualitySelector() {
    const qualityOptions = document.querySelectorAll('input[name="quality"]');
    
    qualityOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Add visual feedback
            const labels = document.querySelectorAll('.quality-label');
            labels.forEach(label => {
                label.style.transform = 'scale(1)';
            });
            
            if (this.checked) {
                const label = this.nextElementSibling;
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

// Update process button state
function updateProcessButton() {
    const processBtn = document.getElementById('processBtn');
    const removeAudio = document.getElementById('removeAudio').checked;
    const extractAudio = document.getElementById('extractAudio').checked;

    if (selectedFile && (removeAudio || extractAudio)) {
        processBtn.disabled = false;
        processBtn.style.opacity = '1';
    } else {
        processBtn.disabled = true;
        processBtn.style.opacity = '0.5';
    }
}

// Start processing
function startProcessing() {
    if (!selectedFile) {
        showNotification('Please select a file first', 'error');
        return;
    }

    const removeAudio = document.getElementById('removeAudio').checked;
    const extractAudio = document.getElementById('extractAudio').checked;
    const quality = document.querySelector('input[name="quality"]:checked').value;

    if (!removeAudio && !extractAudio) {
        showNotification('Please select at least one processing option', 'error');
        return;
    }

    // Store processing options in sessionStorage
    const processingData = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        removeAudio: removeAudio,
        extractAudio: extractAudio,
        quality: quality
    };
    
    sessionStorage.setItem('processingData', JSON.stringify(processingData));
    
    // Redirect to processing page
    window.location.href = 'processing.html';
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '❌' : '✅'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for animations
const uploadStyles = document.createElement('style');
uploadStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .quality-label {
        transition: transform 0.2s ease-out;
    }
    
    .dragover {
        border-color: var(--primary) !important;
        background: rgba(106, 77, 255, 0.05) !important;
        transform: translateY(-4px) !important;
    }
    
    .file-preview {
        animation: fadeInUp 0.5s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(uploadStyles);