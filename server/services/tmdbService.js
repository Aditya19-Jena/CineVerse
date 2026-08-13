const TMDB_BASE_URL =
    "https://api.themoviedb.org/3";


// =========================================================
// TMDB REQUEST HELPER
// =========================================================

async function tmdbRequest(endpoint) {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
        throw new Error("TMDB_ACCESS_TOKEN is missing from .env");
    }

    const url = `${TMDB_BASE_URL}${endpoint}`;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 15000);

        try {
            console.log(
                `TMDB request ${attempt}/${maxRetries}:`,
                endpoint
            );

            const response = await fetch(url, {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                },

                signal: controller.signal
            });

            clearTimeout(timeout);

            // =============================================
            // SUCCESS
            // =============================================

            if (response.ok) {
                return await response.json();
            }

            // =============================================
            // READ ERROR
            // =============================================

            let errorBody = "";

            try {
                errorBody = await response.text();
            } catch {
                errorBody = "Unable to read TMDB error";
            }

            console.error(
                `TMDB HTTP ${response.status}:`,
                errorBody
            );

            // =============================================
            // NON-RETRYABLE ERRORS
            // =============================================

            if (
                response.status === 400 ||
                response.status === 401 ||
                response.status === 403 ||
                response.status === 404
            ) {
                throw new Error(
                    `TMDB API error: ${response.status}`
                );
            }

            // =============================================
            // RETRYABLE HTTP ERROR
            // =============================================

            throw new Error(
                `TMDB API error: ${response.status}`
            );

        } catch (error) {
            clearTimeout(timeout);

            console.error(
                `TMDB request attempt ${attempt}/${maxRetries} failed:`,
                error.message
            );

            // =============================================
            // DON'T RETRY AUTH / BAD REQUEST / NOT FOUND
            // =============================================

            if (
                error.message.includes("TMDB API error: 400") ||
                error.message.includes("TMDB API error: 401") ||
                error.message.includes("TMDB API error: 403") ||
                error.message.includes("TMDB API error: 404")
            ) {
                throw error;
            }

            // =============================================
            // LAST ATTEMPT
            // =============================================

            if (attempt === maxRetries) {
                throw error;
            }

            // =============================================
            // RETRY DELAY
            // =============================================

            const delay = attempt * 1500;

            console.log(
                `Retrying TMDB request in ${delay}ms...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }
}


// =========================================================
// POPULAR MOVIES
// =========================================================

async function getPopularMovies() {

    const data =
        await tmdbRequest(
            "/movie/popular?language=en-US&page=1"
        );


    return data.results || [];

}


// =========================================================
// SEARCH MOVIES
// =========================================================

async function searchMovies(query) {

    if (!query) {

        return [];

    }


    const endpoint =
        `/search/movie` +
        `?language=en-US` +
        `&query=${encodeURIComponent(query)}` +
        `&include_adult=false` +
        `&page=1`;


    const data =
        await tmdbRequest(
            endpoint
        );


    return data.results || [];

}


// =========================================================
// MOVIE DETAILS
// =========================================================

async function getMovieDetails(movieId) {

    if (!movieId) {

        throw new Error(
            "Movie ID is required"
        );

    }


    const data =
        await tmdbRequest(
            `/movie/${encodeURIComponent(movieId)}` +
            `?language=en-US`
        );


    return data;

}


// =========================================================
// RECOMMENDATION CANDIDATES
// ===================================================

async function getRecommendationCandidates() {

    console.log(
        "Fetching TMDB recommendation candidates..."
    );

    try {

        const data =
            await tmdbRequest(
                "/trending/movie/week?language=en-US"
            );

        console.log(
            "TMDB recommendation response:",
            data
        );

        return data.results || [];

    } catch (error) {

        console.error(
            "getRecommendationCandidates ERROR:",
            error
        );

        throw error;
    }
}


// =========================================================
// EXPORT
// =========================================================

module.exports = {

    getPopularMovies,

    searchMovies,

    getMovieDetails,

    getRecommendationCandidates

};