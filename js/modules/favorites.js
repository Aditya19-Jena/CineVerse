// ========================================
// FAVORITES MODULE
// ========================================


const FAVORITES_KEY = "cineverse_favorites";

// ========================================
// GET FAVORITES
// ========================================

export function getFavorites() {

    try {

        const favorites = localStorage.getItem(FAVORITES_KEY);

        return favorites ? JSON.parse(favorites) : [];

    } catch (error) {

        console.error("Failed to load favorites:", error);

        return [];

    }

}

// ========================================
// SAVE FAVORITES
// ========================================

function saveFavorites(favorites) {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}


// ========================================
// CHECK FAVORITE
// ========================================

export function isFavorite(movieId) {

    const favorites = getFavorites();

    return favorites.some(
        movie => String(movie.id) === String(movieId)
    );

}


// ========================================
// ADD FAVORITE
// ========================================

export function addFavorite(movie) {

    const favorites = getFavorites();


    if (
        favorites.some(
            item => String(item.id) === String(movie.id)
        )
    ) {

        return false;

    }


    favorites.push({

        id: movie.id,

        title: movie.title,

        poster_path: movie.poster_path,

        backdrop_path: movie.backdrop_path,

        release_date: movie.release_date,

        vote_average: movie.vote_average

    });


    saveFavorites(favorites);

    return true;

}


// ========================================
// REMOVE FAVORITE
// ========================================

export function removeFavorite(movieId) {

    const favorites =
        getFavorites();


    const updatedFavorites =
        favorites.filter(
            movie =>
                String(movie.id) !==
                String(movieId)
        );


    saveFavorites(updatedFavorites);

}


// ========================================
// TOGGLE FAVORITE
// ========================================

export function toggleFavorite(movie) {

    if (isFavorite(movie.id)) {

        removeFavorite(movie.id);

        return false;

    }


    addFavorite(movie);

    return true;

}


// ========================================
// FAVORITE COUNT
// ========================================

export function getFavoriteCount() {

    return getFavorites().length;

}

// ========================================
// CLEAR ALL FAVORITES
// ========================================

export function clearFavorites() {

    localStorage.removeItem(FAVORITES_KEY);

}

// ========================================
// INITIALIZE FAVORITES UI
// ========================================

export default function initFavorites({ openMovie }) {

    console.log("FAVORITES MODULE STARTED");

    const favoriteBtn = document.getElementById("favoriteBtn") || document.querySelector(".favourite-btn");

    const favoriteOverlay = document.getElementById("favoriteOverlay");

    const favoriteClose = document.getElementById("favoriteClose");

    const favoriteResults = document.getElementById("favoriteResults");

    const favoriteCount = document.getElementById("favoriteCount");

    if (
        !favoriteBtn ||
        !favoriteOverlay ||
        !favoriteClose ||
        !favoriteResults
    ) {

        console.error("FAVORITES: Required elements not found!");

        return;

    }

    // ========================================
    // OPEN FAVORITES
    // ========================================

    function openFavorites() {

        renderFavorites();

        favoriteOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    // ========================================
    // CLOSE FAVORITES
    // ========================================

    function closeFavorites() {

        favoriteOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }

    // ========================================
    // RENDER FAVORITES
    // ========================================

    function renderFavorites() {

        const favorites = getFavorites();


        if (favoriteCount) {

            favoriteCount.textContent = favorites.length;

        }

        // ----------------------------------------
        // EMPTY STATE
        // ----------------------------------------

        if (!favorites.length) {

            favoriteResults.innerHTML = `

                <div class="favorites-empty">

                    <i class="fa-regular fa-heart"></i>

                    <h3> No Favorites Yet </h3>

                    <p> Movies you add to favorites will appear here. </p>

                </div>

            `;

            return;

        }

        // ----------------------------------------
        // MOVIE CARDS
        // ----------------------------------------

        favoriteResults.innerHTML =
            favorites.map(movie => {

                const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

                const year = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";

                return `

                    <article
                        class="favorite-card movie-card"
                        data-movie-id="${movie.id}"
                    >

                        <div class="favorite-poster">

                            ${
                                poster

                                ? `
                                    <img
                                        src="${poster}"
                                        alt="${movie.title}"
                                        loading="lazy"
                                    >
                                `

                                : `
                                    <div class="favorite-no-poster">
                                        <i class="fa-solid fa-film"></i>
                                    </div>
                                `
                            }

                            <button
                                class="favorite-remove"
                                data-remove-id="${movie.id}"
                                aria-label="Remove ${movie.title}"
                            >
                                <i class="fa-solid fa-heart"></i>
                            </button>

                        </div>


                        <div class="favorite-info">

                            <h3>
                                ${movie.title}
                            </h3>

                            <div class="favorite-meta">

                                <span>
                                    ${year}
                                </span>

                                <span>
                                    <i class="fa-solid fa-star"></i>
                                    ${
                                        movie.vote_average
                                            ? movie.vote_average.toFixed(1)
                                            : "N/A"
                                    }
                                </span>

                            </div>

                        </div>

                    </article>

                `;

            }).join("");

        }


        // ========================================
        // FAVORITE BUTTON
        // ========================================

        favoriteBtn.addEventListener("click", openFavorites);

        // ========================================
        // CLOSE BUTTON
        // ========================================

        favoriteClose.addEventListener("click", closeFavorites);

        // ========================================
        // OVERLAY CLICK
        // ========================================

        favoriteOverlay.addEventListener("click", event => {

                if (event.target === favoriteOverlay) {

                    closeFavorites();

                }

            }
        );


        // ========================================
        // FAVORITE CARD ACTIONS
        // ========================================

        favoriteResults.addEventListener("click", event => {

            // ========================================
            // REMOVE FAVORITE
            // ========================================

            const removeButton = event.target.closest(".favorite-remove");

            if (removeButton) {

                event.stopPropagation();

                const movieId = removeButton.dataset.removeId;

                removeFavorite(movieId);

                renderFavorites();

                return;

            }

            // ========================================
            // OPEN FAVORITE MOVIE
            // ========================================

            const favoriteCard = event.target.closest(".favorite-card");

            if (!favoriteCard) return;

            const movieId = favoriteCard.dataset.movieId;

            closeFavorites();

            openMovie(movieId);

        }
    );


    // ========================================
    // ESC KEY
    // ========================================

    document.addEventListener("keydown", event => {

            if (event.key === "Escape" && favoriteOverlay.classList.contains("active")) {

                closeFavorites();

            }

        }
    );

    console.log("FAVORITES MODULE READY");

}