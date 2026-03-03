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
