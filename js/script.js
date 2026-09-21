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


                        /*
                         * VIDEO IN RIPRODUZIONE
                         */

                        if (
                            event.data ===
                            YT.PlayerState.PLAYING
                        ) {

                            heroVideoPlayer.classList.add(
                                "is-playing"
                            );

                        }


                        /*
                         * VIDEO IN PAUSA
                         */

                        if (
                            event.data ===
                            YT.PlayerState.PAUSED
                        ) {

                            heroVideoPlayer.classList.remove(
                                "is-playing"
                            );

                        }


                        /*
                         * VIDEO FINITO
                         */

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


    /*
     * QUANDO CLICCHI SULLA COPERTINA
     * IL VIDEO RIPARTE CON AUDIO
     */

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