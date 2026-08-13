import { getFavorites } from "../modules/favorites.js";


// ========================================
// STORAGE KEYS
// ========================================

const RECENT_SEARCHES_KEY = "cineverse_recent_searches";


// ========================================
// GET RECENT SEARCHES
// ========================================

function getRecentSearches() {

    try {

        const searches =
            localStorage.getItem(
                RECENT_SEARCHES_KEY
            );

        return searches
            ? JSON.parse(searches)
            : [];

    } catch (error) {

        console.error(
            "Failed to load recent searches:",
            error
        );

        return [];
    }
}


// ========================================
// BUILD USER MOVIE PROFILE
// ========================================

export function getUserMovieProfile() {

    const favorites = getFavorites();

    const recentSearches =
        getRecentSearches();


    return {

        favoriteMovies: favorites.map(movie => ({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average
        })),

        recentlySearched:
            recentSearches,

        recentlyWatched: [],

        ratings: []

    };
}