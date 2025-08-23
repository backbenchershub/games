// Mobile Menu Functionality
window.toggleDrawer = function(show) {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('menuOverlay');
    if (!drawer || !overlay) return;
    
    if (show) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.style.opacity = '1', 0);
        drawer.style.left = '0';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.classList.add('hidden'), 300);
        drawer.style.left = '-16rem';
        document.body.style.overflow = '';
    }
};

function initializeMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeDrawer');
    const overlay = document.getElementById('menuOverlay');
    
    if (overlay) {
        overlay.style.transition = 'opacity 0.3s ease-in-out';
        overlay.style.opacity = '0';
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDrawer(true);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleDrawer(false);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleDrawer(false);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}
