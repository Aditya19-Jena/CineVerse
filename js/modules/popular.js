// ========================================
// POPULAR MOVIES
// ========================================

import { getPopularMovies } from "../api.js";


// ========================================
// DISPLAY POPULAR MOVIES
// ========================================

function displayPopularMovies(movies) {

    const grid = document.querySelector(".popular-grid");

    if (!grid) {
        console.error("Popular movies grid not found!");
        return;
    }

    grid.innerHTML = "";

    movies.slice(0, 10).forEach(movie => {

        const card = document.createElement("article");

        card.className = "movie-card";
        card.dataset.movieId = movie.id;

        console.log(
            "Creating popular card:",
            movie.title,
            movie.id
        );

        card.innerHTML = `
            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="${movie.title}"
                loading="lazy"
            >

            <div class="movie-info">

                <h3 class="movie-title">
                    ${movie.title}
                </h3>

                <div class="movie-meta">

                    <span>
                        ${movie.release_date?.slice(0, 4) || "N/A"}
                    </span>

                    <span class="movie-rating">
                        <i class="fa-solid fa-star"></i>
                        ${movie.vote_average?.toFixed(1) || "N/A"}
                    </span>

                </div>

            </div>
        `;

        grid.appendChild(card);

    });
}


// ========================================
// INITIALIZE POPULAR SECTION
// ========================================

async function initPopularMovies() {

    const popular = document.getElementById("popular-movies");

    if (!popular) {
        console.error("Popular movies container not found!");
        return;
    }

    popular.innerHTML = `
        <section class="popular-section">

            <div class="section-header">

                <div>
                    <span class="section-label">
                        Most Watched
                    </span>

                    <h2 class="section-title">
                        Popular Movies
                    </h2>
                </div>

                <button class="view-all-btn">
                    View All
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>

            <div class="popular-grid">
                <p class="loading-message">
                    Loading popular movies...
                </p>
            </div>

        </section>
    `;

    try {

        const response = await getPopularMovies();

console.log(
    "Popular movies received from backend:",
    response
);

const movies =
    Array.isArray(response)
        ? response
        : response?.results || response?.data?.results || response?.data || [];

displayPopularMovies(movies);

    } catch (error) {

        console.error(
            "Failed to load popular movies:",
            error
        );

        const grid = document.querySelector(".popular-grid");

        if (grid) {
            grid.innerHTML = `
                <p class="error-message">
                    Unable to load popular movies.
                    Please try again later.
                </p>
            `;
        }

    }
}


export default initPopularMovies;