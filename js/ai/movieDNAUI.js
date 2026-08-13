import { getMovieDNA } from "./movieDNA.js";
import { getUserMovieProfile } from "./userMovieProfile.js";


// =========================================================
// RENDER MOVIE DNA
// =========================================================

export async function renderMovieDNA(container) {

    if (!container) return;


    // -----------------------------------------------------
    // INITIAL LOADING STATE
    // -----------------------------------------------------

    container.innerHTML = `
        <div class="movie-dna-empty">

            <div class="dna-empty-icon">
                🧬
            </div>

            <h3>
                Analyzing your Movie DNA...
            </h3>

            <p>
                CineVerse is analyzing your movie
                preferences and discovering your
                cinematic personality.
            </p>

        </div>
    `;


    try {

        const profile =
            getUserMovieProfile();


        // -------------------------------------------------
        // SAFETY CHECK
        // -------------------------------------------------

        const favoriteMovies =
            Array.isArray(profile?.favoriteMovies)
                ? profile.favoriteMovies
                : [];

        const recentlySearched =
            Array.isArray(profile?.recentlySearched)
                ? profile.recentlySearched
                : [];


        // -------------------------------------------------
        // NOT ENOUGH DATA
        // -------------------------------------------------

        if (
            favoriteMovies.length === 0 &&
            recentlySearched.length === 0
        ) {

            container.innerHTML = `
                <div class="movie-dna-empty">

                    <div class="dna-empty-icon">
                        🧬
                    </div>

                    <h3>
                        Your Movie DNA is still forming
                    </h3>

                    <p>
                        Favorite some movies and search
                        for a few titles. CineVerse will
                        gradually learn your cinematic taste.
                    </p>

                    <div class="dna-empty-stats">

                        <span>
                            ⭐ Add favorites
                        </span>

                        <span>
                            🔎 Search movies
                        </span>

                        <span>
                            🎬 Explore titles
                        </span>

                    </div>

                </div>
            `;

            return;
        }


        // -------------------------------------------------
        // GET MOVIE DNA
        // -------------------------------------------------

        const dna =
            await getMovieDNA(profile);


        console.log(
            "Movie DNA received:",
            dna
        );


        // -------------------------------------------------
        // IMPORTANT:
        // HANDLE NULL / INVALID RESPONSE
        // -------------------------------------------------

        if (!dna || typeof dna !== "object") {

            console.warn(
                "Movie DNA returned null or invalid data:",
                dna
            );

            renderDNAUnavailable(container);

            return;
        }


        // -------------------------------------------------
        // HANDLE DIFFERENT RESPONSE SHAPES
        //
        // Supports:
        //
        // {
        //    genres: [...]
        // }
        //
        // OR
        //
        // {
        //    movieDNA: {
        //       genres: [...]
        //    }
        // }
        // -------------------------------------------------

        const normalizedDNA =
            dna.movieDNA &&
            typeof dna.movieDNA === "object"
                ? dna.movieDNA
                : dna;


        renderDNA(
            container,
            normalizedDNA
        );


    } catch (error) {

        console.error(
            "Movie DNA UI error:",
            error
        );


        renderDNAUnavailable(
            container
        );
    }
}


// =========================================================
// RENDER DNA
// =========================================================

function renderDNA(container, dna) {

    // -----------------------------------------------------
    // SAFETY CHECK
    // -----------------------------------------------------

    if (
        !dna ||
        typeof dna !== "object"
    ) {

        console.warn(
            "renderDNA received invalid DNA:",
            dna
        );

        renderDNAUnavailable(
            container
        );

        return;
    }


    // -----------------------------------------------------
    // SAFE DATA EXTRACTION
    // -----------------------------------------------------

    const genres =
        Array.isArray(dna.genres)
            ? dna.genres
            : [];


    const themes =
        Array.isArray(dna.themes)
            ? dna.themes
            : [];


    const preferences =
        Array.isArray(dna.preferences)
            ? dna.preferences
            : [];


    const avoidances =
        Array.isArray(dna.avoidances)
            ? dna.avoidances
            : [];


    const personality =
        dna.personality ||
        "The Cinematic Explorer";


    const summary =
        dna.summary ||
        "CineVerse is learning what makes your movie taste unique.";


    // -----------------------------------------------------
    // RENDER
    // -----------------------------------------------------

    container.innerHTML = `

        <div class="movie-dna-card">

            <!-- HEADER -->

            <div class="movie-dna-header">

                <div>

                    <span class="ai-label">
                        CINEVERSE AI
                    </span>

                    <h2>
                        Your Movie DNA
                    </h2>

                    <p>
                        ${escapeHTML(summary)}
                    </p>

                </div>


                <div class="dna-header-actions">

                    <div class="dna-icon">
                        🧬
                    </div>

                    <button
                        class="dna-refresh-btn"
                        id="refreshMovieDNA"
                        title="Refresh Movie DNA"
                        type="button"
                    >

                        <i class="fa-solid fa-rotate"></i>

                    </button>

                </div>

            </div>


            <!-- PERSONALITY -->

            <div class="dna-personality">

                <span>
                    Movie Personality
                </span>

                <strong>
                    ${escapeHTML(personality)}
                </strong>

            </div>


            <!-- GENRE DNA -->

            ${
                genres.length
                    ? `

                        <div class="dna-section">

                            <h3>
                                Genre DNA
                            </h3>

                            <div class="dna-genres">

                                ${
                                    genres
                                        .slice(0, 6)
                                        .map(genre => {

                                            const name =
                                                typeof genre === "string"
                                                    ? genre
                                                    : genre?.name || "Unknown";

                                            const score =
                                                typeof genre === "object"
                                                    ? Number(genre?.score) || 0
                                                    : 0;

                                            const safeScore =
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        100,
                                                        score
                                                    )
                                                );

                                            return `

                                                <div class="dna-genre">

                                                    <div class="dna-genre-header">

                                                        <span>
                                                            ${escapeHTML(name)}
                                                        </span>

                                                        <span>
                                                            ${Math.round(safeScore)}%
                                                        </span>

                                                    </div>


                                                    <div class="dna-bar">

                                                        <div
                                                            class="dna-bar-fill"
                                                            style="width: ${safeScore}%"
                                                        ></div>

                                                    </div>

                                                </div>

                                            `;

                                        })
                                        .join("")
                                }

                            </div>

                        </div>

                    `
                    : ""
            }


            <!-- THEMES -->

            ${
                themes.length
                    ? `

                        <div class="dna-section">

                            <h3>
                                Themes You Gravitate Toward
                            </h3>

                            <div class="dna-tags">

                                ${
                                    themes
                                        .slice(0, 8)
                                        .map(theme => `
                                            <span>
                                                ${escapeHTML(theme)}
                                            </span>
                                        `)
                                        .join("")
                                }

                            </div>

                        </div>

                    `
                    : ""
            }


            <!-- PREFERENCES -->

            ${
                preferences.length
                    ? `

                        <div class="dna-section">

                            <h3>
                                Your Preferences
                            </h3>

                            <ul class="dna-list">

                                ${
                                    preferences
                                        .slice(0, 5)
                                        .map(item => `
                                            <li>
                                                ${escapeHTML(item)}
                                            </li>
                                        `)
                                        .join("")
                                }

                            </ul>

                        </div>

                    `
                    : ""
            }


            <!-- AVOIDANCES -->

            ${
                avoidances.length
                    ? `

                        <div class="dna-section">

                            <h3>
                                You Usually Avoid
                            </h3>

                            <ul class="dna-list">

                                ${
                                    avoidances
                                        .slice(0, 5)
                                        .map(item => `
                                            <li>
                                                ${escapeHTML(item)}
                                            </li>
                                        `)
                                        .join("")
                                }

                            </ul>

                        </div>

                    `
                    : ""
            }

        </div>
    `;


    // =====================================================
    // REFRESH BUTTON
    //
    // IMPORTANT:
    // This MUST be attached AFTER innerHTML is created.
    // =====================================================

    const refreshButton =
        container.querySelector(
            "#refreshMovieDNA"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                // Prevent multiple clicks
                if (
                    refreshButton.classList.contains(
                        "is-loading"
                    )
                ) {
                    return;
                }


                // Clear cache

                localStorage.removeItem(
                    "cineverse_movie_dna"
                );

                localStorage.removeItem(
                    "cineverse_movie_dna_profile"
                );


                refreshButton.classList.add(
                    "is-loading"
                );


                refreshButton.disabled = true;


                try {

                    await renderMovieDNA(
                        container
                    );

                } finally {

                    refreshButton.classList.remove(
                        "is-loading"
                    );

                    refreshButton.disabled = false;

                }

            }
        );

    }
}


// =========================================================
// UNAVAILABLE STATE
// =========================================================

function renderDNAUnavailable(container) {

    container.innerHTML = `

        <div class="movie-dna-empty">

            <div class="dna-empty-icon">
                🧬
            </div>

            <h3>
                Your Movie DNA is temporarily unavailable
            </h3>

            <p>
                CineVerse couldn't generate your
                cinematic profile right now.
                Try refreshing the analysis.
            </p>

            <div class="dna-empty-stats">

                <span>
                    🎬 Keep exploring movies
                </span>

                <span>
                    ⭐ Add favorites
                </span>

                <span>
                    🔄 Try again
                </span>

            </div>

        </div>

    `;
}


// =========================================================
// HTML SAFETY
// =========================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}