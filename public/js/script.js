document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initScrollReveal();
    initNavHighlight();
    initTypedEffect();
    initProjectHover();
    initCountUp();
    initChromeTabs();
    initSkillBars();
});

function initMobileNav() {
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        navLinks.classList.toggle("show");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            toggle.classList.remove("active");
            navLinks.classList.remove("show");
        });
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(el => observer.observe(el));
}

function initNavHighlight() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nava");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach(link => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
}

function initTypedEffect() {
    const el = document.getElementById("typed-text");
    if (!el) return;

    const phrases = [
        "Associate Engineer @ IndiaMART",
        "Software Engineer",
        "Ex-Agoda · Ridecell · CreditSea",
        "DSA/Problem Solving enthusiast"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
}

function initProjectHover() {
    document.querySelectorAll(".pro-img").forEach(img => {
        const bw = img.dataset.bw;
        const color = img.dataset.color;
        if (!bw || !color) return;

        const card = img.closest(".project-card");
        if (!card) return;

        card.addEventListener("mouseenter", () => { img.src = color; });
        card.addEventListener("mouseleave", () => { img.src = bw; });
    });
}

function initCountUp() {
    const stats = document.querySelectorAll(".achievement-stat[data-target]");
    let animated = false;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    stats.forEach(stat => {
                        const target = parseInt(stat.dataset.target, 10);
                        const isDecimal = stat.dataset.decimal === "true";
                        const duration = 1500;
                        const start = performance.now();

                        function update(now) {
                            const progress = Math.min((now - start) / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const value = Math.floor(target * eased);

                            if (isDecimal) {
                                stat.textContent = (value / 100).toFixed(2);
                            } else {
                                stat.textContent = value;
                            }

                            if (progress < 1) requestAnimationFrame(update);
                        }

                        requestAnimationFrame(update);
                    });
                }
            });
        }, { threshold: 0.3 }
    );

    const section = document.getElementById("achievements");
    if (section) observer.observe(section);
}

function initChromeTabs() {
    const tabs = document.querySelectorAll(".chrome-tab:not(.new-tab)");
    const panels = document.querySelectorAll(".tab-panel");
    if (!tabs.length) return;

    const MAX_BULLETS = 5;

    function panelHasOverflow(panel) {
        const body = panel.querySelector(".panel-body");
        const desc = panel.querySelector(".panel-desc");
        const bullets = panel.querySelectorAll(".panel-bullets li");
        const readMore = panel.querySelector(".panel-read-more");

        if (!body || !readMore) return;

        body.classList.remove("expanded");
        body.classList.add("collapsed");
        body.scrollTop = 0;

        const bulletsOverflow = bullets.length > MAX_BULLETS;
        let descOverflow = false;

        if (desc && panel.classList.contains("active")) {
            descOverflow = desc.scrollHeight > desc.clientHeight + 1;
        }

        const hasOverflow = bulletsOverflow || descOverflow;

        body.classList.toggle("has-overflow", hasOverflow);
        readMore.hidden = !hasOverflow;
        readMore.textContent = "Read more";
    }

    function collapseAll() {
        panels.forEach(panel => panelHasOverflow(panel));
    }

    panels.forEach(panel => {
        const body = panel.querySelector(".panel-body");
        const readMore = panel.querySelector(".panel-read-more");
        if (!body || !readMore) return;

        readMore.addEventListener("click", () => {
            const isExpanded = body.classList.contains("expanded");

            if (isExpanded) {
                body.classList.remove("expanded");
                body.classList.add("collapsed");
                readMore.textContent = "Read more";
                body.scrollTop = 0;
            } else {
                body.classList.remove("collapsed");
                body.classList.add("expanded");
                readMore.textContent = "Read less";
            }
        });
    });

    collapseAll();

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
            const currentPanel = document.querySelector(".tab-panel.active");
            if (!targetPanel || targetPanel === currentPanel) return;

            tabs.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");

            panels.forEach(panel => {
                panel.classList.toggle("active", panel === targetPanel);
            });

            panelHasOverflow(targetPanel);
        });
    });

    window.addEventListener("resize", () => {
        const active = document.querySelector(".tab-panel.active");
        if (active) panelHasOverflow(active);
    });
}

function initSkillBars() {
    const section = document.getElementById("skills");
    if (!section) return;

    let animated = false;
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    section.querySelectorAll("[data-width]").forEach(bar => {
                        bar.style.width = bar.dataset.width + "%";
                    });
                }
            });
        }, { threshold: 0.2 }
    );
    observer.observe(section);
}