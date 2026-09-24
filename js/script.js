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
    "caso-studio",
    "metodo",
    "chi-siamo",
    "faq"
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
   HERO VIDEO - AUTOPLAY + COVER
====================================== */

let heroYoutubePlayer = null;


window.onYouTubeIframeAPIReady = function () {

    const heroVideoPlayer =
        document.getElementById("heroVideoPlayer");

    const heroVideoCover =
        document.getElementById("heroVideoCover");


    if (
        !heroVideoPlayer ||
        !heroVideoCover
    ) {
        return;
    }


    heroYoutubePlayer =
        new YT.Player(
            "heroVideoEmbed",
            {

                videoId:
                    "PHkVk3PZrvw",

                playerVars: {

                    autoplay: 1,

                    playsinline: 1,

                    rel: 0,

                    controls: 1

                },


                events: {

                    onReady: function (event) {

                        event.target.mute();

                        heroVideoPlayer.classList.add(
                            "is-playing"
                        );

                        event.target.playVideo();

                    },


                    onStateChange: function (event) {


                        if (
                            event.data ===
                            YT.PlayerState.PLAYING
                        ) {

                            heroVideoPlayer.classList.add(
                                "is-playing"
                            );

                        }


                        if (
                            event.data ===
                            YT.PlayerState.PAUSED
                        ) {

                            heroVideoPlayer.classList.remove(
                                "is-playing"
                            );

                        }


                        if (
                            event.data ===
                            YT.PlayerState.ENDED
                        ) {

                            heroVideoPlayer.classList.remove(
                                "is-playing"
                            );

                        }

                    }

                }

            }
        );


    heroVideoCover.addEventListener(
        "click",
        function () {

            if (!heroYoutubePlayer) {
                return;
            }

            heroYoutubePlayer.unMute();

            heroYoutubePlayer.setVolume(100);

            heroYoutubePlayer.playVideo();

            heroVideoPlayer.classList.add(
                "is-playing"
            );

        }
    );

};


/* =====================================
   ATTIVA AUDIO AL PRIMO TAP
====================================== */

function enableHeroVideoSound() {

    if (!heroYoutubePlayer) {
        return;
    }

    heroYoutubePlayer.unMute();

    heroYoutubePlayer.setVolume(100);


    document.removeEventListener(
        "click",
        enableHeroVideoSound
    );

    document.removeEventListener(
        "touchstart",
        enableHeroVideoSound
    );

}


document.addEventListener(
    "click",
    enableHeroVideoSound
);


document.addEventListener(
    "touchstart",
    enableHeroVideoSound,
    {
        passive: true
    }
);

/* =====================================
   PRIVACY CONTROLS
====================================== */

const privacyFloatingButton =
    document.getElementById("privacyFloatingButton");

const privacyPreferencesTrigger =
    document.getElementById("privacyPreferencesTrigger");

const privacyModal =
    document.getElementById("privacyModal");

const privacyModalOverlay =
    document.getElementById("privacyModalOverlay");

const privacyModalClose =
    document.getElementById("privacyModalClose");

const privacyAcceptAll =
    document.getElementById("privacyAcceptAll");

const privacyRejectAll =
    document.getElementById("privacyRejectAll");

const privacySavePreferences =
    document.getElementById("privacySavePreferences");

const privacyAnalytics =
    document.getElementById("privacyAnalytics");

const privacyMarketing =
    document.getElementById("privacyMarketing");

const privacyChoiceStatus =
    document.getElementById("privacyChoiceStatus");



function openPrivacyModal() {

    privacyModal.classList.add("is-visible");

    privacyModalOverlay.classList.add("is-visible");

    privacyModal.setAttribute(
        "aria-hidden",
        "false"
    );

    privacyModalOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}



function closePrivacyModal() {

    privacyModal.classList.remove("is-visible");

    privacyModalOverlay.classList.remove("is-visible");

    privacyModal.setAttribute(
        "aria-hidden",
        "true"
    );

    privacyModalOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}



function savePrivacyChoice(choice) {

    const privacyPreferences = {

        choice:
            choice,

        analytics:
            privacyAnalytics.checked,

        marketing:
            privacyMarketing.checked

    };


    localStorage.setItem(
        "creationwebPrivacyPreferences",
        JSON.stringify(privacyPreferences)
    );


    updatePrivacyStatus();

    closePrivacyModal();
}



function updatePrivacyStatus() {

    const savedPreferences =
        localStorage.getItem(
            "creationwebPrivacyPreferences"
        );


    if (!savedPreferences) {

        privacyChoiceStatus.classList.remove(
            "has-choice"
        );

        return;
    }


    privacyChoiceStatus.classList.add(
        "has-choice"
    );
}



function loadPrivacyPreferences() {

    const savedPreferences =
        localStorage.getItem(
            "creationwebPrivacyPreferences"
        );


    if (!savedPreferences) {
        return;
    }


    const preferences =
        JSON.parse(savedPreferences);


    privacyAnalytics.checked =
        Boolean(preferences.analytics);


    privacyMarketing.checked =
        Boolean(preferences.marketing);


    updatePrivacyStatus();
}



privacyFloatingButton.addEventListener(
    "click",
    openPrivacyModal
);


privacyPreferencesTrigger.addEventListener(
    "click",
    openPrivacyModal
);


privacyModalClose.addEventListener(
    "click",
    closePrivacyModal
);


privacyModalOverlay.addEventListener(
    "click",
    closePrivacyModal
);



privacyAcceptAll.addEventListener(
    "click",
    function () {

        privacyAnalytics.checked =
            true;

        privacyMarketing.checked =
            true;

        savePrivacyChoice(
            "accepted"
        );

    }
);



privacyRejectAll.addEventListener(
    "click",
    function () {

        privacyAnalytics.checked =
            false;

        privacyMarketing.checked =
            false;

        savePrivacyChoice(
            "rejected"
        );

    }
);



privacySavePreferences.addEventListener(
    "click",
    function () {

        savePrivacyChoice(
            "custom"
        );

    }
);



document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            privacyModal.classList.contains(
                "is-visible"
            )
        ) {

            closePrivacyModal();

        }

    }
);



loadPrivacyPreferences();

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