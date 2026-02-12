/**
 * Navigation Finite State Machine (Day 15 Architecture)
 * * ARCHITECTURAL INVARIANTS:
 * 1. Determinism: The UI can only exist in one of four explicit states.
 * 2. Transition Validity: State mutations only occur if the transition is legal.
 * 3. Temporal Integrity: Animation timers are managed to prevent race conditions.
 * 4. DOM Derivation: The DOM is a pure function of the FSM state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Vocabulary Definition
    const MENU_STATES = {
        CLOSED: 'closed',
        OPENING: 'opening',
        OPEN: 'open',
        CLOSING: 'closing'
    };

    // 2. State Authority
    let currentMenuState = MENU_STATES.CLOSED;
    let transitionTimer = null; // Reference to manage temporal race conditions

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks ? navLinks.querySelectorAll('a') : [];

    /**
     * Legal Transition Map
     * Key: Current State | Value: Array of allowed Next States
     */
    const LEGAL_TRANSITIONS = {
        [MENU_STATES.CLOSED]: [MENU_STATES.OPENING],
        [MENU_STATES.OPENING]: [MENU_STATES.OPEN],
        [MENU_STATES.OPEN]: [MENU_STATES.CLOSING],
        [MENU_STATES.CLOSING]: [MENU_STATES.CLOSED]
    };

    /**
     * Renderer
     * Purely derives DOM attributes and side effects from currentMenuState.
     */
    const render = () => {
        const isOpenSemantic = currentMenuState === MENU_STATES.OPEN || currentMenuState === MENU_STATES.OPENING;
        const isTransitioning = currentMenuState === MENU_STATES.OPENING || currentMenuState === MENU_STATES.CLOSING;

        // Visual Class: Keep .is-open active during the entire open/opening/closing lifecycle
        // Only remove it when definitively CLOSED.
        navLinks.classList.toggle('is-open', currentMenuState !== MENU_STATES.CLOSED);
        
        // Accessibility: Reflect semantic intent
        navToggle.setAttribute('aria-expanded', isOpenSemantic.toString());
        
        // Invariant: Scroll lock active during any non-closed state
        document.body.style.overflow = (currentMenuState !== MENU_STATES.CLOSED) ? 'hidden' : '';

        // Global Key Listener Management
        if (currentMenuState === MENU_STATES.OPEN) {
            document.addEventListener('keydown', handleEscape);
        } else {
            document.removeEventListener('keydown', handleEscape);
        }
    };

    /**
     * State Transition Manager
     * Validates legality and handles temporal logic (timers).
     */
    const transitionTo = (nextState) => {
        const allowed = LEGAL_TRANSITIONS[currentMenuState].includes(nextState);

        if (!allowed) {
            console.warn(`Illegal transition attempted: ${currentMenuState} -> ${nextState}`);
            return;
        }

        // Clear any existing timers to prevent overlapping state mutations (Race Conditions)
        if (transitionTimer) clearTimeout(transitionTimer);

        currentMenuState = nextState;
        render();

        // Handle Temporal States
        if (currentMenuState === MENU_STATES.OPENING) {
            transitionTimer = setTimeout(() => transitionTo(MENU_STATES.OPEN), 300);
        } else if (currentMenuState === MENU_STATES.CLOSING) {
            transitionTimer = setTimeout(() => transitionTo(MENU_STATES.CLOSED), 300);
        }
    };

    /**
     * Action Handlers
     * Actions do not mutate state; they request transitions.
     */
    const handleToggle = () => {
        if (currentMenuState === MENU_STATES.CLOSED) {
            transitionTo(MENU_STATES.OPENING);
        } else if (currentMenuState === MENU_STATES.OPEN) {
            transitionTo(MENU_STATES.CLOSING);
        }
        // Transitions during 'opening' or 'closing' are ignored by the FSM logic
    };

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            transitionTo(MENU_STATES.CLOSING);
            navToggle.focus();
        }
    };

    const handleLinkClick = () => {
        if (currentMenuState === MENU_STATES.OPEN) {
            transitionTo(MENU_STATES.CLOSING);
        }
    };

    // 3. Bindings
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', handleToggle);
        links.forEach(link => link.addEventListener('click', handleLinkClick));
    }

    // Initial Render
    render();
});