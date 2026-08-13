// ========================================
// NAVBAR
// ========================================

export default function initNavbar() {

    console.log("NAVBAR FUNCTION STARTED");

    // ========================================
    // ELEMENTS
    // ========================================

    const menuBtn = document.getElementById("menuBtn");
    const navContainer = document.getElementById("navLinks");

    console.log("menuBtn:", menuBtn);
    console.log("navContainer:", navContainer);

    if (!menuBtn || !navContainer) {
        console.error("NAVBAR ELEMENTS NOT FOUND");
        return;
    }


    // ========================================
    // MOBILE MENU
    // ========================================

    menuBtn.addEventListener("click", () => {

        console.log("MENU CLICKED");

        navContainer.classList.toggle("active");

        console.log(
            "Menu Active:",
            navContainer.classList.contains("active")
        );

    });


    // ========================================
    // NAVIGATION LINKS
    // ========================================

    const navLinks = navContainer.querySelectorAll(".nav-link");

    console.log("NAV LINKS:", navLinks);


    // ========================================
    // CLOSE MOBILE MENU AFTER CLICK
    // ========================================

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navContainer.classList.remove("active");

        });

    });


    // ========================================
    // SECTIONS
    // ========================================

    const sections = document.querySelectorAll(
    "#hero-container, " +
    "#trending-movies, " +
    "#popular-movies, " +
    "#bollywood-movies, " +
    "#recently-released, " +
    "#movie-dna-section, " +
    "#ai-recommendations-section, " +
    "#mood-movie-section, " +
    "#faq"
    );

    console.log("SECTIONS:", sections);


    if (!sections.length) {
        console.warn("NO NAVIGATION SECTIONS FOUND");
        return;
    }

    // ========================================
// GET NAVIGATION LINK
// ========================================

function getNavLink(sectionId) {

    // AI sections belong to AI Match
    if (
        sectionId === "ai-recommendations-section" ||
        sectionId === "mood-movie-section"
    ) {
        return navContainer.querySelector(
            '.nav-link[href="#ai-recommendations-section"]'
        );
    }

    // Movie DNA
    if (sectionId === "movie-dna-section") {
        return navContainer.querySelector(
            '.nav-link[href="#movie-dna-section"]'
        );
    }

    // Discover sections
    if (
        sectionId === "trending-movies" ||
        sectionId === "popular-movies" ||
        sectionId === "bollywood-movies" ||
        sectionId === "recently-released"
    ) {
        return navContainer.querySelector(
            '.nav-link[href="#trending-movies"]'
        );
    }

    // Normal sections
    return navContainer.querySelector(
        `.nav-link[href="#${sectionId}"]`
    );
    }

    // ========================================
    // ACTIVE NAVIGATION
    // ========================================

    let isNavigating = false;

    // ========================================
    // SET ACTIVE LINK
    // ========================================

    function setActiveLink(link) {

        navLinks.forEach((navLink) => {
            navLink.classList.remove("active");
        });

        if (link) {

            link.classList.add("active");

            console.log(
                "ACTIVE LINK:",
                link.textContent.trim()
            );
        }
    }

    // ========================================
    // NAVIGATION LINK CLICK
    // ========================================

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {

            // Prevent IntersectionObserver
            // from changing active link during
            // smooth scrolling
            isNavigating = true;

            // Immediately activate clicked link
            setActiveLink(link);

            // Close mobile menu
            navContainer.classList.remove("active");

        });

    });


    // ========================================
    // INTERSECTION OBSERVER
    // ========================================

    const observer = new IntersectionObserver(
        (entries) => {

            // Ignore observer while smooth
            // navigation is happening
            if (isNavigating) {
                return;
            }


            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId = entry.target.id;

                console.log(
                    "VISIBLE SECTION:",
                    sectionId
                );


                // Get mapped navbar link
                const activeLink = getNavLink(sectionId);


                // Activate mapped link
                if (activeLink) {
                    setActiveLink(activeLink);
                }

            });

        },
        {
            threshold: 0.2,
            rootMargin: "-90px 0px -50% 0px"
        }
    );

    // ========================================
    // ========================================
    // DETECT END OF SMOOTH SCROLL
    // ========================================

    window.addEventListener("scrollend", () => {

        isNavigating = false;

        console.log("NAVIGATION SCROLL FINISHED");

    });

    // ========================================
    // OBSERVE SECTIONS
    // ========================================

    sections.forEach((section) => {

        observer.observe(section);

        console.log(
            "OBSERVING:",
            section.id
        );

    });

}