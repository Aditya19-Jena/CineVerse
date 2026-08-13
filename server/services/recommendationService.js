const { generateAIResponse } =
    require("./aiService");

const {
    recommendationSchema
} = require("../utils/aiSchemas");


async function generateRecommendations(
    userProfile,
    movieDNA,
    candidates
) {

    const prompt = `
You are CineVerse AI's recommendation engine.

Your job is to rank real movie candidates for a user.

USER PROFILE:
${JSON.stringify(userProfile)}

USER MOVIE DNA:
${JSON.stringify(movieDNA)}

AVAILABLE MOVIES:
${JSON.stringify(
    candidates.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        genre_ids: movie.genre_ids
    }))
)}

TASK:

Select the best 5 movies for this user.

Rules:

1. ONLY select movies from AVAILABLE MOVIES.
2. Never invent a movie.
3. Return the exact movie ID.
4. Consider Movie DNA heavily.
5. Consider recent searches and favorites.
6. Do not recommend movies the user already favorited.
7. Give every recommendation a match score from 0-100.
8. Explain the recommendation in one concise sentence.
9. Explain what kind of viewing situation it is best for.

Return only the requested JSON structure.
`;


    return await generateAIResponse(
        prompt,
        recommendationSchema,
        "movie_recommendations"
    );
}


module.exports = {
    generateRecommendations
};