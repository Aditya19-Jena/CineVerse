// ========================================
// MOVIE DNA
// ========================================

import {
    API_BASE_URL
} from "../config.js";


const MOVIE_DNA_CACHE_KEY =
    "cineverse_movie_dna";

const MOVIE_DNA_PROFILE_KEY =
    "cineverse_movie_dna_profile";


// ========================================
// GENERATE MOVIE DNA
// ========================================

export async function generateMovieDNA(userProfile) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/ai/movie-dna`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userProfile
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                `Movie DNA request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Movie DNA generation failed"
            );

        }


        return result.data;


    } catch (error) {

        console.error(
            "Movie DNA API error:",
            error
        );

        throw error;

    }
}


// ========================================
// GET CACHED MOVIE DNA
// ========================================

export function getCachedMovieDNA() {

    try {

        const cached =
            localStorage.getItem(
                MOVIE_DNA_CACHE_KEY
            );

        if (!cached) {
            return null;
        }

        return JSON.parse(cached);

    } catch (error) {

        console.error(
            "Movie DNA cache error:",
            error
        );

        return null;
    }
}


// ========================================
// SAVE MOVIE DNA
// ========================================

export function saveMovieDNACache(
    dna,
    userProfile
) {

    try {

        localStorage.setItem(
            MOVIE_DNA_CACHE_KEY,
            JSON.stringify({
                dna,
                generatedAt: Date.now()
            })
        );


        localStorage.setItem(
            MOVIE_DNA_PROFILE_KEY,
            JSON.stringify(userProfile)
        );


    } catch (error) {

        console.error(
            "Failed to save Movie DNA:",
            error
        );

    }
}


// ========================================
// CHECK WHETHER PROFILE CHANGED
// ========================================

export function hasMovieProfileChanged(
    currentProfile
) {

    try {

        const previousProfile =
            localStorage.getItem(
                MOVIE_DNA_PROFILE_KEY
            );

        if (!previousProfile) {
            return true;
        }


        const oldProfile =
            JSON.parse(previousProfile);


        return (
            JSON.stringify(oldProfile) !==
            JSON.stringify(currentProfile)
        );


    } catch (error) {

        return true;
    }
}


// ========================================
// GET OR GENERATE MOVIE DNA
// ========================================

export async function getMovieDNA(
    userProfile
) {

    const cached =
        getCachedMovieDNA();


    // --------------------------------
    // USE CACHE
    // --------------------------------

    if (
        cached &&
        !hasMovieProfileChanged(userProfile)
    ) {

        console.log(
            "Using cached Movie DNA"
        );

        return cached.dna;
    }


    // --------------------------------
    // GENERATE NEW DNA
    // --------------------------------

    console.log(
        "Generating fresh Movie DNA..."
    );


    const dna =
        await generateMovieDNA(
            userProfile
        );


    // --------------------------------
    // SAVE
    // --------------------------------

    saveMovieDNACache(
        dna,
        userProfile
    );


    return dna;
}