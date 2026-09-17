const polygon = document.getElementById("cursorPointer");
const svg = polygon?.ownerSVGElement;

if (polygon && svg) {

    function onMove(event) {

        const rect = svg.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle =
            Math.atan2(
                event.clientY - centerY,
                event.clientX - centerX
            ) * 180 / Math.PI + 90;

        polygon.style.transformOrigin = "50px 55px";
        polygon.style.transform =
            `rotate(${angle}deg)`;
    }

    window.addEventListener(
        "pointermove",
        onMove,
        { passive: true }
    );
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
