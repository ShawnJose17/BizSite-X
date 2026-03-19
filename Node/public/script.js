//===== STATE MACHINE =====
const createStateMachine = ({ initialState, transitions, onRender }) => {
    let state = initialState;
    return {
        transition(nextState) {
            const legal = transitions[state] || [];
            if (!legal.includes(nextState)) return;
            const prev = state;
            state = nextState;
            onRender(state, prev);
        },
        getState() { return state; }
    };
};

document.addEventListener("DOMContentLoaded", () => {
    // ===== MOBILE NAVIGATION (X Toggle Integrated) =====
    const MENU = { CLOSED: "closed", OPENING: "opening", OPEN: "open", CLOSING: "closing" };
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");
    let timer = null;

    const menuMachine = createStateMachine({
        initialState: MENU.CLOSED,
        transitions: {
            [MENU.CLOSED]: [MENU.OPENING],
            [MENU.OPENING]: [MENU.OPEN],
            [MENU.OPEN]: [MENU.CLOSING],
            [MENU.CLOSING]: [MENU.CLOSED]
        },
        onRender: (state) => {
            navLinks.classList.toggle("is-open", state !== MENU.CLOSED);
            
            // Requirements: Hamburger to X toggle
            navToggle.classList.toggle("is-active", state === MENU.OPEN || state === MENU.OPENING);
            navToggle.setAttribute("aria-expanded", state === MENU.OPEN);

            if (timer) clearTimeout(timer);
            if (state === MENU.OPENING) timer = setTimeout(() => menuMachine.transition(MENU.OPEN), 250);
            if (state === MENU.CLOSING) timer = setTimeout(() => menuMachine.transition(MENU.CLOSED), 250);
        }
    });

    navToggle.addEventListener("click", () => {
        const s = menuMachine.getState();
        if (s === MENU.CLOSED) menuMachine.transition(MENU.OPENING);
        if (s === MENU.OPEN) menuMachine.transition(MENU.CLOSING);
    });

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            if (menuMachine.getState() === MENU.OPEN) menuMachine.transition(MENU.CLOSING);
        });
    });

    document.addEventListener("click", (e) => {
        const isClickInsideNav = navLinks.contains(e.target);
        const isClickToggle = navToggle.contains(e.target);

        if (!isClickInsideNav && !isClickToggle) {
            if (menuMachine.getState() === MENU.OPEN) {
                menuMachine.transition(MENU.CLOSING);
            }
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", e => {
            const id = anchor.getAttribute("href");
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // ===== SCROLL BUTTONS & HEADER =====
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    const scrollBottomBtn = document.getElementById("scrollBottomBtn");
    const header = document.querySelector(".site-header");

    function updateScroll() {
        const y = window.scrollY;
        const pageHeight = document.body.scrollHeight - window.innerHeight;
        scrollTopBtn.classList.toggle("show", y > 300);
        scrollBottomBtn.classList.toggle("show", y < pageHeight - 300);
        header.classList.toggle("scrolled", y > 40);
    }

    window.addEventListener("scroll", updateScroll);
    scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    scrollBottomBtn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    // ===== SCROLL REVEAL (Slide Up Animation) =====
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.15 });

    // Apply reveal to sections, cards, and titles for that "sliding up" feel
    document.querySelectorAll(".reveal, .section-title, .card, .about-text").forEach(el => {
        el.classList.add("reveal"); 
        revealObserver.observe(el);
    });

    // ===== ORB RANDOM FLOAT (REAL MOVEMENT) =====
    const orbs = document.querySelectorAll(".orb");
    const hero = document.querySelector(".hero");

    const orbData = [];

    function initOrbs() {
        const heroRect = hero.getBoundingClientRect();

        orbs.forEach((orb) => {
            const size = orb.offsetWidth;

            let x = Math.random() * (heroRect.width - size);
            let y = Math.random() * (heroRect.height - size);

            // Slightly faster, but controlled
            const speed = Math.random() * 0.8 + 0.3; // wider variation

            let dx = speed * (Math.random() < 0.5 ? 1 : -1);
            let dy = speed * (Math.random() < 0.5 ? 1 : -1);

            const depth = Math.random() * 0.6 + 0.4; // 0.4 (far) → 1 (near)

            orbData.push({ 
                orb, 
                x, y, 
                dx: dx * depth, 
                dy: dy * depth, 
                size,
                depth,
                parallaxX: 0,
                parallaxY: 0
            });

            // Visual depth effects
            orb.style.opacity = 0.15 + depth * 0.5;
            orb.style.filter = `blur(${140 - depth * 90}px)`;

        });
    }

    function animateOrbs() {
        smoothMouseX += (mouseX - smoothMouseX) * 0.10;
        smoothMouseY += (mouseY - smoothMouseY) * 0.10;

        const width = hero.offsetWidth;
        const height = hero.offsetHeight;

        orbData.forEach(o => {
            o.x += o.dx * 1.2;
            o.y += o.dy * 1.2;

            // Bounce PERFECTLY inside
            if (o.x <= 0) {
                o.x = 0;
                o.dx *= -1;
            }

            if (o.x + o.size >= width) {
                o.x = width - o.size;
                o.dx *= -1;
            }

            if (o.y <= 0) {
                o.y = 0;
                o.dy *= -1;
            }

            if (o.y + o.size >= height) {
                o.y = height - o.size;
                o.dy *= -1;
            }

            // Depth-based parallax strength (we’ll define depth next)
            const PARALLAX_STRENGTH = 90;

            const px = smoothMouseX * PARALLAX_STRENGTH * o.depth;
            const py = smoothMouseY * PARALLAX_STRENGTH * o.depth;

            o.orb.style.transform = `translate(${o.x + px}px, ${o.y + py}px)`;
        });

        requestAnimationFrame(animateOrbs);
    }

    initOrbs();

    let mouseX = 0;
    let mouseY = 0;

    hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();

        // Normalize between -1 and 1
        mouseX = (e.clientX - rect.width / 2) / rect.width;
        mouseY = (e.clientY - rect.height / 2) / rect.height;
    });

    let smoothMouseX = 0;
    let smoothMouseY = 0;

    animateOrbs();

    // ===== TESTIMONIAL SLIDER (Fixing Auto-Scroll Jump) =====
    const track = document.querySelector(".testimonial-track");
    const slides = document.querySelectorAll(".testimonial-slide");
    const nextBtn = document.querySelector(".slider-btn.next");
    const prevBtn = document.querySelector(".slider-btn.prev");
    const dotsContainer = document.querySelector(".slider-dots");

    if (track && slides.length > 0) {
        let index = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement("button");
            if (i === 0) dot.classList.add("active");
            dot.onclick = () => { index = i; updateSlider(); };
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".slider-dots button");

        function updateSlider() {
            const slideWidth = slides[0].offsetWidth;
            const gap = 30;

            const offset = -(index * (slideWidth + gap)) + (track.parentElement.offsetWidth - slideWidth) / 2;

            track.style.transform = `translateX(${offset}px)`;

            slides.forEach((s, i) => s.classList.toggle("active", i === index));
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
        }

        nextBtn.onclick = () => { index = (index + 1) % slides.length; updateSlider(); };
        prevBtn.onclick = () => { index = (index - 1 + slides.length) % slides.length; updateSlider(); };

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateSlider, 200);
        });
        setTimeout(updateSlider, 100);

        // Logic fix: Only autoplay if the slider is actually visible on screen
        let autoPlay = setInterval(() => {
            if (!document.hidden) {
                index = (index + 1) % slides.length;
                updateSlider();
            }
        }, 6000);

        // ===== TOUCH / DRAG SUPPORT =====
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let moved = false;

        const threshold = 50; // swipe sensitivity

        function onStart(x) {
            startX = x;
            isDragging = true;
            moved = false;
        }

        function onMove(x) {
            if (!isDragging) return;
            currentX = x;
            const diff = currentX - startX;

            if (Math.abs(diff) > 5) moved = true;

            track.style.transition = "none";
            track.style.transform = `translateX(${getCurrentOffset() + diff}px)`;
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;

            const diff = currentX - startX;

            track.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

            if (diff > threshold) {
                index = (index - 1 + slides.length) % slides.length;
            } else if (diff < -threshold) {
                index = (index + 1) % slides.length;
            }

            updateSlider();
        }

        function getCurrentOffset() {
            const slideWidth = slides[0].offsetWidth;
            const gap = 30;
            return -(index * (slideWidth + gap)) + (track.parentElement.offsetWidth - slideWidth) / 2;
        }

        track.addEventListener("touchstart", (e) => {
            onStart(e.touches[0].clientX);
        });

        track.addEventListener("touchmove", (e) => {
            onMove(e.touches[0].clientX);
        });

        track.addEventListener("touchend", onEnd);

        track.addEventListener("mousedown", (e) => {
            e.preventDefault();
            onStart(e.clientX);
        });

        window.addEventListener("mousemove", (e) => {
            onMove(e.clientX);
        });

        window.addEventListener("mouseup", onEnd);
    }

    // ===== SERVICE CARD 3D TILT =====
    document.querySelectorAll(".service-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = -(y - rect.height / 2) / 12;
            const ry = (x - rect.width / 2) / 12;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
        });
    });

    // ===== CONTACT FORM & TOAST SYSTEM =====
    const form = document.getElementById("contactForm");

    // Create ONE reusable toast
    const toast = document.createElement("div");
    toast.className = "form-toast";
    document.body.appendChild(toast);

    // Function to show toast
    function showToast(type, message) {
        toast.className = `form-toast ${type}`;
        
        const icon = type === "success" ? "✓" : "✕";

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <span>${message}</span>
        `;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            const data = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                const res = await fetch("/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (!res.ok) throw new Error();

                showToast("success", "Message sent successfully!");
                form.reset();

            } catch {
                showToast("error", "Something went wrong. Please try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            }
        });
    }
});