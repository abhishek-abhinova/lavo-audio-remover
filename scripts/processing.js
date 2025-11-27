// Processing page functionality

let processingInterval;
let currentProgress = 0;
let currentStep = 1;
let startTime = Date.now();

document.addEventListener('DOMContentLoaded', function() {
    initProcessingPage();
    startProcessingSimulation();
});

function initProcessingPage() {
    // Get processing data from sessionStorage
    const processingData = JSON.parse(sessionStorage.getItem('processingData') || '{}');
    
    if (processingData.fileName) {
        updateFileInfo(processingData);
    }
    
    // Initialize progress ring
    const progressRing = document.querySelector('.progress-ring-fill');
    const circumference = 2 * Math.PI * 54; // radius = 54
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = circumference;
    
    // Start time tracking
    startTimeTracking();
}

function updateFileInfo(data) {
    const fileName = document.getElementById('processingFileName');
    const fileSize = document.getElementById('processingFileSize');
    
    if (fileName) fileName.textContent = data.fileName;
    if (fileSize) fileSize.textContent = formatFileSize(data.fileSize);
    
    // Update processing options display
    const optionsContainer = document.querySelector('.processing-options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        if (data.removeAudio) {
            const tag = document.createElement('div');
            tag.className = 'option-tag';
            tag.textContent = 'Remove Audio';
            optionsContainer.appendChild(tag);
        }
        
        if (data.extractAudio) {
            const tag = document.createElement('div');
            tag.className = 'option-tag';
            tag.textContent = 'Extract Audio';
            optionsContainer.appendChild(tag);
        }
        
        if (data.quality) {
            const tag = document.createElement('div');
            tag.className = 'option-tag';
            tag.textContent = `${data.quality.charAt(0).toUpperCase() + data.quality.slice(1)} Quality`;
            optionsContainer.appendChild(tag);
        }
    }
}

function startProcessingSimulation() {
    const steps = [
        { id: 1, title: 'Analyzing Audio Stream...', description: 'Preparing your video for processing', duration: 2000 },
        { id: 2, title: 'Removing Audio...', description: 'Processing video tracks', duration: 3000 },
        { id: 3, title: 'Encoding Final File...', description: 'Optimizing output quality', duration: 2000 }
    ];
    
    let stepIndex = 0;
    let stepProgress = 0;
    
    processingInterval = setInterval(() => {
        const currentStepData = steps[stepIndex];
        const stepDuration = currentStepData.duration;
        const progressIncrement = 100 / (stepDuration / 100); // Progress per 100ms
        
        stepProgress += progressIncrement;
        
        // Calculate overall progress
        const baseProgress = (stepIndex / steps.length) * 100;
        const stepContribution = (stepProgress / 100) * (100 / steps.length);
        currentProgress = Math.min(baseProgress + stepContribution, 100);
        
        updateProgressDisplay(currentProgress, currentStepData);
        
        // Move to next step
        if (stepProgress >= 100) {
            completeStep(currentStepData.id);
            stepIndex++;
            stepProgress = 0;
            
            if (stepIndex < steps.length) {
                activateStep(steps[stepIndex].id);
            }
        }
        
        // Complete processing
        if (stepIndex >= steps.length) {
            clearInterval(processingInterval);
            completeProcessing();
        }
    }, 100);
}

function updateProgressDisplay(progress, stepData) {
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-fill');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (progress / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
    
    // Update percentage
    const progressPercentage = document.getElementById('progressPercentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${Math.round(progress)}%`;
    }
    
    // Update step info
    const progressTitle = document.getElementById('progressTitle');
    const progressDescription = document.getElementById('progressDescription');
    
    if (progressTitle) progressTitle.textContent = stepData.title;
    if (progressDescription) progressDescription.textContent = stepData.description;
}

function activateStep(stepId) {
    // Remove active class from all steps
    document.querySelectorAll('.step-item').forEach(step => {
        step.classList.remove('active');
    });
    
    // Add active class to current step
    const currentStep = document.getElementById(`step${stepId}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
}

function completeStep(stepId) {
    const step = document.getElementById(`step${stepId}`);
    if (step) {
        step.classList.remove('active');
        step.classList.add('completed');
    }
}

function completeProcessing() {
    // Store completion data
    const completionData = {
        completed: true,
        processingTime: Math.round((Date.now() - startTime) / 1000),
        outputSize: '18.2 MB', // Simulated
        originalSize: '25.4 MB' // Simulated
    };
    
    sessionStorage.setItem('completionData', JSON.stringify(completionData));
    
    // Add completion animation
    const progressBox = document.querySelector('.progress-box');
    if (progressBox) {
        progressBox.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))';
        progressBox.style.borderColor = '#10b981';
    }
    
    // Show success message
    const progressTitle = document.getElementById('progressTitle');
    const progressDescription = document.getElementById('progressDescription');
    
    if (progressTitle) progressTitle.textContent = 'Processing Complete!';
    if (progressDescription) progressDescription.textContent = 'Your video is ready for download';
    
    // Change icon to checkmark
    const progressIcon = document.querySelector('.progress-icon svg');
    if (progressIcon) {
        progressIcon.innerHTML = `
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        `;
        progressIcon.style.color = '#10b981';
    }
    
    // Redirect to result page after 2 seconds
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 2000);
}

function startTimeTracking() {
    setInterval(() => {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const timeElapsed = document.getElementById('timeElapsed');
        
        if (timeElapsed) {
            timeElapsed.textContent = formatTime(elapsed);
        }
        
        // Estimate remaining time based on progress
        if (currentProgress > 0) {
            const totalEstimated = (elapsed / currentProgress) * 100;
            const remaining = Math.max(0, totalEstimated - elapsed);
            const timeRemaining = document.getElementById('timeRemaining');
            
            if (timeRemaining) {
                timeRemaining.textContent = formatTime(Math.round(remaining));
            }
        }
        
        // Update processing speed (simulated)
        const processingSpeed = document.getElementById('processingSpeed');
        if (processingSpeed) {
            const speed = (1.8 + Math.random() * 0.6).toFixed(1);
            processingSpeed.textContent = `${speed}x`;
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Prevent page refresh during processing
window.addEventListener('beforeunload', function(e) {
    if (processingInterval) {
        e.preventDefault();
        e.returnValue = 'Processing is still in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Add processing animations
const processingStyles = document.createElement('style');
processingStyles.textContent = `
    .step-item.completed .step-dot {
        background: #10b981 !important;
        animation: checkmark-bounce 0.5s ease-out;
    }
    
    .step-item.active .step-dot {
        animation: pulse-dot 1.5s ease-in-out infinite;
    }
    
    @keyframes checkmark-bounce {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes pulse-dot {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(106, 77, 255, 0.7); }
        50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(106, 77, 255, 0); }
    }
    
    .progress-ring-fill {
        transition: stroke-dashoffset 0.3s ease-out;
    }
    
    .processing-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(processingStyles);