/* =========================================
   CREATIONWEB - FLUID INTERACTIVE BLOCK FIELD
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".block-transition");
    const field = document.getElementById("block-field");

    if (!section || !field) return;

    const blocks = [];

    let columns = 0;
    let rows = 0;

    let pointerX = -10000;
    let pointerY = -10000;

    let interacting = false;
    let animationFrame = null;

    let isVisible = true;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    /* =========================================
       CONFIGURAZIONE RESPONSIVE
    ========================================= */

    function getSettings() {

        const width = section.clientWidth;

        if (width < 600) {
            return {
                blockSize: 48,
                radius: 135,
                maxLift: 48,
                smoothness: 0.13
            };
        }

        if (width < 1024) {
            return {
                blockSize: 55,
                radius: 170,
                maxLift: 65,
                smoothness: 0.12
            };
        }

        return {
            blockSize: 62,
            radius: 210,
            maxLift: 85,
            smoothness: 0.11
        };

    }

    let settings = getSettings();

    /* =========================================
       CREAZIONE GRIGLIA RESPONSIVE
    ========================================= */

    function createGrid() {

        settings = getSettings();

        const width = section.clientWidth;
        const height = section.clientHeight;

        const gap = 5;

        columns = Math.ceil(
            width / (settings.blockSize + gap)
        );

        rows = Math.ceil(
            height / (settings.blockSize + gap)
        );

        columns = Math.max(columns, 1);
        rows = Math.max(rows, 1);

        field.innerHTML = "";

        blocks.length = 0;

        field.style.gridTemplateColumns =
            `repeat(${columns}, minmax(0, 1fr))`;

        field.style.gridTemplateRows =
            `repeat(${rows}, minmax(0, 1fr))`;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < columns * rows; i++) {

            const element = document.createElement("div");

            element.className = "block-field__block";

            fragment.appendChild(element);

            blocks.push({
                element: element,
                column: i % columns,
                row: Math.floor(i / columns),
                currentLift: 0,
                targetLift: 0
            });

        }

        field.appendChild(fragment);

    }

    /* =========================================
       CALCOLO MOVIMENTO
    ========================================= */

    function updateTargets() {

        const rect = field.getBoundingClientRect();

        const cellWidth = rect.width / columns;
        const cellHeight = rect.height / rows;

        const radius = settings.radius;

        blocks.forEach((block) => {

            const centerX =
                rect.left +
                (block.column + 0.5) * cellWidth;

            const centerY =
                rect.top +
                (block.row + 0.5) * cellHeight;

            const dx = pointerX - centerX;
            const dy = pointerY - centerY;

            const distance = Math.hypot(dx, dy);

            if (interacting && distance < radius) {

                const normalized =
                    1 - distance / radius;

                /* CURVA MORBIDA */

                const influence =
                    normalized * normalized *
                    (3 - 2 * normalized);

                block.targetLift =
                    influence * settings.maxLift;

            } else {

                block.targetLift = 0;

            }

        });

    }

    /* =========================================
       ANIMAZIONE FLUIDA
    ========================================= */

    function animate() {

        animationFrame = null;

        if (!isVisible) return;

        updateTargets();

        let stillMoving = false;

        blocks.forEach((block) => {

            const difference =
                block.targetLift - block.currentLift;

            if (reducedMotion.matches) {

                block.currentLift = block.targetLift;

            } else {

                block.currentLift +=
                    difference * settings.smoothness;

            }

            if (Math.abs(difference) > 0.15) {
                stillMoving = true;
            }

            if (
                !interacting &&
                block.currentLift < 0.15
            ) {
                block.currentLift = 0;
            }

            const lift = block.currentLift;

            block.element.style.transform =
                `translate3d(0, 0, ${lift.toFixed(2)}px)`;

            block.element.classList.toggle(
                "is-active",
                lift > 7
            );

        });

        if (stillMoving) {
            requestAnimation();
        }

    }

    function requestAnimation() {

        if (animationFrame !== null) return;

        animationFrame =
            window.requestAnimationFrame(animate);

    }

    /* =========================================
       INTERAZIONE MOUSE
    ========================================= */

    section.addEventListener("pointermove", (event) => {

        if (event.pointerType === "touch") return;

        pointerX = event.clientX;
        pointerY = event.clientY;

        interacting = true;

        requestAnimation();

    });

    section.addEventListener("pointerleave", () => {

        interacting = false;

        requestAnimation();

    });

    /* =========================================
       INTERAZIONE TOUCH
    ========================================= */

    section.addEventListener("touchstart", (event) => {

        if (!event.touches.length) return;

        const touch = event.touches[0];

        pointerX = touch.clientX;
        pointerY = touch.clientY;

        interacting = true;

        requestAnimation();

    }, { passive: true });

    section.addEventListener("touchmove", (event) => {

        if (!event.touches.length) return;

        const touch = event.touches[0];

        pointerX = touch.clientX;
        pointerY = touch.clientY;

        interacting = true;

        requestAnimation();

    }, { passive: true });

    function resetTouch() {

        interacting = false;

        requestAnimation();

    }

    section.addEventListener("touchend", resetTouch);
    section.addEventListener("touchcancel", resetTouch);

    /* =========================================
       RESIZE AUTOMATICO
    ========================================= */

    let resizeTimer;

    const resizeObserver = new ResizeObserver(() => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            interacting = false;

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            createGrid();

        }, 150);

    });

    resizeObserver.observe(section);

    /* =========================================
       VISIBILITÀ E ANIMAZIONE DI ENTRATA
    ========================================= */

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                isVisible = entry.isIntersecting;

                if (isVisible) {

                    section.classList.add("is-visible");

                } else {

                    interacting = false;

                    blocks.forEach((block) => {

                        block.currentLift = 0;
                        block.targetLift = 0;

                        block.element.style.transform = "";

                        block.element.classList.remove("is-active");

                    });

                }

            });

        },
        {
            threshold: 0
        }
    );

    observer.observe(section);

    /* =========================================
       AVVIO
    ========================================= */

    createGrid();

});