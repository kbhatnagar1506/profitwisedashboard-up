// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    
    // Video optimization
    const loginVideo = document.getElementById('loginVideo');
    if (loginVideo) {
        loginVideo.setAttribute('playsinline', 'true');
        loginVideo.setAttribute('webkit-playsinline', 'true');
        loginVideo.setAttribute('muted', 'true');
        loginVideo.controls = false;
        
        // Video event listeners
        loginVideo.addEventListener('loadeddata', function() {
            console.log('Login video loaded successfully');
        });
        
        loginVideo.addEventListener('canplay', function() {
            console.log('Login video can play');
            loginVideo.play().catch(e => {
                console.log('Login video autoplay failed:', e);
            });
        });
        
        loginVideo.addEventListener('error', function(e) {
            console.error('Login video error:', e);
            console.error('Video src:', loginVideo.src);
        });
        
        // Force play after a short delay
        setTimeout(() => {
            loginVideo.play().catch(e => {
                console.log('Delayed video play failed:', e);
            });
        }, 1000);
    }
    
    // Tab switching
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', function() {
            switchToLogin();
        });
        
        signupTab.addEventListener('click', function() {
            switchToSignup();
        });
    }
    
    function switchToLogin() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        clearMessages();
    }
    
    function switchToSignup() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessages();
    }
    
    function clearMessages() {
        if (loginMessage) loginMessage.style.display = 'none';
        if (signupMessage) signupMessage.style.display = 'none';
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                showLoginMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = loginForm.querySelector('.submit-button');
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
                    // Show loading screen
                    showLoadingScreen();
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 3000);
                } else {
                    showLoginMessage(data.message, 'error');
                }
            } catch (error) {
                showLoginMessage('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();
            
            // Validation
            if (!name || !phone || !email || !password || !confirmPassword) {
                showSignupMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showSignupMessage('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showSignupMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showSignupMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showSignupMessage('Please enter a valid phone number', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = signupForm.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Creating Account...</span>';
            submitButton.disabled = true;
            
            try {
                const response = await fetch('/user_signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSignupMessage(data.message, 'success');
                    setTimeout(() => {
                        // Switch to login form
                        switchToLogin();
                        // Pre-fill email
                        document.getElementById('loginEmail').value = email;
                    }, 2000);
                } else {
                    showSignupMessage(data.message, 'error');
                }
            } catch (error) {
                showSignupMessage('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    function showLoginMessage(message, type) {
        if (loginMessage) {
            loginMessage.textContent = message;
            loginMessage.className = `form-message ${type}`;
            loginMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    function showSignupMessage(message, type) {
        if (signupMessage) {
            signupMessage.textContent = message;
            signupMessage.className = `form-message ${type}`;
            signupMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                signupMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Form validation on input
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
    
    function validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showInputError(input, 'Please enter a valid email address');
            }
        } else if (type === 'password') {
            if (value && value.length < 6) {
                showInputError(input, 'Password must be at least 6 characters long');
            }
        } else if (name === 'phone') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                showInputError(input, 'Please enter a valid phone number');
            }
        } else if (name === 'name') {
            if (value && value.length < 2) {
                showInputError(input, 'Name must be at least 2 characters long');
            }
        }
    }
    
    function showInputError(input, message) {
        input.style.borderColor = '#721c24';
        input.style.backgroundColor = 'rgba(248, 215, 218, 0.1)';
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.color = '#721c24';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function clearInputError(input) {
        input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Smooth animations
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Add smooth transitions for form switching
    function switchToLogin() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        
        signupForm.style.opacity = '0';
        signupForm.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'translateX(0)';
        }, 150);
        
        clearMessages();
    }
    
    function switchToSignup() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        
        loginForm.style.opacity = '0';
        loginForm.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            signupForm.style.opacity = '1';
            signupForm.style.transform = 'translateX(0)';
        }, 150);
        
        clearMessages();
    }
});

// Loading Screen Functions
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        // Trigger the show class after a brief delay for smooth transition
        setTimeout(() => {
            loadingScreen.classList.add('show');
        }, 100);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('show');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}
