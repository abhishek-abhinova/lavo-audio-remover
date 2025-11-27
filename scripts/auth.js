// Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    initPasswordStrength();
    checkSelectedPlan();
});

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Add input validation
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidation);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validate inputs
    if (!validateEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    // Simulate login API call
    setTimeout(() => {
        // Simulate successful login
        const userData = {
            email: email,
            name: email.split('@')[0],
            plan: 'free',
            loginTime: Date.now()
        };
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Check if user was trying to upgrade
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        if (selectedPlan) {
            window.location.href = 'pricing.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validate inputs
    let isValid = true;
    
    if (!name.trim()) {
        showFieldError('signupName', 'Full name is required');
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        showFieldError('signupPassword', 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!agreeTerms) {
        showFieldError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    // Simulate signup API call
    setTimeout(() => {
        // Simulate successful signup
        const userData = {
            email: email,
            name: name,
            plan: 'free',
            signupTime: Date.now()
        };
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Check if user was trying to upgrade
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        if (selectedPlan) {
            window.location.href = 'pricing.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 2000);
}

function initPasswordStrength() {
    const passwordInput = document.getElementById('signupPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthIndicator.className = `password-strength ${strength.level}`;
            
            if (password.length > 0) {
                strengthIndicator.style.opacity = '1';
            } else {
                strengthIndicator.style.opacity = '0';
            }
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    
    if (score < 3) return { level: 'weak', text: 'Weak' };
    if (score < 5) return { level: 'medium', text: 'Medium' };
    return { level: 'strong', text: 'Strong' };
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearValidation(e);
    
    if (input.type === 'email' && value) {
        if (validateEmail(value)) {
            showFieldSuccess(input.id, 'Valid email address');
        } else {
            showFieldError(input.id, 'Please enter a valid email address');
        }
    }
    
    if (input.type === 'password' && value) {
        if (input.id === 'confirmPassword') {
            const password = document.getElementById('signupPassword').value;
            if (value === password) {
                showFieldSuccess(input.id, 'Passwords match');
            } else {
                showFieldError(input.id, 'Passwords do not match');
            }
        } else if (validatePassword(value)) {
            showFieldSuccess(input.id, 'Strong password');
        }
    }
}

function clearValidation(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    
    input.classList.remove('error', 'success');
    
    const existingMessage = formGroup.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    
    input.classList.add('error');
    input.classList.remove('success');
    
    // Remove existing messages
    const existingMessage = formGroup.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
    formGroup.appendChild(errorDiv);
}

function showFieldSuccess(fieldId, message) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    
    input.classList.add('success');
    input.classList.remove('error');
    
    // Remove existing messages
    const existingMessage = formGroup.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<span>✅</span> ${message}`;
    formGroup.appendChild(successDiv);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.style.cursor = 'not-allowed';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.style.cursor = 'pointer';
    }
}

function showLogin() {
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
    
    signupCard.style.opacity = '0';
    signupCard.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        signupCard.style.display = 'none';
        loginCard.style.display = 'block';
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            loginCard.style.transition = 'all 0.3s ease-out';
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateX(0)';
        }, 50);
    }, 300);
}

function showSignup() {
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
    
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        loginCard.style.display = 'none';
        signupCard.style.display = 'block';
        signupCard.style.opacity = '0';
        signupCard.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            signupCard.style.transition = 'all 0.3s ease-out';
            signupCard.style.opacity = '1';
            signupCard.style.transform = 'translateX(0)';
        }, 50);
    }, 300);
}

function signInWithGoogle() {
    // Simulate Google OAuth
    const googleBtn = document.querySelector('.auth-btn.google');
    setButtonLoading(googleBtn, true);
    
    setTimeout(() => {
        // Simulate successful Google login
        const userData = {
            email: 'user@gmail.com',
            name: 'Google User',
            plan: 'free',
            loginTime: Date.now(),
            provider: 'google'
        };
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Check if user was trying to upgrade
        const selectedPlan = sessionStorage.getItem('selectedPlan');
        if (selectedPlan) {
            window.location.href = 'pricing.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 1500);
}

function checkSelectedPlan() {
    const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan') || '{}');
    
    if (selectedPlan.type) {
        // Show plan selection message
        const authHeader = document.querySelector('.auth-header');
        if (authHeader) {
            const planMessage = document.createElement('div');
            planMessage.className = 'plan-message';
            planMessage.innerHTML = `
                <div style="background: rgba(106, 77, 255, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center;">
                    <span style="color: var(--primary); font-weight: 600;">
                        ${selectedPlan.type === 'premium' ? '✨ Premium Plan Selected' : '🎯 Free Plan Selected'}
                    </span>
                </div>
            `;
            authHeader.appendChild(planMessage);
        }
    }
}

// Add floating animation to background elements
document.addEventListener('DOMContentLoaded', function() {
    const orbs = document.querySelectorAll('.auth-orb');
    orbs.forEach((orb, index) => {
        orb.style.animationDelay = `${index * 2}s`;
    });
});