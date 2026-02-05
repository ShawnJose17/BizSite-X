/**
 * Navigation Accessibility Manager
 * DAY 13: Scalable Query Selection
 */
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    // Finds anchors regardless of list nesting
    const links = navLinks ? navLinks.querySelectorAll('a') : [];

    const toggleMenu = (forceState) => {
        const isOpening = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('is-open');
        
        navLinks.classList.toggle('is-open', isOpening);
        navToggle.setAttribute('aria-expanded', isOpening);
        
        // Prevent background scrolling for mobile UX
        document.body.style.overflow = isOpening ? 'hidden' : '';
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => toggleMenu());

        // Close menu when a link is clicked (crucial for anchor-link UX)
        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Keyboard "Escape" to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                toggleMenu(false);
                navToggle.focus();
            }
        });
    }
});