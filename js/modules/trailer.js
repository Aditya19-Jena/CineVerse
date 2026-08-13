// ========================================
// TRAILER
// ========================================

const API_KEY = "6959e539d352dad1e9cf62ec6f3d8f85";
const BASE_URL = "https://api.themoviedb.org/3";

// ========================================
// GET MOVIE TRAILER
// ========================================

export async function getMovieTrailer(movieId) {

  console.log("TRAILER FUNCTION:", movieId);

    try {

        console.log("Getting trailer for:", movieId);

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Movie videos:", data.results);


        // Find official YouTube trailer
        const trailer =
            data.results.find(video =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official === true
            )
            ||
            data.results.find(video =>
                video.site === "YouTube" &&
                video.type === "Trailer"
            );


        if (!trailer) {

            console.log("No trailer found");

            return null;
        }


        console.log("Trailer found:", trailer);

        return trailer.key;


    } catch (error) {

        console.error("Trailer error:", error);

        return null;

    }

}