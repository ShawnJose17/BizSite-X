/**
 * Navigation Accessibility Manager
 * Handles state, ARIA attributes, and keyboard interaction
 */
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks.querySelectorAll('a');

    const toggleMenu = (forceState) => {
        const isOpening = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('is-open');
        
        navLinks.classList.toggle('is-open', isOpening);
        navToggle.setAttribute('aria-expanded', isOpening);
        
        // Prevent body scroll when menu is open on mobile
        document.body.style.overflow = isOpening ? 'hidden' : '';
    };

    if (navToggle && navLinks) {
        // Toggle on click
        navToggle.addEventListener('click', () => toggleMenu());

        // Close on link click
        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Close on Escape key (Keyboard User Experience)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                toggleMenu(false);
                navToggle.focus();
            }
        });
    }
});