// ========================================
// BOLLYWOOD MOVIES
// ========================================

const API_KEY = "6959e539d352dad1e9cf62ec6f3d8f85";
const BASE_URL = "https://api.themoviedb.org/3";


// ========================================
// GET BOLLYWOOD MOVIES
// ========================================

async function getBollywoodMovies() {

    const url =
        `${BASE_URL}/discover/movie` +
        `?api_key=${API_KEY}` +
        `&with_original_language=hi` +
        `&region=IN` +
        `&sort_by=popularity.desc` +
        `&page=1`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "Bollywood movies:",
            data.results
        );

        return data.results;

    } catch (error) {

        console.error(
            "Bollywood error:",
            error
        );

        return [];
    }
}

// ========================================
// DISPLAY BOLLYWOOD MOVIES
// ========================================

function displayBollywoodMovies(movies) {

    const grid =
        document.querySelector(".bollywood-grid");

    if (!grid) return;

    grid.innerHTML = "";

    movies.slice(0, 10).forEach(movie => {

        const card =
            document.createElement("article");

        card.className = "movie-card";

        // Required for modal
        card.dataset.movieId = movie.id;

        card.innerHTML = `

            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="${movie.title}"
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
// INITIALIZE
// ========================================

async function initBollywoodMovies() {

    const section =
        document.getElementById("bollywood-movies");

    if (!section) return;

    section.innerHTML = `

        <section class="bollywood-section">

            <div class="section-header">

                <div>

                    <span class="section-label">
                        Indian Cinema
                    </span>

                    <h2 class="section-title">
                        Bollywood Movies
                    </h2>

                </div>

                <button class="view-all-btn">
                    View All
                    <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>

            <div class="bollywood-grid">
                Loading...
            </div>

        </section>

    `;

    const movies =
        await getBollywoodMovies();

    displayBollywoodMovies(movies);
}


export default initBollywoodMovies;