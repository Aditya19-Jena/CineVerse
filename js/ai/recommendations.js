import {
    getRecommendationCandidates
} from "../api.js";

import {
    getUserMovieProfile
} from "./userMovieProfile.js";

import {
    getMovieDNA
} from "./movieDNA.js";


const API_BASE_URL =
    "http://localhost:5000/api";


export async function getPersonalizedRecommendations() {

    const userProfile =
        getUserMovieProfile();

        console.log("🎯 RECOMMENDATION USER PROFILE:", userProfile);
console.log(
    "⭐ FAVORITES:",
    userProfile.favoriteMovies
);
console.log(
    "🔎 SEARCHED:",
    userProfile.recentlySearched
);


    // --------------------------------
    // Need some user data
    // --------------------------------

    if (
        !userProfile.favoriteMovies.length &&
        !userProfile.recentlySearched.length
    ) {

        return {
            recommendations: [],
            candidates: []
        };

    }


    // --------------------------------
    // Get Movie DNA
    // --------------------------------

    const movieDNA =
        await getMovieDNA(
            userProfile
        );

        console.log(
    "🧬 RECOMMENDATION MOVIE DNA:",
    movieDNA
);


    // --------------------------------
    // Get real TMDB candidates
    // --------------------------------

    const candidates =
        await getRecommendationCandidates();

        console.log(
    "🎬 RECOMMENDATION CANDIDATES:",
    candidates
);


    if (!candidates.length) {

        return {
            recommendations: [],
            candidates: []
        };

    }


    // --------------------------------
    // Remove favorites
    // --------------------------------

    const favoriteIds =
    new Set(
        userProfile.favoriteMovies
            .map(movie => {

                if (
                    typeof movie === "object"
                ) {
                    return Number(movie.id);
                }

                return null;

            })
            .filter(Boolean)
    );


    const filteredCandidates =
        candidates.filter(
            movie =>
                !favoriteIds.has(movie.id)
        );


    // --------------------------------
    // Ask CineVerse AI to rank
    // --------------------------------

    const response =
        await fetch(
            `${API_BASE_URL}/ai/recommendations`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    userProfile,

                    movieDNA,

                    candidates:
                        filteredCandidates.slice(
                            0,
                            20
                        )

                })
            }
        );

        console.log(
    "🤖 SENDING RECOMMENDATION REQUEST TO AI",
    {
        favorites:
            userProfile.favoriteMovies.length,

        searched:
            userProfile.recentlySearched.length,

        candidates:
            filteredCandidates.length
    }
);


    if (!response.ok) {

        throw new Error(
            `Recommendation request failed: ${response.status}`
        );

    }


    const result =
        await response.json();

        console.log(
    "🤖 AI RECOMMENDATION RESPONSE:",
    result
);


    if (!result.success) {

        const error =
            new Error(
                result.message ||
                "Recommendation failed"
            );

        error.code =
            result.code;

        throw error;

    }


    return {
        recommendations:
            result.data.recommendations,

        candidates:
            filteredCandidates
    };

    console.log(
    "✅ FINAL RECOMMENDATIONS:",
    result.data?.recommendations
);
}