// ========================================
// MOVIE MODAL
// ========================================

import { API_KEY, BASE_URL, IMAGE_BASE_URL } from "../config.js";

import { getMovieTrailer } from "./trailer.js";

import { explainMovie } from "../ai/movieExplainer.js";

import {
    getMovieCast,
    getMovieProviders,
    getSimilarMovies,
    getMovieDetails
} from "../movieAPI.js";

import {
    isFavorite,
    toggleFavorite
} from "./favorites.js";

import {
    isLoggedIn,
    openAuthModal
} from "./auth.js";

// ========================================
// MODAL ELEMENTS
// ========================================

const modal = document.getElementById("movieModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");


// ========================================
// OPEN MODAL LOADING STATE
// ========================================

export function openMovieModalLoading(movieId) {

    modalContent.innerHTML = `

        <div class="modal-loading-state">

            <div class="modal-loading-spinner"></div>

            <h2>Loading movie details...</h2>

            <p>Please wait</p>

        </div>

    `;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


// ========================================
// OPEN MODAL
// ========================================

export function openMovieModal(movie) {



    // ========================================
    // MODAL CONTENT
    // ========================================

    modalContent.innerHTML = `

        <!-- ========================================
             BACKDROP
        ======================================== -->

        <div class="modal-backdrop">

            <img
                src="https://image.tmdb.org/t/p/original${movie.backdrop_path}"
                alt="${movie.title}"
            >

            <div class="modal-backdrop-gradient"></div>

        </div>


        <!-- ========================================
             MOVIE INFORMATION
        ======================================== -->

        <div class="modal-movie-info">

            <!-- Poster -->

            <div class="modal-poster">

                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}"
                >

            </div>


            <!-- Details -->

            <div class="modal-details">

                <h2 class="modal-title">
                    ${movie.title}
                </h2>


                <!-- Meta -->

                <div class="modal-meta">

                    <span class="rating">

                        <i class="fa-solid fa-star"></i>

                        ${
                            movie.vote_average
                                ? movie.vote_average.toFixed(1)
                                : "N/A"
                        }

                    </span>


                    <span>
                        ${
                            movie.release_date
                                ? movie.release_date.substring(0, 4)
                                : "N/A"
                        }
                    </span>


                    <span>
                        ${
                            movie.runtime
                                ? `${movie.runtime} min`
                                : ""
                        }
                    </span>

                </div>


                <!-- Genres -->

                <div class="modal-genres">

                    ${(movie.genres || [])
                        .map(genre => `
                            <span>
                                ${genre.name}
                            </span>
                        `)
                        .join("")}

                </div>


                <!-- Overview -->

                <p class="modal-overview">

                    ${
                        movie.overview ||
                        "No overview available."
                    }

                </p>


                <!-- Actions -->

                <div class="modal-actions">

                    <button
                        class="btn-primary"
                        id="trailerBtn"
                    >

                        <i class="fa-solid fa-play"></i>

                        Watch Trailer

                    </button>


                    <button
                        class="btn-secondary favorite-btn"
                        id="favoriteMovieBtn"
                        data-movie-id="${movie.id}"
                    >

                        <i class="${isFavorite(movie.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>

                        ${isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}

                    </button>

                </div>


                <!-- Trailer -->

                <div
                    class="trailer-container"
                    id="trailerContainer"
                ></div>

            </div>

        </div>


        <!-- ========================================
             EXTRA INFORMATION
        ======================================== -->

        <div class="modal-extra">

        <!-- ========================================
         CINEVERSE AI
    ======================================== -->

    <section class="modal-section ai-movie-section">

        <div class="modal-section-header">

            <div>
                <span class="ai-label">
                    CINEVERSE AI
                </span>

                <h3>
                    Why You Should Watch This
                </h3>
            </div>

        </div>

        <div
            class="ai-movie-container"
            id="aiMovieContainer"
        >
            <div class="ai-loading">
                <div class="ai-loading-spinner"></div>

                <p>
                    CineVerse AI is analyzing this movie...
                </p>
            </div>
        </div>

    </section>

            <!-- CAST -->

            <section class="modal-section">

                <div class="modal-section-header">

                    <h3>Cast</h3>

                    <button class="section-link">
                        View All
                    </button>

                </div>


                <div
                    class="cast-container"
                    id="castContainer"
                >

                    <div class="modal-loading">
                        Loading cast...
                    </div>

                </div>

            </section>


            <!-- WHERE TO WATCH -->

            <section class="modal-section">

                <h3>
                    Where to Watch
                </h3>


                <div
                    class="providers-container"
                    id="providersContainer"
                >

                    <div class="modal-loading">
                        Loading platforms...
                    </div>

                </div>

            </section>


            <!-- SIMILAR MOVIES -->

            <section class="modal-section">

                <h3>
                    Similar Movies
                </h3>


                <div
                    class="similar-movies-container"
                    id="similarMoviesContainer"
                >

                    <div class="modal-loading">
                        Loading similar movies...
                    </div>

                </div>

            </section>

        </div>

    `;


    // ========================================
    // SHOW MODAL
    // ========================================

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    renderCineVerseAI(movie.cineVerseAI);

    // Start AI explanation
    loadCineVerseAI(movie);

    // ========================================
    // LOAD MODAL DATA
    // ========================================

    loadMovieCast(movie.id);
    loadMovieProviders(movie.id, movie.title);
    loadSimilarMovies(movie.id);


    // ========================================
    // TRAILER BUTTON
    // ========================================

    const trailerBtn =
        document.getElementById("trailerBtn");

    const trailerContainer =
        document.getElementById("trailerContainer");


    trailerBtn.addEventListener("click", async () => {

        console.log(
            "WATCH TRAILER CLICKED:",
            movie.id
        );


        trailerContainer.innerHTML = `

            <p class="trailer-loading">
                Loading trailer...
            </p>

        `;


        const trailerKey =
            await getMovieTrailer(movie.id);


        console.log(
            "TRAILER KEY:",
            trailerKey
        );


        // No trailer

        if (!trailerKey) {

            trailerContainer.innerHTML = `

                <p class="trailer-error">
                    Trailer not available.
                </p>

            `;

            return;
        }


        // Trailer found

        trailerContainer.innerHTML = `

            <div class="trailer-wrapper">

                <iframe

                    src="https://www.youtube.com/embed/${trailerKey}"

                    title="${movie.title} Trailer"

                    allow="
                        accelerometer;
                        autoplay;
                        clipboard-write;
                        encrypted-media;
                        gyroscope;
                        picture-in-picture
                    "

                    allowfullscreen>

                </iframe>

            </div>

        `;

    });

    // ========================================
// FAVORITE BUTTON
// ========================================

const favoriteBtn =
    document.getElementById("favoriteMovieBtn");


if (favoriteBtn) {

    favoriteBtn.addEventListener(
        "click",
        () => {


            // User is not logged in
        if (!isLoggedIn()) {

            closeModal();

            openAuthModal();

            return;
        }

            const added =
                toggleFavorite(movie);


            if (added) {

                favoriteBtn.innerHTML = `
                    <i class="fa-solid fa-heart"></i>
                    Remove from Favorites
                `;

                console.log(
                    "Added to favorites:",
                    movie.title
                );

            } else {

                favoriteBtn.innerHTML = `
                    <i class="fa-regular fa-heart"></i>
                    Add to Favorites
                `;

                console.log(
                    "Removed from favorites:",
                    movie.title
                );

            }

        }
    );

}



}


async function loadCineVerseAI(movie) {
    const container = document.getElementById("aiMovieContainer");

    if (!container) return;

    // Show loading state
    container.innerHTML = `
    <div class="ai-loading">

        <div class="ai-loading-icon">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>

        <div class="ai-loading-spinner"></div>

        <div class="ai-loading-content">
            <h4>CineVerse AI</h4>
            <p>Analyzing this movie...</p>
        </div>

    </div>
    `;

    try {
        const aiData = await explainMovie(movie);

        renderCineVerseAI(aiData);

    } catch (error) {
        console.error("CineVerse AI error:", error);

        container.innerHTML = `
            <div class="ai-error">
                <p>
                    CineVerse AI could not analyze this movie.
                </p>
            </div>
        `;
    }
}


// ========================================
// RENDER CINEVERSE AI
// ========================================

export function renderCineVerseAI(aiData) {

    const container =
        document.getElementById("aiMovieContainer");

    if (!container) return;


    // AI unavailable
   if (!aiData) {
        return;
    }


    const matchScore =
        Math.max(
            0,
            Math.min(
                100,
                Number(aiData.matchScore) || 0
            )
        );


    const reasons =
        Array.isArray(aiData.reasons)
            ? aiData.reasons
            : [];


    const bestFor =
        Array.isArray(aiData.bestFor)
            ? aiData.bestFor
            : [];


    container.innerHTML = `

        <div class="ai-match-card">

            <!-- MATCH SCORE -->

            <div class="ai-match-header">

                <div class="ai-score">

                    <span class="ai-score-number">
                        ${matchScore}%
                    </span>

                    <span class="ai-score-label">
                        CineVerse Match
                    </span>

                </div>


                <div class="ai-headline">

                    <h4>
                        ${aiData.headline || "A movie worth exploring"}
                    </h4>

                </div>

            </div>


            <!-- WHY WATCH -->

            ${
                reasons.length
                    ? `
                        <div class="ai-reasons">

                            <h4>
                                Why you might like it
                            </h4>

                            <ul>

                                ${reasons
                                    .slice(0, 4)
                                    .map(reason => `
                                        <li>
                                            <i class="fa-solid fa-check"></i>
                                            <span>${reason}</span>
                                        </li>
                                    `)
                                    .join("")}

                            </ul>

                        </div>
                    `
                    : ""
            }


            <!-- BEST FOR -->

            ${
                bestFor.length
                    ? `
                        <div class="ai-best-for">

                            <h4>
                                Best for
                            </h4>

                            <div class="ai-tags">

                                ${bestFor
                                    .slice(0, 3)
                                    .map(item => `
                                        <span class="ai-tag">
                                            ${item}
                                        </span>
                                    `)
                                    .join("")}

                            </div>

                        </div>
                    `
                    : ""
            }


            <!-- WARNING -->

            ${
                aiData.warning
                    ? `
                        <div class="ai-warning">

                            <i class="fa-solid fa-circle-info"></i>

                            <span>
                                ${aiData.warning}
                            </span>

                        </div>
                    `
                    : ""
            }

        </div>
    `;
}

// ========================================
// CLOSE MODAL
// ========================================

export function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

    modalContent.innerHTML = "";

}


// ========================================
// CLOSE BUTTON
// ========================================

modalClose.addEventListener(
    "click",
    closeModal
);


// ========================================
// OVERLAY
// ========================================

modalOverlay.addEventListener(
    "click",
    closeModal
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);

// ========================================
// LOAD CAST
// ========================================

async function loadMovieCast(movieId) {

    const container =
        document.getElementById("castContainer");

    if (!container) return;


    const cast =
        await getMovieCast(movieId);


    if (!cast.length) {

        container.innerHTML = `
            <p class="modal-empty">
                Cast information not available.
            </p>
        `;

        return;

    }


    // Show first 10 actors

    const topCast =
        cast.slice(0, 10);


    container.innerHTML = topCast.map(actor => {

        const profileImage =
            actor.profile_path
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : "./assets/images/person-placeholder.jpg";


        return `

            <div class="cast-card">

                <div class="cast-image">

                    <img
                        src="${profileImage}"
                        alt="${actor.name}"
                        loading="lazy"
                    >

                </div>


                <div class="cast-info">

                    <h4>
                        ${actor.name}
                    </h4>

                    <p>
                        ${actor.character || "Unknown"}
                    </p>

                </div>

            </div>

        `;

    }).join("");

}

// ========================================
// LOAD WATCH PROVIDERS
// ========================================

const providerSearchLinks = {

    "Netflix": (title) =>
        `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,

    "Prime Video": (title) =>
        `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}`,

    "Amazon Prime Video": (title) =>
        `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}`,

    "JioHotstar": (title) =>
        `https://www.hotstar.com/in/search?q=${encodeURIComponent(title)}`,

    "ZEE5": (title) =>
        `https://www.zee5.com/search?q=${encodeURIComponent(title)}`,

    "YouTube": (title) =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`
};


async function loadMovieProviders(movieId, movieTitle) {

    const container =
        document.getElementById("providersContainer");

    if (!container) return;


    const providers =
        await getMovieProviders(movieId);


    if (!providers) {

        container.innerHTML = `
            <p class="modal-empty">
                Streaming information not available in India.
            </p>
        `;

        return;
    }


    let html = "";


// ========================================
// PROVIDER CARD
// ========================================

// ========================================
// PROVIDER CARD
// ========================================

function createProviderCard(provider) {

    const searchFunction =
        providerSearchLinks[provider.provider_name];


    // ========================================
    // PROVIDER NOT SUPPORTED
    // ========================================

    if (!searchFunction) {

        return `
            <div
                class="provider-card provider-unavailable"
                title="${provider.provider_name}"
            >

                <img
                    src="https://image.tmdb.org/t/p/original${provider.logo_path}"
                    alt="${provider.provider_name}"
                    loading="lazy"
                >

                <span>
                    ${provider.provider_name}
                </span>

            </div>
        `;
    }


    // ========================================
    // CREATE MOVIE SEARCH URL
    // ========================================

    const providerUrl =
        searchFunction(movieTitle);


    // ========================================
    // CLICKABLE PROVIDER
    // ========================================

    return `
        <a
            class="provider-card"
            href="${providerUrl}"
            target="_blank"
            rel="noopener noreferrer"
            title="Watch ${movieTitle} on ${provider.provider_name}"
        >

            <img
                src="https://image.tmdb.org/t/p/original${provider.logo_path}"
                alt="${provider.provider_name}"
                loading="lazy"
            >

            <span>
                ${provider.provider_name}
            </span>

            <i class="fa-solid fa-arrow-up-right-from-square"></i>

        </a>
    `;
}


    // ========================================
    // STREAM
    // ========================================

    if (
        providers.flatrate &&
        providers.flatrate.length
    ) {

        html += `
            <div class="provider-group">

                <h4>
                    Stream
                </h4>

                <div class="provider-list">

                    ${providers.flatrate
                        .map(provider =>
                            createProviderCard(
                                provider,
                                providers.link
                            )
                        )
                        .join("")}

                </div>

            </div>
        `;
    }


    // ========================================
    // RENT
    // ========================================

    if (
        providers.rent &&
        providers.rent.length
    ) {

        html += `
            <div class="provider-group">

                <h4>
                    Rent
                </h4>

                <div class="provider-list">

                    ${providers.rent
                        .map(provider =>
                            createProviderCard(
                                provider,
                                providers.link
                            )
                        )
                        .join("")}

                </div>

            </div>
        `;
    }


    // ========================================
    // BUY
    // ========================================

    if (
        providers.buy &&
        providers.buy.length
    ) {

        html += `
            <div class="provider-group">

                <h4>
                    Buy
                </h4>

                <div class="provider-list">

                    ${providers.buy
                        .map(provider =>
                            createProviderCard(
                                provider,
                                providers.link
                            )
                        )
                        .join("")}

                </div>

            </div>
        `;
    }


    // ========================================
    // NO PROVIDERS
    // ========================================

    if (!html) {

        container.innerHTML = `
            <p class="modal-empty">
                No streaming platforms found in India.
            </p>
        `;

        return;
    }


    // ========================================
    // RENDER
    // ========================================

    container.innerHTML = html;
}

// ========================================
// LOAD SIMILAR MOVIES
// ========================================

async function loadSimilarMovies(movieId) {

    const container =
        document.getElementById(
            "similarMoviesContainer"
        );

    if (!container) return;


    const movies =
        await getSimilarMovies(movieId);


    if (!movies.length) {

        container.innerHTML = `
            <p class="modal-empty">
                No similar movies found.
            </p>
        `;

        return;

    }


    // First 8 movies

    const similarMovies =
        movies
            .filter(movie => movie.poster_path)
            .slice(0, 8);


    container.innerHTML =
        similarMovies.map(movie => {

            const poster =
                `https://image.tmdb.org/t/p/w342${movie.poster_path}`;


            return `

                <div
                    class="similar-movie-card"
                    data-movie-id="${movie.id}"
                >

                    <div class="similar-movie-poster">

                        <img
                            src="${poster}"
                            alt="${movie.title}"
                            loading="lazy"
                        >

                    </div>


                    <div class="similar-movie-info">

                        <h4>
                            ${movie.title}
                        </h4>

                        <div class="similar-movie-meta">

                            <span>
                                <i class="fa-solid fa-star"></i>

                                ${
                                    movie.vote_average
                                        ? movie.vote_average.toFixed(1)
                                        : "N/A"
                                }

                            </span>

                            <span>
                                ${
                                    movie.release_date
                                        ? movie.release_date.substring(0, 4)
                                        : "N/A"
                                }
                            </span>

                        </div>

                    </div>

                </div>

            `;

        }).join("");


    // ========================================
    // SIMILAR MOVIE CLICK
    // ========================================

    document
        .querySelectorAll(".similar-movie-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                async () => {

                    const movieId =
                        card.dataset.movieId;

                    await openSimilarMovie(
                        movieId
                    );

                }
            );

        });

}

// ========================================
// OPEN SIMILAR MOVIE
// ========================================

async function openSimilarMovie(movieId) {

    const movie =
        await getMovieDetails(movieId);


    if (!movie) {

        console.error(
            "Could not load movie:",
            movieId
        );

        return;

    }


    openMovieModal(movie);

}