const {
    generateAIResponse
} = require("./aiService");


const {
    recommendationSchema
} = require("../utils/aiSchemas");


// ========================================
// MOOD → MOVIE
// ========================================

async function generateMoodRecommendations(
    mood,
    userProfile,
    movieDNA,
    candidates
) {

    const prompt = `
You are CineVerse AI's Mood → Movie engine.

The user selected this mood:

${mood}

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

Your task:

Select the best 5 movies for the user's CURRENT MOOD.

IMPORTANT:

1. Only select movies from AVAILABLE MOVIES.
2. Never invent a movie.
3. Return the exact movie ID.
4. Consider the selected mood heavily.
5. Use Movie DNA as a secondary personalization signal.
6. Do not recommend movies already in favorites.
7. Match the emotional experience, not just genre.
8. Give each movie a score from 0-100.
9. Give one concise reason.
10. Give a short description of the ideal viewing situation.

Return only the requested JSON structure.
`;


    return await generateAIResponse(
        prompt,
        recommendationSchema,
        "mood_recommendations"
    );

}


module.exports = {
    generateMoodRecommendations
};