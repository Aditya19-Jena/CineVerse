// ========================================
// MOVIE API
// ========================================

import { API_KEY, BASE_URL } from "./config.js";


// ========================================
// COMMON FETCH FUNCTION
// ========================================

async function fetchTMDB(endpoint) {

    try {

        const response = await fetch(
            `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {

            throw new Error(
                `TMDB API Error: ${response.status}`
            );

        }

        return await response.json();

    } catch (error) {

        console.error("TMDB API Error:", error);

        return null;

    }

}


// ========================================
// GET CAST
// ========================================

export async function getMovieCast(movieId) {

    const data =
        await fetchTMDB(`/movie/${movieId}/credits`);

    return data?.cast || [];

}


// ========================================
// GET WATCH PROVIDERS
// ========================================

export async function getMovieProviders(movieId) {

    try {

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
        );

        if (!response.ok) {

            throw new Error(
                `Provider API Error: ${response.status}`
            );

        }

        const data = await response.json();

        // India
        return data?.results?.IN || null;

    } catch (error) {

        console.error(
            "Watch provider error:",
            error
        );

        return null;

    }

}


// ========================================
// GET SIMILAR MOVIES
// ========================================

export async function getSimilarMovies(movieId) {

    const data =
        await fetchTMDB(`/movie/${movieId}/similar`);

    return data?.results || [];

}

// ========================================
// GET MOVIE DETAILS
// ========================================

export async function getMovieDetails(movieId) {

    return await fetchTMDB(
        `/movie/${movieId}`
    );

}