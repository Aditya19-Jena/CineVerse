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


// ========================================
// MOOD → MOVIE
// ========================================

export async function getMoodRecommendations(
    mood
) {

    if (!mood) {

        throw new Error(
            "Mood is required"
        );

    }


    const userProfile =
        getUserMovieProfile();


    const movieDNA =
        await getMovieDNA(
            userProfile
        );


    const candidates =
        await getRecommendationCandidates();


    if (!candidates.length) {

        return {
            recommendations: [],
            candidates: []
        };

    }


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
                !favoriteIds.has(
                    Number(movie.id)
                )
        );


    const response =
        await fetch(
            `${API_BASE_URL}/ai/mood`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    mood,

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


    if (!response.ok) {

        throw new Error(
            `Mood request failed: ${response.status}`
        );

    }


    const result =
        await response.json();


    if (!result.success) {

        const error =
            new Error(
                result.message ||
                "Mood recommendation failed"
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

}