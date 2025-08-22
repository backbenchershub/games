// Mobile Menu Functionality
window.toggleDrawer = function(show) {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('menuOverlay');
    if (!drawer || !overlay) return;
    
    if (show) {
        // Show overlay with fade effect
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = '1', 0);
        
        // Slide in drawer
        drawer.style.left = '0';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        // Hide overlay with fade effect
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
        
        // Slide out drawer
        drawer.style.left = '-16rem';
        document.body.style.overflow = ''; // Restore scrolling
    }
};

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeDrawer');
    const overlay = document.getElementById('menuOverlay');
    
    // Style the overlay for transitions
    if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease-in-out';
        overlay.style.opacity = '0';
    }

    // Add click handlers
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDrawer(true);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDrawer(false);
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleDrawer(false);
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}
