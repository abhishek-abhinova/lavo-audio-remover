// Pricing page functionality

document.addEventListener('DOMContentLoaded', function() {
    initBillingToggle();
    initFAQ();
    initPlanAnimations();
});

// Billing toggle functionality
function initBillingToggle() {
    const billingToggle = document.getElementById('billingToggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const yearlyPrices = document.querySelectorAll('.yearly-price');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            monthlyPrices.forEach(price => {
                price.style.display = isYearly ? 'none' : 'inline';
            });
            
            yearlyPrices.forEach(price => {
                price.style.display = isYearly ? 'inline' : 'none';
            });
            
            // Add animation effect
            const planCards = document.querySelectorAll('.plan-card');
            planCards.forEach(card => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Plan animations
function initPlanAnimations() {
    const planCards = document.querySelectorAll('.plan-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    planCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
    
    // Hover effects
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('premium')) {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('premium')) {
                this.style.transform = 'translateY(-8px) scale(1)';
            }
        });
    });
}

// Plan selection
function selectPlan(planType) {
    const billingToggle = document.getElementById('billingToggle');
    const isYearly = billingToggle ? billingToggle.checked : false;
    
    let planData = {
        type: planType,
        billing: isYearly ? 'yearly' : 'monthly',
        timestamp: Date.now()
    };
    
    if (planType === 'free') {
        // Redirect to signup for free plan
        sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
        window.location.href = 'login.html';
    } else if (planType === 'premium') {
        // Store plan selection and redirect to checkout
        sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
        showCheckoutModal(planData);
    }
}

function contactSales() {
    // Redirect to support page with enterprise inquiry
    const contactData = {
        type: 'enterprise',
        inquiry: 'enterprise_plan',
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('contactInquiry', JSON.stringify(contactData));
    window.location.href = 'support.html';
}

function showCheckoutModal(planData) {
    // Create checkout modal
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeCheckoutModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Upgrade to Premium</h3>
                <button class="modal-close" onclick="closeCheckoutModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="plan-summary">
                    <h4>Premium Plan</h4>
                    <div class="plan-price">
                        <span class="price">${planData.billing === 'yearly' ? '$7.99' : '$9.99'}</span>
                        <span class="period">/${planData.billing === 'yearly' ? 'month (billed yearly)' : 'month'}</span>
                    </div>
                    ${planData.billing === 'yearly' ? '<div class="savings">Save 20% with yearly billing</div>' : ''}
                </div>
                
                <div class="payment-form">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label>Card Information</label>
                        <input type="text" placeholder="1234 5678 9012 3456" required>
                        <div class="card-row">
                            <input type="text" placeholder="MM/YY" required>
                            <input type="text" placeholder="CVC" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Cardholder Name</label>
                        <input type="text" placeholder="Full name on card" required>
                    </div>
                </div>
                
                <button class="checkout-btn" onclick="processPayment()">
                    <span class="btn-icon">🔒</span>
                    Subscribe Now - ${planData.billing === 'yearly' ? '$95.88/year' : '$9.99/month'}
                </button>
                
                <div class="checkout-footer">
                    <p>🔒 Secure payment powered by Stripe</p>
                    <p>Cancel anytime. No hidden fees.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .checkout-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 400px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: modalSlideUp 0.3s ease-out;
        }
        
        @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
            padding: 24px 24px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6F6F6F;
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .plan-summary {
            text-align: center;
            margin-bottom: 24px;
            padding: 20px;
            background: rgba(106, 77, 255, 0.05);
            border-radius: 12px;
        }
        
        .plan-summary h4 {
            margin-bottom: 8px;
            color: var(--dark-text);
        }
        
        .plan-price {
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 4px;
            margin-bottom: 8px;
        }
        
        .plan-price .price {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .plan-price .period {
            color: var(--subtext);
        }
        
        .savings {
            color: #10b981;
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .payment-form .form-group {
            margin-bottom: 16px;
        }
        
        .payment-form label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: var(--dark-text);
        }
        
        .payment-form input {
            width: 100%;
            padding: 12px;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            font-size: 0.875rem;
        }
        
        .card-row {
            display: flex;
            gap: 12px;
            margin-top: 8px;
        }
        
        .checkout-btn {
            width: 100%;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .checkout-footer {
            text-align: center;
            font-size: 0.75rem;
            color: var(--subtext);
        }
        
        .checkout-footer p {
            margin-bottom: 4px;
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Animate modal in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeCheckoutModal() {
    const modal = document.querySelector('.checkout-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function processPayment() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Show loading state
    checkoutBtn.innerHTML = `
        <div class="loading-spinner"></div>
        Processing...
    `;
    checkoutBtn.disabled = true;
    
    // Add loading spinner styles
    const spinnerStyles = document.createElement('style');
    spinnerStyles.textContent = `
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
    `;
    document.head.appendChild(spinnerStyles);
    
    // Simulate payment processing
    setTimeout(() => {
        // Success - redirect to dashboard
        sessionStorage.setItem('userPlan', 'premium');
        sessionStorage.setItem('justUpgraded', 'true');
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Add scroll animations for other elements
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.comparison-table, .faq-grid, .cta-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});