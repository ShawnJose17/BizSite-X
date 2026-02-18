/**
 * FSM Factory (Day 16 Architecture)
 * A generic, logic-agnostic state engine.
 */
const createStateMachine = ({ initialState, transitions, onRender }) => {
  let state = initialState;

  return {
    transition(nextState) {
      const legalMoves = transitions[state] || [];
      if (!legalMoves.includes(nextState)) {
        console.warn(`Illegal transition: ${state} -> ${nextState}`);
        return false;
      }

      const previousState = state;
      state = nextState;
      
      // Notify the outside world that state changed
      onRender(state, previousState);
      return true;
    },
    getState() {
      return state;
    }
  };
};

/**
 * Navigation Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const MENU_STATES = {
    CLOSED: 'closed',
    OPENING: 'opening',
    OPEN: 'open',
    CLOSING: 'closing'
  };

  let animationTimer = null;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = navLinks ? navLinks.querySelectorAll('a') : [];

  // 1. Initialize the Machine
  const menuMachine = createStateMachine({
    initialState: MENU_STATES.CLOSED,
    transitions: {
      [MENU_STATES.CLOSED]: [MENU_STATES.OPENING],
      [MENU_STATES.OPENING]: [MENU_STATES.OPEN],
      [MENU_STATES.OPEN]: [MENU_STATES.CLOSING],
      [MENU_STATES.CLOSING]: [MENU_STATES.CLOSED]
    },
    onRender: (state) => syncDOM(state)
  });

  /**
   * DOM Synchronization (Side Effects)
   */
  const syncDOM = (state) => {
    const isOpenSemantic = state === MENU_STATES.OPEN || state === MENU_STATES.OPENING;
    
    // Class management
    navLinks.classList.toggle('is-open', state !== MENU_STATES.CLOSED);
    
    // Accessibility management
    navToggle.setAttribute('aria-expanded', isOpenSemantic.toString());
    
    // Invariant: Scroll lock
    document.body.style.overflow = state !== MENU_STATES.CLOSED ? 'hidden' : '';

    // Event listener hygiene
    if (state === MENU_STATES.OPEN) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    // Handle Animation Timing (Temporal logic stays in the controller)
    if (animationTimer) clearTimeout(animationTimer);

    if (state === MENU_STATES.OPENING) {
      animationTimer = setTimeout(() => menuMachine.transition(MENU_STATES.OPEN), 300);
    } else if (state === MENU_STATES.CLOSING) {
      animationTimer = setTimeout(() => menuMachine.transition(MENU_STATES.CLOSED), 300);
    }
  };

  /**
   * Input Handlers
   */
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      menuMachine.transition(MENU_STATES.CLOSING);
      navToggle.focus();
    }
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const current = menuMachine.getState();
      if (current === MENU_STATES.CLOSED) menuMachine.transition(MENU_STATES.OPENING);
      if (current === MENU_STATES.OPEN) menuMachine.transition(MENU_STATES.CLOSING);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        if (menuMachine.getState() === MENU_STATES.OPEN) {
          menuMachine.transition(MENU_STATES.CLOSING);
        }
      });
    });
  }

  // Run initial sync
  syncDOM(menuMachine.getState());

  // ---------------------------------------------------------
  // 4. PROVE REUSABILITY: The "Tiny FSM" Test
  // ---------------------------------------------------------
  const tinyMachine = createStateMachine({
    initialState: 'idle',
    transitions: {
      idle: ['active'],
      active: ['idle']
    },
    onRender: (state) => console.log(`TinyMachine is now: ${state}`)
  });

  tinyMachine.transition('active'); // Logs: TinyMachine is now: active
  tinyMachine.transition('idle');   // Logs: TinyMachine is now: idle
  tinyMachine.transition('idle');   // Warns: Illegal transition
});