/* =====================================
   CREATIONWEB - INTERACTIVE BLOCK FIELD
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("BLOCK FIELD CARICATO CORRETTAMENTE");

    const section = document.querySelector(".block-transition");
    const field = document.getElementById("block-field");

    if (!section || !field) return;

    const columns = 16;
    const rows = 8;
    const total = columns * rows;

    const blocks = [];

    /* CREAZIONE BLOCCHI */

    for (let i = 0; i < total; i++) {

        const block = document.createElement("div");

        block.classList.add("block-field__block");

        field.appendChild(block);

        blocks.push(block);
    }

    /* INTERAZIONE CON IL MOUSE */

    section.addEventListener("pointermove", (event) => {

        if (event.pointerType === "touch") return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        blocks.forEach((block) => {

            const rect = block.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = mouseX - centerX;
            const dy = mouseY - centerY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            const radius = 190;

            if (distance < radius) {

                const strength = 1 - distance / radius;

                const lift = strength * 75;

                block.style.transform =
                    `translateZ(${lift}px)`;

                block.classList.add("is-active");

            } else {

                block.style.transform = "";

                block.classList.remove("is-active");
            }

        });

    });

    /* RIPRISTINO QUANDO IL MOUSE ESCE */

    section.addEventListener("pointerleave", () => {

        blocks.forEach((block) => {

            block.style.transform = "";

            block.classList.remove("is-active");

        });

    });

    /* ANIMAZIONE DI ENTRATA */

    const observer = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    section.classList.add("is-visible");

                }

            });

        },
        {
            threshold: 0.2
        }
    );

    observer.observe(section);

});