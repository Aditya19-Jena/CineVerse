import {
    openMovieModal,
    openMovieModalLoading,
    renderCineVerseAI
} from "./modal.js";

import { getMovieDetailsFromBackend } from "../api.js";
import { explainMovie } from "../ai/movieExplainer.js";


// ========================================
// GET MOVIE DETAILS
// ========================================

export async function getMovieDetails(movieId) {

    if (!movieId) {
        console.error("Movie ID is missing.");
        return;
    }

    console.log("Fetching movie:", movieId);

    // ========================================
    // 1. OPEN MODAL IMMEDIATELY
    // ========================================

    openMovieModalLoading(movieId);


    try {

        // ========================================
        // 2. FETCH FULL MOVIE DETAILS
        // ========================================

        const movie =
            await getMovieDetailsFromBackend(movieId);

        console.log("Movie Details:", movie);


        if (!movie) {

            console.error(
                "Movie details not found:",
                movieId
            );

            return;
        }


        // ========================================
        // 3. OPEN MODAL WITH REAL DATA
        // ========================================

        movie.cineVerseAI = null;

        openMovieModal(movie);


        // ========================================
        // 4. GENERATE AI AFTER MODAL OPENS
        // ========================================

        const userProfile = {

            favoriteGenres: [],
            favoriteMovies: [],
            recentlyWatched: []

        };


        try {

            const aiExplanation =
                await explainMovie(
                    {
                        title: movie.title,

                        overview:
                            movie.overview,

                        genres:
                            movie.genres?.map(
                                genre => genre.name
                            ) || [],

                        vote_average:
                            movie.vote_average,

                        release_date:
                            movie.release_date
                    },

                    userProfile
                );


            console.log(
                "CineVerse AI:",
                aiExplanation
            );


            movie.cineVerseAI =
                aiExplanation;


            // ========================================
            // UPDATE AI SECTION
            // ========================================

            const aiContainer =
                document.getElementById(
                    "aiMovieContainer"
                );


            if (aiContainer) {

                renderCineVerseAI(
                    aiExplanation
                );

            }

        } catch (aiError) {

            console.error(
                "AI explanation failed:",
                aiError
            );

        }

    } catch (error) {

        console.error(
            "Movie details error:",
            error
        );


        // ========================================
        // SHOW ERROR INSIDE MODAL
        // ========================================

        modalContent.innerHTML = `

            <div class="modal-loading-state">

                <h2>Unable to load movie</h2>

                <p>
                    Something went wrong while
                    loading this movie.
                </p>

            </div>

        `;

    }

}