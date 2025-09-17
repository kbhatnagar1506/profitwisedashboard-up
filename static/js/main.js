// Video optimization
document.addEventListener('DOMContentLoaded', function() {
    // Mobile video optimization
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
            console.log('Video autoplay failed:', e);
        });
    });
});

// User Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const userLoginButton = document.getElementById('userLoginButton');
    const userLoginModal = document.getElementById('userLoginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const userLoginForm = document.getElementById('userLoginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Open login page
    if (userLoginButton) {
        userLoginButton.addEventListener('click', function() {
            window.location.href = '/login';
        });
    }
    
    // Close login modal
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            closeUserLoginModal();
        });
    }
    
    // Close modal when clicking overlay
    if (userLoginModal) {
        userLoginModal.addEventListener('click', function(e) {
            if (e.target === userLoginModal) {
                closeUserLoginModal();
            }
        });
    }
    
    // Handle login form submission
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('userEmail').value.trim();
            const password = document.getElementById('userPassword').value.trim();
            
            if (!email || !password) {
                showLoginMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = userLoginForm.querySelector('.login-submit-button');
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
                    showLoginMessage(data.message, 'success');
                    setTimeout(() => {
                        closeUserLoginModal();
                        // Redirect to dashboard or show success
                        window.location.href = '/dashboard';
                    }, 1500);
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
    
    function closeUserLoginModal() {
        userLoginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        userLoginForm.reset();
        loginMessage.style.display = 'none';
    }
    
    function showLoginMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
        loginMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            loginMessage.style.display = 'none';
        }, 5000);
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Menu button functionality
    const menuButton = document.getElementById('menuButton');
    const menuContent = document.getElementById('menuContent');
    const menuClose = document.getElementById('menuClose');
    const heroSection = document.getElementById('heroSection');
    
    // Menu button click handler
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            heroSection.classList.add('menu-active');
            menuContent.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // Close menu functionality
    if (menuClose) {
        menuClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked'); // Debug log
            heroSection.classList.remove('menu-active');
            menuContent.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }
    
    // Close menu when clicking outside
    if (menuContent) {
        menuContent.addEventListener('click', function(e) {
            if (e.target === menuContent) {
                heroSection.classList.remove('menu-active');
                menuContent.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuContent && menuContent.classList.contains('active')) {
            heroSection.classList.remove('menu-active');
            menuContent.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Right Menu Animation
    const rightMenu = document.getElementById('rightMenu');
    let menuTimeout;
    let isMenuVisible = false;

    // Mouse movement detection for right menu
    document.addEventListener('mousemove', function(e) {
        const windowWidth = window.innerWidth;
        const rightThreshold = windowWidth - 100; // Trigger zone 100px from right edge
        
        if (e.clientX > rightThreshold && !isMenuVisible) {
            showMenu();
        } else if (e.clientX < rightThreshold - 50 && isMenuVisible) {
            hideMenu();
        }
    });

    // Show menu function
    function showMenu() {
        clearTimeout(menuTimeout);
        rightMenu.classList.add('show');
        isMenuVisible = true;
    }

    // Hide menu function
    function hideMenu() {
        menuTimeout = setTimeout(() => {
            rightMenu.classList.remove('show');
            isMenuVisible = false;
        }, 300); // Small delay to prevent flickering
    }

    // Keep menu open when hovering over it
    rightMenu.addEventListener('mouseenter', function() {
        clearTimeout(menuTimeout);
    });

    rightMenu.addEventListener('mouseleave', function() {
        hideMenu();
    });

    // Smooth scroll for menu links
    const menuLinks = document.querySelectorAll('.menu-item[href^="#"], .menu-link[href^="#"]');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close menu if it's open
                if (menuContent && menuContent.classList.contains('active')) {
                    heroSection.classList.remove('menu-active');
                    menuContent.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                const targetPosition = targetSection.offsetTop;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Hide right menu after clicking
                hideMenu();
            }
        });
    });

    // Intersection Observer for feature cards animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Button click handlers
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            // Add your primary action here
            console.log('Get Started clicked');
            // You can redirect to a signup page or open a modal
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            // Add your secondary action here
            console.log('Learn More clicked');
            // You can scroll to features section or open a modal
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = featuresSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

            // Add loading animation
            window.addEventListener('load', function() {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 100);
            });

            // Video section intersection observer
            const videoSection = document.getElementById('videoSection');
            const backgroundVideo = document.getElementById('backgroundVideo');
            
            if (videoSection && backgroundVideo) {
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Video section is visible, start playing
                            backgroundVideo.play().catch(e => {
                                console.log('Video autoplay prevented:', e);
                            });
                        } else {
                            // Video section is not visible, pause video
                            backgroundVideo.pause();
                        }
                    });
                }, {
                    threshold: 0.5 // Trigger when 50% of the section is visible
                });
                
                videoObserver.observe(videoSection);
                
                // Video loading handler
                backgroundVideo.addEventListener('loadeddata', function() {
                    // Video is ready to play, remove black overlay
                    videoSection.style.setProperty('--overlay-opacity', '0');
                });
            }
        });
        
        // ProfitWise Video Control
        const profitwiseVideoSection = document.getElementById('profitwiseVideoSection');
        const profitwiseVideo = document.getElementById('profitwiseVideo');
        
        if (profitwiseVideoSection && profitwiseVideo) {
            const profitwiseVideoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        profitwiseVideo.play();
                    } else {
                        profitwiseVideo.pause();
                    }
                });
            }, {
                threshold: 0.5 // Trigger when 50% of the section is visible
            });
            
            profitwiseVideoObserver.observe(profitwiseVideoSection);
        }

    // Waitlist form handling
    const waitlistForm = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');
    const submitButton = document.getElementById('submitButton');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('emailInput').value.trim();
            const name = document.getElementById('nameInput').value.trim();
            
            if (!email || !name) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="waitlist-button-text">Joining...</span>';
            
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
                    showMessage(data.message, 'success');
                    waitlistForm.reset();
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                showMessage('An error occurred. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <img src="/static/profitwiseicon1.png" alt="ProfitWise Icon" class="waitlist-icon">
                    <span class="waitlist-button-text">Join Waitlist</span>
                `;
            }
        });
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
