// ========================================
// HERO CONFIGURATION
// ========================================

import { getMovieTrailer } from "./trailer.js";
import { openMovieModal } from "./modal.js";

const API_KEY = "6959e539d352dad1e9cf62ec6f3d8f85";
const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// ========================================
// HERO TRAILER STATE
// ========================================

let currentHeroMovieId = null;

/* ========================================
   GET HERO MOVIES
======================================== */

async function getHeroMovies() {

    const englishUrl =
        `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
        `&with_original_language=en` +
        `&sort_by=popularity.desc` +
        `&vote_count.gte=100` +
        `&include_adult=false`;

    const hindiUrl =
        `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
        `&with_original_language=hi` +
        `&sort_by=popularity.desc` +
        `&vote_count.gte=50` +
        `&include_adult=false`;

    try {

        const [englishResponse, hindiResponse] =
            await Promise.all([
                fetch(englishUrl),
                fetch(hindiUrl)
            ]);

        if (!englishResponse.ok || !hindiResponse.ok) {
            throw new Error(
                "Failed to fetch hero movies"
            );
        }

        const [englishData, hindiData] =
            await Promise.all([
                englishResponse.json(),
                hindiResponse.json()
            ]);

        const englishMovies =
            englishData.results || [];

        const hindiMovies =
            hindiData.results || [];

        console.log(
            "English hero movies:",
            englishMovies
        );

        console.log(
            "Hindi hero movies:",
            hindiMovies
        );


        // Only movies with backdrop images
        const filteredEnglish =
            englishMovies.filter(
                movie => movie.backdrop_path
            );

        const filteredHindi =
            hindiMovies.filter(
                movie => movie.backdrop_path
            );


        // ========================================
        // BALANCED HERO MIX
        // ========================================

        const heroMovies = [];

        const maxMovies = Math.max(
            filteredEnglish.length,
            filteredHindi.length
        );

        for (let i = 0; i < maxMovies; i++) {

            // English
            if (filteredEnglish[i]) {
                heroMovies.push(
                    filteredEnglish[i]
                );
            }

            // Hindi / Bollywood
            if (filteredHindi[i]) {
                heroMovies.push(
                    filteredHindi[i]
                );
            }

        }

        console.log(
            "Final hero movies:",
            heroMovies
        );

        return heroMovies;

    } catch (error) {

        console.error(
            "Error fetching hero movies:",
            error
        );

        return [];
    }
}

/* ========================================
CREATE HERO
======================================== */

function createHero (movie) {
  const heroContainer = document.getElementById("hero-container");

  if (!heroContainer) return;

  currentHeroMovieId = movie.id;
  
  heroContainer.innerHTML = `
    <section class = "hero">
      <!-- Movie Banner -->
      <div class = "hero-backdrop">
        <img src="${IMAGE_BASE_URL}/original${movie.backdrop_path}" alt="${movie.title}">
      </div>

      <!-- Dark layer over banner -->
      <div class = "hero-overlay"></div>
    
      <!-- Movie Information -->
      <div class = "hero-content">
        <span class = "hero-label">
          Featured Movie
        </span>

        <h1 class = "hero-title">
          ${movie.title}
        </h1>

        <p class = "hero-description">
          ${movie.overview || "Discover this movie on CineVerse."}
        </p>

        <div class = "hero-meta">
          <span>
            <i class="fa-solid fa-star"></i>
            ${movie.vote_average?.toFixed(1) || "N/A"}
          </span>

          <span>
            ${movie.release_date?.slice(0, 4) || "N/A"}
          </span>

          <span>
            Movie
          </span>
        </div>

        <div class = "hero-buttons">
          <button class = "btn-primary hero-watch-trailer">
            <i class="fa-solid fa-play"></i>
            Watch Trailer
          </button>
                  
          <button class="btn-secondary hero-more-details"
    type="button">
            <i class="fa-solid fa-circle-info"></i>
            More Details
          </button>
        </div>
      </div>

       <!-- ========================================
         HERO TRAILER
    ======================================== -->

    <div class="hero-trailer" id="heroTrailer">

        <iframe
            id="heroTrailerFrame"
            title="Movie Trailer"
            src=""
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
        </iframe>

        <button
            class="trailer-close"
            id="heroTrailerClose"
            type="button"
            aria-label="Close trailer"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

    </div>
    </section>
  `;

    // ========================================
// WATCH TRAILER BUTTON
// ========================================

const trailerButton =
    heroContainer.querySelector(".hero-watch-trailer");

console.log("Trailer button:", trailerButton);

trailerButton?.addEventListener("click", () => {

    console.log("WATCH TRAILER CLICKED");
    console.log("Movie ID:", movie.id);

    openHeroTrailer(movie.id);
});


    // ========================================
    // CLOSE TRAILER BUTTON
    // ========================================

    const closeButton =
        heroContainer.querySelector("#heroTrailerClose");

    closeButton?.addEventListener("click", () => {
        closeHeroTrailer();
    });

// ========================================
// MORE DETAILS BUTTON
// ========================================

const detailsButton =
    heroContainer.querySelector(".hero-more-details");

detailsButton?.addEventListener("click", () => {

    console.log(
        "HERO MORE DETAILS CLICKED:",
        movie.id
    );

    openMovieModal(movie);

});
}



/* ========================================
CHANGE HERO MOVIE
======================================== */

function updateHero(movie) {
  const hero = document.querySelector(".hero");

  if (!hero) return;

  currentHeroMovieId = movie.id;

  closeHeroTrailer();

  const backdrop = hero.querySelector(".hero-backdrop img");
  const title = hero.querySelector(".hero-title");
  const description = hero.querySelector(".hero-description");
  const rating = hero.querySelector(".hero-meta span:first-child");
  const year = hero.querySelector(".hero-meta span:nth-child(2)");

  // Fade out
  hero.classList.add("hero-changing");

  setTimeout(() => {
    // Update content
    backdrop.src = `${IMAGE_BASE_URL}/original${movie.backdrop_path}`;

    backdrop.alt = movie.title;
    title.textContent = movie.title;

    description.textContent = movie.overview || "Discover this movie on CineVerse.";

    rating.innerHTML = `
      <i class="fa-solid fa-star"></i>
      ${movie.vote_average?.toFixed(1) || "N/A"}
    `;

    year.textContent = movie.release_date?.slice(0, 4) || "N/A";

    // Fade in
    hero.classList.remove("hero-changing");
  }, 400);
}

/* ========================================
INITIALIZE HERO
======================================== */

async function initHero() {
  console.log("Hero module loaded");

  const heroContainer = document.getElementById("hero-container");

  if (!heroContainer) {
    console.error(
      "Hero container not found!"
    );
    return;
  }

  const movies = await getHeroMovies();

  if (!movies.length) {
    console.error(
      "No hero movies available!"
    );
    return;
  }

  // Only use movies with backdrop images
  const heroMovies = movies.filter(movie => movie.backdrop_path);

  if (!heroMovies.length) {
    console.error(
      "No movies with backdrop images!"
    );
    return;
  }

  // Start with first movie
  let currentIndex = 0;

  createHero(heroMovies[currentIndex]);

  // Automatically change movie

  setInterval(() => {
    currentIndex++;

    if (currentIndex >= heroMovies.length) {
      currentIndex = 0;
    }

    updateHero(
      heroMovies[currentIndex]
    );
  }, 10000);
}

export default initHero;


// ========================================
// OPEN HERO TRAILER
// ========================================

async function openHeroTrailer(movieId) {

    console.log("Opening trailer for:", movieId);

    const trailer =
        document.getElementById("heroTrailer");

    const iframe =
        document.getElementById("heroTrailerFrame");

    console.log("Trailer element:", trailer);
    console.log("Iframe element:", iframe);

    if (!trailer || !iframe) {

        console.error(
            "Hero trailer elements not found!"
        );

        return;
    }

    try {

        console.log(
            "Calling getMovieTrailer..."
        );

        const trailerData =
            await getMovieTrailer(movieId);

        console.log(
            "Trailer data:",
            trailerData
        );


        if (!trailerData) {

            console.error(
                "No trailer returned!"
            );

            return;
        }


        iframe.src =
            `https://www.youtube.com/embed/${trailerData.key}?autoplay=1&rel=0`;


        console.log(
            "Trailer URL:",
            iframe.src
        );


        trailer.classList.add("active");

        console.log(
            "Trailer panel activated"
        );

    } catch (error) {

        console.error(
            "Hero trailer error:",
            error
        );
    }
}

// ========================================
// CLOSE HERO TRAILER
// ========================================

function closeHeroTrailer() {

    const trailer =
        document.getElementById("heroTrailer");

    const iframe =
        document.getElementById("heroTrailerFrame");

    if (!trailer || !iframe) return;


    // Stop video
    iframe.src = "";


    // Hide video
    trailer.classList.remove("active");
}