/**
 * Mobile Navigation Logic
 * Manages the visibility of the menu on small screens
 */
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            // Toggles the 'is-open' class on the menu
            // This switches the display from 'none' to 'flex' in CSS
            navLinks.classList.toggle('is-open');
            
            // Basic accessibility: lets screen readers know if menu is expanded
            const isOpen = navLinks.classList.contains('is-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });
    }
});