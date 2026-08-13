const { generateAIResponse } =
    require("./aiService");

const {
    doubleFeatureSchema
} = require("../utils/aiSchemas");


async function generateDoubleFeature(
    userProfile,
    movieDNA,
    candidates
) {

    const availableMovies =
        candidates.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            popularity: movie.popularity,
            genre_ids: movie.genre_ids
        }));


    const prompt = `

You are CineVerse AI's Double-Feature Engine.

Your job is to create the best two-movie
watching experience for this user.

USER PROFILE:

${JSON.stringify(userProfile)}


USER MOVIE DNA:

${JSON.stringify(movieDNA)}


AVAILABLE MOVIES:

${JSON.stringify(availableMovies)}


TASK:

Select exactly TWO movies that work well
together as a double feature.


RULES:

1. ONLY select movies from AVAILABLE MOVIES.
2. Never invent a movie.
3. Return the exact movie ID.
4. Both movie IDs must be different.
5. Consider the user's Movie DNA heavily.
6. Consider favorites and recent searches.
7. The two movies should complement each other.
8. Avoid recommending movies already favorited.
9. Give the pairing a score from 0-100.
10. Explain why the two movies work together.
11. Describe the ideal viewing situation.


Think about:

- shared themes
- genre compatibility
- emotional progression
- pacing
- storytelling style
- contrast between the two movies
- user's personal taste


Return only the requested JSON structure.

`;


    return await generateAIResponse(
        prompt,
        doubleFeatureSchema,
        "double_feature"
    );
}


module.exports = {
    generateDoubleFeature
};