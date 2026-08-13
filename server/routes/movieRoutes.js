const express = require("express");

const {
    getPopularMovies,
    searchMovies,
    getMovieDetails,
    getRecommendationCandidates
} = require("../services/tmdbService");

const router = express.Router();


// =====================================================
// GET POPULAR MOVIES
// =====================================================

router.get("/popular", async (req, res) => {

    try {

        const movies =
            await getPopularMovies();

        res.json({
            success: true,
            data: movies
        });

    } catch (error) {

        console.error(
            "Popular movies error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch popular movies"
        });

    }

});


// =====================================================
// SEARCH MOVIES
// =====================================================

router.get("/search", async (req, res) => {

    try {

        const { query } = req.query;


        if (!query) {

            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });

        }


        const movies =
            await searchMovies(query);


        res.json({
            success: true,
            data: movies
        });

    } catch (error) {

        console.error(
            "Movie search error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to search movies"
        });

    }

});


// =====================================================
// RECOMMENDATION CANDIDATES
// IMPORTANT: THIS MUST COME BEFORE /:id
// =====================================================

router.get(
    "/recommendation-candidates",
    async (req, res) => {

        try {

            console.log(
                "Fetching recommendation candidates..."
            );


            const movies =
                await getRecommendationCandidates();


            console.log(
                "Recommendation candidates:",
                movies?.length || 0
            );


            res.json({
                success: true,
                data: movies
            });

        } catch (error) {

            console.error(
                "Recommendation candidates error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to fetch recommendation candidates",
                error: error.message
            });

        }

    }
);


// =====================================================
// GET MOVIE DETAILS
// IMPORTANT: KEEP THIS AFTER SPECIFIC ROUTES
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        const movie =
            await getMovieDetails(
                req.params.id
            );


        res.json({
            success: true,
            data: movie
        });

    } catch (error) {

        console.error(
            "Movie details error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch movie details",
            error: error.message
        });

    }

});


module.exports = router;