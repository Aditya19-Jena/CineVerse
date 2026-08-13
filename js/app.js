console.log("APP.JS LOADED");

import initNavbar from "./modules/navbar.js";
import initHero from "./modules/hero.js";
import initMovies from "./modules/movies.js";
import initPopularMovies from "./modules/popular.js";
import initBollywoodMovies from "./modules/bollywood.js";
import initFAQ from "./modules/faq.js";
import initFooter from "./modules/footer.js";
import initSearch from "./modules/search.js";
import initFavorites from "./modules/favorites.js";
import initAuth from "./modules/auth.js";

import { getMovieDetails } from "./modules/movieDetails.js";

import { renderMovieDNA } from "./ai/movieDNAUI.js";

import {
    renderRecommendations
} from "./ai/recommendationsUI.js";

import {
    initMoodEngine
} from "./ai/moodUI.js";


import {
    getPopularMovies,
    searchMovies,
    getMovieDetailsFromBackend
} from "./api.js";


console.log("ALL MODULES IMPORTED");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM LOADED");

    initNavbar();

    console.log("NAVBAR INITIALIZED");

    initHero();
    initMovies();
    initFAQ();
    initPopularMovies();
    initBollywoodMovies();
    initFooter();
    initSearch();
    initAuth();

  

    initMoodEngine();

    const recommendationContainer =
    document.getElementById(
        "ai-recommendations-container"
    );


if (recommendationContainer) {

    renderRecommendations(
        recommendationContainer
    );

}
    
    initFavorites({
        openMovie: getMovieDetails
    });

    const movieDNAContainer =
    document.getElementById(
        "movie-dna-container"
    );

if (movieDNAContainer) {
    renderMovieDNA(movieDNAContainer);
}

});


document.addEventListener("click", (event) => {

    const movieCard = event.target.closest(".movie-card");

    if (!movieCard) return;

    const movieId = movieCard.dataset.movieId;

    if (!movieId) {
        console.error("Movie ID not found!");
        return;
    }

    console.log("Clicked movie ID:", movieId);

    getMovieDetails(movieId);

});


