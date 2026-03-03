// Initialize Lucide icons
lucide.createIcons();

// Smooth scrolling and section switching
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    const mobileQuery = window.matchMedia('(max-width: 1024px)');
    
    // Function to show a specific section
    function showSection(sectionId) {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // Sidebar open/close handling for mobile
    function setSidebarState(isOpen) {
        if (sidebar) {
            sidebar.classList.toggle('open', isOpen);
        }
        if (sidebarBackdrop) {
            sidebarBackdrop.classList.toggle('visible', isOpen);
        }
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        }
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            const nextState = !sidebar.classList.contains('open');
            setSidebarState(nextState);
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', function() {
            setSidebarState(false);
        });
    }

    mobileQuery.addEventListener('change', function(event) {
        if (!event.matches) {
            setSidebarState(false);
        }
    });
    
    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);

            if (mobileQuery.matches) {
                setSidebarState(false);
            }
        });
    });
    
    // Show the about section by default
    showSection('about');
    setSidebarState(false);
    
    // Contact form handling with Resend API
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Get submit button and disable it
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader"></i><span>Sending...</span>';
            
            try {
                // Send email via API
                const response = await fetch('http://localhost:3001/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Reset form
                    this.reset();
                    
                    // Show success message
                    alert('✅ Thank you for your message! I\'ll get back to you soon.');
                } else {
                    // Show error message
                    alert('❌ Failed to send message: ' + (data.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error sending email:', error);
                alert('❌ Failed to send message. Please make sure the server is running or try again later.');
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons(); // Reinitialize icons
            }
        });
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.project-card, .achievement-card, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
