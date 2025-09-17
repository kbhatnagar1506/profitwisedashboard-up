// Mobile-specific JavaScript for ProfitWise

// Mobile initialization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile-specific initialization
    console.log('Mobile site loaded');
});

// Mobile User Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileUserLoginButton = document.getElementById('mobileUserLoginButton');
    const mobileUserLoginModal = document.getElementById('mobileUserLoginModal');
    const mobileCloseLoginModal = document.getElementById('mobileCloseLoginModal');
    const mobileUserLoginForm = document.getElementById('mobileUserLoginForm');
    const mobileLoginMessage = document.getElementById('mobileLoginMessage');
    
    // Open mobile login modal
    if (mobileUserLoginButton) {
        mobileUserLoginButton.addEventListener('click', function() {
            mobileUserLoginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile login modal
    if (mobileCloseLoginModal) {
        mobileCloseLoginModal.addEventListener('click', function() {
            closeMobileUserLoginModal();
        });
    }
    
    // Close modal when clicking overlay
    if (mobileUserLoginModal) {
        mobileUserLoginModal.addEventListener('click', function(e) {
            if (e.target === mobileUserLoginModal) {
                closeMobileUserLoginModal();
            }
        });
    }
    
    // Handle mobile login form submission
    if (mobileUserLoginForm) {
        mobileUserLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('mobileUserEmail').value.trim();
            const password = document.getElementById('mobileUserPassword').value.trim();
            
            if (!email || !password) {
                showMobileLoginMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = mobileUserLoginForm.querySelector('.mobile-login-submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Signing In...</span>';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('/user_login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMobileLoginMessage(data.message, 'success');
                    setTimeout(() => {
                        closeMobileUserLoginModal();
                        // Redirect to dashboard or show success
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    showMobileLoginMessage(data.message, 'error');
                }
            } catch (error) {
                showMobileLoginMessage('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    function closeMobileUserLoginModal() {
        mobileUserLoginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        mobileUserLoginForm.reset();
        mobileLoginMessage.style.display = 'none';
    }
    
    function showMobileLoginMessage(message, type) {
        mobileLoginMessage.textContent = message;
        mobileLoginMessage.className = `mobile-login-message ${type}`;
        mobileLoginMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            mobileLoginMessage.style.display = 'none';
        }, 5000);
    }
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    // Open mobile menu
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenuOverlay.classList.add('active');
            mobileMenuButton.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }
    
    // Close menu when clicking menu links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuButton.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Mobile Video Optimization
document.addEventListener('DOMContentLoaded', function() {
    const allVideos = document.querySelectorAll('video');
    
    allVideos.forEach(video => {
        // Ensure videos play inline on mobile
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        
        // Prevent video controls from showing
        video.controls = false;
        
        // Try to play video (required for autoplay on mobile)
        video.play().catch(e => {
            console.log('Mobile video autoplay failed:', e);
        });
        
        // Handle video loading
        video.addEventListener('loadeddata', function() {
            console.log('Mobile video loaded successfully');
        });
        
        // Handle video errors
        video.addEventListener('error', function(e) {
            console.log('Mobile video error:', e);
        });
    });
});

// Mobile Waitlist Form
document.addEventListener('DOMContentLoaded', function() {
    const mobileWaitlistForm = document.getElementById('mobileWaitlistForm');
    const mobileFormMessage = document.getElementById('mobileFormMessage');
    const mobileSubmitButton = document.getElementById('mobileSubmitButton');
    
    if (mobileWaitlistForm) {
        mobileWaitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('mobileEmailInput').value.trim();
            const name = document.getElementById('mobileNameInput').value.trim();
            
            if (!email || !name) {
                showMobileMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            mobileSubmitButton.disabled = true;
            mobileSubmitButton.innerHTML = '<span class="mobile-waitlist-button-text">Joining...</span>';
            
            try {
                const response = await fetch('/submit_waitlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMobileMessage(data.message, 'success');
                    mobileWaitlistForm.reset();
                } else {
                    showMobileMessage(data.message, 'error');
                }
            } catch (error) {
                showMobileMessage('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                mobileSubmitButton.disabled = false;
                mobileSubmitButton.innerHTML = `
                    <img src="/static/profitwiseicon1.png" alt="ProfitWise Icon" class="mobile-waitlist-icon">
                    <span class="mobile-waitlist-button-text">Join Waitlist</span>
                `;
            }
        });
    }
    
    function showMobileMessage(message, type) {
        mobileFormMessage.textContent = message;
        mobileFormMessage.className = `mobile-form-message ${type}`;
        mobileFormMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            mobileFormMessage.style.display = 'none';
        }, 5000);
    }
});

// Mobile Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile Touch Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add touch feedback to buttons
    const mobileButtons = document.querySelectorAll('.mobile-cta-button, .mobile-waitlist-button, .mobile-menu-link');
    
    mobileButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add touch feedback to feature cards
    const mobileFeatureCards = document.querySelectorAll('.mobile-feature-card');
    
    mobileFeatureCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });
});

// Mobile Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load videos
    const videos = document.querySelectorAll('video');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.play().catch(e => {
                    console.log('Video play failed:', e);
                });
            }
        });
    }, {
        threshold: 0.1
    });
    
    videos.forEach(video => {
        videoObserver.observe(video);
    });
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScroll() {
        // Add any scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
});

// Mobile Viewport Height Fix
document.addEventListener('DOMContentLoaded', function() {
    function setMobileVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setMobileVH();
    window.addEventListener('resize', setMobileVH);
    window.addEventListener('orientationchange', setMobileVH);
});

// Mobile Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const mobileFormInputs = document.querySelectorAll('.mobile-form-input');
    
    mobileFormInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateMobileInput(this);
        });
        
        input.addEventListener('input', function() {
            clearMobileValidation(this);
        });
    });
    
    function validateMobileInput(input) {
        const value = input.value.trim();
        const type = input.type;
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showMobileInputError(input, 'Please enter a valid email address');
            }
        } else if (type === 'text') {
            if (value && value.length < 2) {
                showMobileInputError(input, 'Name must be at least 2 characters');
            }
        }
    }
    
    function showMobileInputError(input, message) {
        input.style.borderColor = '#721c24';
        input.style.backgroundColor = 'rgba(248, 215, 218, 0.1)';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.mobile-input-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mobile-input-error';
        errorDiv.style.color = '#721c24';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function clearMobileValidation(input) {
        input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        const existingError = input.parentNode.querySelector('.mobile-input-error');
        if (existingError) {
            existingError.remove();
        }
    }
});

// Mobile Analytics (placeholder for future implementation)
function trackMobileEvent(eventName, eventData) {
    // Placeholder for mobile analytics
    console.log('Mobile Event:', eventName, eventData);
}

// Mobile Error Handling
window.addEventListener('error', function(e) {
    console.error('Mobile Error:', e.error);
    trackMobileEvent('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Mobile Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Mobile Unhandled Promise Rejection:', e.reason);
    trackMobileEvent('unhandledRejection', {
        reason: e.reason
    });
});
