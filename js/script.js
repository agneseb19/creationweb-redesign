/* =====================================
   MENU MOBILE
====================================== */

document.addEventListener("DOMContentLoaded", function () {

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mobileNav =
        document.getElementById("mobileNav");


    if (!mobileMenuButton || !mobileNav) {
        return;
    }


    mobileMenuButton.addEventListener("click", function () {

        const isOpen =
            mobileNav.classList.toggle("open");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    });


    const mobileNavLinks =
        mobileNav.querySelectorAll("a");


    mobileNavLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileNav.classList.remove("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

});

/* =====================================
   NAVBAR ACTIVE SECTION / SCROLL SPY
====================================== */

const navigationLinks =
    document.querySelectorAll(
        '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
    );


const navigationSections = [
    "home",
    "recensioni"
];


function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY + 220;

    let currentSection =
        "home";


    navigationSections.forEach(function (sectionId) {

        const section =
            document.getElementById(sectionId);


        if (
            section &&
            section.offsetTop <= scrollPosition
        ) {

            currentSection =
                sectionId;

        }

    });


    navigationLinks.forEach(function (link) {

        const target =
            link.getAttribute("href");


        link.classList.toggle(
            "active",
            target === "#" + currentSection
        );

    });

}


updateActiveNavigation();


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

/* =====================================
   HERO VIDEO - FILE MP4 LOCALE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const heroVideoPlayer =
        document.getElementById("heroVideoPlayer");

    const heroVideoCover =
        document.getElementById("heroVideoCover");

    const heroVideo =
        document.getElementById("heroVideoEmbed");

    if (!heroVideoPlayer || !heroVideoCover || !heroVideo) {
        return;
    }

    // Avvia il video quando viene premuto Play
    heroVideoCover.addEventListener("click", async function () {

        heroVideoPlayer.classList.add("is-playing");

        try {
            await heroVideo.play();
        } catch (error) {
            heroVideoPlayer.classList.remove("is-playing");
            console.error("Errore riproduzione video:", error);
        }

    });

    // Ripristina la copertina quando il video termina
    heroVideo.addEventListener("ended", function () {

        heroVideo.currentTime = 0;

        heroVideoPlayer.classList.remove("is-playing");

    });

});


/* =====================================
   LUCIDE ICONS
====================================== */

if (window.lucide) {
    lucide.createIcons();
}

/* =========================================================
   MODAL CONTATTI - WHATSAPP / EMAIL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           TROVA AUTOMATICAMENTE TUTTI I VECCHI
           PULSANTI "PRENOTA UNA CALL"
        */

        const contactTriggers =
            document.querySelectorAll(
                'a[href*="calendly.com/creationwebmail/consulenza"]'
            );


        if (!contactTriggers.length) {
            return;
        }


        /* =====================================
           CREA IL MODAL
        ====================================== */

        const contactModal =
            document.createElement("div");


        contactModal.className =
            "contact-choice-modal";


        contactModal.id =
            "contactChoiceModal";


        contactModal.setAttribute(
            "aria-hidden",
            "true"
        );


        contactModal.innerHTML = `

            <div
                class="contact-choice-backdrop"
                data-contact-close
            ></div>


            <section
                class="contact-choice-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="contactChoiceTitle"
            >

                <button
                    class="contact-choice-close"
                    type="button"
                    aria-label="Chiudi"
                    data-contact-close
                >
                    ×
                </button>


                <span class="contact-choice-kicker">
                    CONTATTI
                </span>


                <h2 id="contactChoiceTitle">
                    Come vuoi contattarci?
                </h2>


                <p class="contact-choice-intro">
                    Scegli il canale che preferisci.
                </p>


                <div class="contact-choice-options">


                    <!-- WHATSAPP -->

                    <a
                        class="
                            contact-choice-option
                            contact-choice-option-whatsapp
                        "
                        href="https://wa.me/393518961093"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <span class="contact-choice-icon">

                            <i
                                data-lucide="message-circle"
                                aria-hidden="true"
                            ></i>

                        </span>


                        <span>

                            <strong>
                                WhatsApp
                            </strong>

                            <span class="contact-choice-detail">
                                +39 351 896 1093
                            </span>

                        </span>

                    </a>



                    <!-- EMAIL -->

                    <a
                        class="
                            contact-choice-option
                            contact-choice-option-mail
                        "
                        href="mailto:creationwebmail@gmail.com?subject=Richiesta%20informazioni&body=Ciao%20CreationWeb%2C%20vorrei%20ricevere%20maggiori%20informazioni%20sui%20vostri%20servizi."
                    >

                        <span class="contact-choice-icon">

                            <i
                                data-lucide="mail"
                                aria-hidden="true"
                            ></i>

                        </span>


                        <span>

                            <strong>
                                Email
                            </strong>

                            <span class="contact-choice-detail">
                                creationwebmail@gmail.com
                            </span>

                        </span>

                    </a>


                </div>

            </section>

        `;


        document.body.appendChild(
            contactModal
        );


        /* RICREA LE ICONE LUCIDE */

        if (window.lucide) {

            lucide.createIcons();

        }


        /* =====================================
           APERTURA
        ====================================== */

        function openContactModal() {

            contactModal.classList.add(
                "is-open"
            );


            contactModal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "contact-choice-open"
            );


            const closeButton =
                contactModal.querySelector(
                    ".contact-choice-close"
                );


            if (closeButton) {

                closeButton.focus();

            }

        }


        /* =====================================
           CHIUSURA
        ====================================== */

        function closeContactModal() {

            contactModal.classList.remove(
                "is-open"
            );


            contactModal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "contact-choice-open"
            );

        }


        /* =====================================
           TRASFORMA TUTTI I CTA
        ====================================== */

        contactTriggers.forEach(
            function (button) {

                button.removeAttribute(
                    "target"
                );


                button.removeAttribute(
                    "rel"
                );


                button.setAttribute(
                    "href",
                    "#"
                );


                button.innerHTML = `

                    Contattaci

                    <span aria-hidden="true">
                        →
                    </span>

                `;


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        openContactModal();

                    }
                );

            }
        );


        /* =====================================
           CLICK PER CHIUDERE
        ====================================== */

        const closeElements =
            contactModal.querySelectorAll(
                "[data-contact-close]"
            );


        closeElements.forEach(
            function (element) {

                element.addEventListener(
                    "click",
                    closeContactModal
                );

            }
        );


        /* =====================================
           TASTO ESC
        ====================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    contactModal.classList.contains(
                        "is-open"
                    )
                ) {

                    closeContactModal();

                }

            }
        );

    }
);