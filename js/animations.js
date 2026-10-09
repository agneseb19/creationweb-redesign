/* =========================================
   CREATIONWEB MOTION SYSTEM
   Animazioni globali
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================
       ELEMENTI DA ANIMARE
    ===================================== */

    function prepareElements() {

    const selectors = [
        ".section-heading",
        ".trust-band-copy",
        ".stat-card",
        ".case-content",
        ".case-visual",
        ".case-highlight",
        ".problem-step",
        ".method-card",
        "main section h2",
        "main section article"
    ];

    const elements = document.querySelectorAll(
        selectors.join(",")
    );

    elements.forEach((element) => {

        // Escludiamo l'animazione 3D
        if (element.closest(".block-transition")) {
            return;
        }

        // Escludiamo la hero
        if (element.closest(".hero")) {
            return;
        }

        // Evitiamo animazioni annidate
        if (
            element.matches("h2") &&
            element.closest(".section-heading")
        ) {
            return;
        }

        // Evitiamo animazioni duplicate sugli article
        if (
            element.matches("article") &&
            element.parentElement.closest("article")
        ) {
            return;
        }

        element.classList.add("motion-reveal");

    });

}

    /* =====================================
       ANIMAZIONI DELLE CARD
    ===================================== */

    function prepareCards() {

        const cardSelectors = [

            ".stat-card",
            ".problem-step",
            ".method-card",
            ".case-metric",
            ".service-card",
            ".review-card"

        ];

        const cards = document.querySelectorAll(
            cardSelectors.join(",")
        );

        cards.forEach((card) => {

            card.classList.add("motion-card");

        });

    }

    /* =====================================
       ENTRATA PROGRESSIVA
    ===================================== */

    function prepareStagger() {

        const groups = document.querySelectorAll(

            ".stats-grid, .problem-flow, .method-grid"

        );

        groups.forEach((group) => {

            const children = Array.from(group.children);

            children.forEach((child, index) => {

                child.classList.add("motion-reveal");

                const delay = Math.min(
                    index * 100,
                    300
                );

                child.style.setProperty(
                    "--motion-delay",
                    `${delay}ms`
                );

            });

        });

    }

    /* =====================================
       DIREZIONE DELLE ANIMAZIONI
    ===================================== */

    function prepareDirections() {

        document.querySelectorAll(
            ".case-visual"
        ).forEach((element) => {

            element.classList.add("motion-left");

        });

        document.querySelectorAll(
            ".case-content"
        ).forEach((element) => {

            element.classList.add("motion-right");

        });

    }

    /* =====================================
       ANIMAZIONE DELLE IMMAGINI
    ===================================== */

    function prepareImages() {

        const images = document.querySelectorAll(

            ".case-visual, .chart-real"

        );

        images.forEach((element) => {

            element.classList.add("motion-image");

        });

    }

    /* =====================================
       INTERSECTION OBSERVER
    ===================================== */

    function startRevealAnimations() {

        const elements = document.querySelectorAll(
            ".motion-reveal"
        );

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach((element) => {

                element.classList.add("motion-visible");

            });

            return;
        }

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "motion-visible"
                    );

                    observer.unobserve(entry.target);

                });

            },

            {
                threshold: 0.05,

                rootMargin:
                    "0px 0px -35px 0px"
            }

        );

        elements.forEach((element) => {

            observer.observe(element);

        });

    }

    /* =====================================
       CONTATORI NUMERICI
    ===================================== */

    function animateCounter(element) {

        const original = element.textContent.trim();

        const match = original.match(
            /^([+]?)(\d+(?:[.,]\d+)?)(.*)$/
        );

        if (!match) return;

        const prefix = match[1];
        const numberText = match[2];
        const suffix = match[3];

        const target = Number(
            numberText.replace(",", ".")
        );

        if (!Number.isFinite(target)) return;

        const decimalPlaces =
            numberText.includes(".") ||
            numberText.includes(",")
                ? numberText.split(/[.,]/)[1].length
                : 0;

        if (reducedMotion) return;

        const duration = 1400;

        let startTime = null;

        function update(time) {

            if (startTime === null) {
                startTime = time;
            }

            const elapsed = time - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            const eased = 1 - Math.pow(
                1 - progress,
                3
            );

            const value = target * eased;

            const formatted = value.toFixed(
                decimalPlaces
            );

            element.textContent =
                prefix +
                formatted.replace(".", ",") +
                suffix;

            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent = original;

            }

        }

        requestAnimationFrame(update);

    }

    function startCounters() {

        const counters = document.querySelectorAll(
            ".stat-card strong"
        );

        if (
            reducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const counterObserver = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);

                    counterObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.4
            }

        );

        counters.forEach((counter) => {

            counterObserver.observe(counter);

        });

    }

    /* =====================================
   INIZIALIZZAZIONE MOTION SYSTEM
===================================== */

prepareElements();

prepareCards();

prepareStagger();

prepareDirections();

prepareImages();

document.body.classList.add("motion-ready");

startRevealAnimations();

startCounters();
});