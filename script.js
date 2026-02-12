/**
 * Navigation State Management (Day 14 Architecture)
 * * UI INVARIANTS:
 * 1. Single Source of Truth: 'isMenuOpen' variable defines the state.
 * 2. State-to-DOM Sync: The DOM must never be checked to infer state.
 * 3. Scroll Lock: If menu is open, body scroll must be disabled.
 * 4. Event Hygiene: Global listeners (Escape key) must only be active when menu is open.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Single Source of Truth
    // Reality is defined here. The DOM mirrors this variable.
    let isMenuOpen = false;

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks ? navLinks.querySelectorAll('a') : [];

    /**
     * Synchronization Layer (Renderer)
     * Derived from the "Single Source of Truth." Ensures the DOM 
     * stays in sync with 'isMenuOpen'.
     */
    const renderMenuState = () => {
        // Apply visual state
        navLinks.classList.toggle('is-open', isMenuOpen);
        
        // Apply accessibility state
        navToggle.setAttribute('aria-expanded', isMenuOpen.toString());
        
        // Enforce Scroll Lock invariant
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        // Manage Global Event Listeners
        // We add/remove the listener based on state to prevent "event pollution."
        // In large apps, this prevents hundreds of keydown checks when the menu is closed.
        if (isMenuOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    };

    /**
     * State Mutation Layer
     * The only way to change the UI is through this function.
     */
    const setMenuState = (newState) => {
        if (isMenuOpen === newState) return; // Prevent unnecessary DOM thrashing
        isMenuOpen = newState;
        renderMenuState();
    };

    /**
     * Event Handlers
     */
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            setMenuState(false);
            navToggle.focus();
        }
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            setMenuState(!isMenuOpen);
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });
    }
});