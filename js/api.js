const API_BASE_URL = "http://localhost:5000/api";


// ================================
// GET POPULAR MOVIES
// ================================

export async function getPopularMovies() {

    const response = await fetch(
        `${API_BASE_URL}/movies/popular`
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch popular movies: ${response.status}`
        );
    }

    const result = await response.json();

    console.log(
        "Popular API response:",
        result
    );

    if (!result.success) {
        throw new Error(
            result.message ||
            "Failed to fetch popular movies"
        );
    }

    return (
        result.data?.results ||
        result.data ||
        result.results ||
        []
    );
}


// ================================
// SEARCH MOVIES
// ================================

export async function searchMovies(query, signal) {

    const response = await fetch(
        `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`,
        {
            signal
        }
    );

    if (!response.ok) {
        throw new Error("Failed to search movies");
    }

    const result = await response.json();

    return result.data || [];
}


export async function getRecommendationCandidates() {

    const response = await fetch(
        `${API_BASE_URL}/movies/recommendation-candidates`
    );


    if (!response.ok) {

        throw new Error(
            "Failed to fetch recommendation candidates"
        );

    }


    const result =
        await response.json();


    if (!result.success) {

        throw new Error(
            result.message ||
            "Failed to fetch candidates"
        );

    }


    return (
        result.data ||
        []
    );
}

// ================================
// GET MOVIE DETAILS
// ================================

export async function getMovieDetailsFromBackend(movieId) {

    const response = await fetch(
        `${API_BASE_URL}/movies/${movieId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }

    const result = await response.json();

    return result.data;
}