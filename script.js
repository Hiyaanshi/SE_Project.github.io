/* =========================
   ANIMATED CONTRIMAP LOGO
========================= */

const logo = document.getElementById("logo");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if (!reduceMotion.matches && logo) {

    let frame;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    function onMove(event) {

        const { clientX, clientY } = event;

        targetX =
            (clientX / window.innerWidth - 0.5) * 18;

        targetY =
            (clientY / window.innerHeight - 0.5) * 14;
    }

    function animate() {

        currentX +=
            (targetX - currentX) * 0.035;

        currentY +=
            (targetY - currentY) * 0.035;

        logo.style.transform =
            `translate3d(${currentX}px, ${currentY}px, 0)`;

        frame = requestAnimationFrame(animate);
    }

    window.addEventListener(
        "pointermove",
        onMove,
        { passive: true }
    );

    frame = requestAnimationFrame(animate);
}


/* =========================
   NAVIGATION
========================= */

const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main section");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 120 && rect.bottom >= 120) {
            current = section.id;
        }
    });

    links.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );
    });
});

/* =========================
   INFINITE TEAM CAROUSEL
========================= */

const carousel = document.querySelector(".carousel");
const firstGroup = carousel?.querySelector(":scope > .group");

if (carousel && firstGroup) {
    // The name block belongs with the role and description; move the existing
    // markup before cloning so every loop copy has the same card structure.
    firstGroup.querySelectorAll(".card").forEach((card) => {
        const name = card.querySelector(".card-name");
        const details = card.querySelector(".card-right");
        if (name && details) details.prepend(name);
    });

    // Keep one real group in the middle and identical copies on both sides.
    // Moving the scroll position to the matching copy is visually seamless.
    carousel.querySelectorAll(":scope > .group").forEach((group, index) => {
        if (index > 0) group.remove();
    });

    const before = firstGroup.cloneNode(true);
    const after = firstGroup.cloneNode(true);
    before.setAttribute("aria-hidden", "true");
    after.setAttribute("aria-hidden", "true");
    carousel.prepend(before);
    carousel.append(after);

    let groupWidth = 0;
    let lastFrameTime;
    const speed = 35; // Matches the previous 110-second carousel pace.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
        groupWidth = firstGroup.getBoundingClientRect().width;
    };

    const centerCarousel = () => {
        measure();
        if (groupWidth) carousel.scrollLeft = groupWidth;
    };

    const keepLooping = () => {
        if (!groupWidth) return;

        // Recenter before either physical end is reachable. Because the groups
        // are identical, this changes only the internal scroll coordinate.
        while (carousel.scrollLeft < groupWidth * 0.25) {
            carousel.scrollLeft += groupWidth;
        }
        while (carousel.scrollLeft > groupWidth * 1.75) {
            carousel.scrollLeft -= groupWidth;
        }
    };

    const autoplay = (time) => {
        if (!lastFrameTime) lastFrameTime = time;
        const elapsed = time - lastFrameTime;
        lastFrameTime = time;

        if (!reducedMotion.matches) {
            carousel.scrollLeft += (speed * elapsed) / 1000;
            keepLooping();
        }

        requestAnimationFrame(autoplay);
    };

    carousel.addEventListener("scroll", keepLooping, { passive: true });
    window.addEventListener("resize", centerCarousel);
    reducedMotion.addEventListener("change", () => {
        lastFrameTime = undefined;
    });

    requestAnimationFrame(() => {
        centerCarousel();
        requestAnimationFrame(autoplay);
    });
}
