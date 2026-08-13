const { generateAIResponse } =
    require("./aiService");


async function generateMovieDNA(movie, userProfile = {}) {

    const prompt = `
Analyze this movie and create a Movie DNA profile.

Movie:
${JSON.stringify(movie)}

User Profile:
${JSON.stringify(userProfile)}

Return JSON with:

{
    "personality": "...",
    "genres": [
        {
            "name": "...",
            "score": 0
        }
    ],
    "themes": [],
    "bestFor": [],
    "watchStyle": [],
    "similarity": []
}
`;

    const aiResponse =
        await generateAIResponse(prompt);


    // =========================================
    // AI SUCCESS
    // =========================================

    if (aiResponse) {

        try {

            const cleaned =
                aiResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

            return JSON.parse(cleaned);

        } catch (error) {

            console.warn(
                "AI returned invalid JSON. Using fallback."
            );
        }
    }


    // =========================================
    // FALLBACK
    // =========================================

    return generateFallbackDNA(
        movie,
        userProfile
    );
}


/**
 * Rule-based Movie DNA fallback.
 */
function generateFallbackDNA(movie, userProfile = {}) {

    const genres =
        movie.genres || [];


    const genreNames =
        genres.map(g =>
            typeof g === "string"
                ? g
                : g.name
        );


    const genreDNA =
        genreNames.map((genre, index) => ({
            name: genre,
            score: Math.max(
                60,
                90 - index * 8
            )
        }));


    return {

        personality:
            getPersonality(genreNames),

        genres:
            genreDNA,

        themes:
            getThemes(movie),

        bestFor:
            getBestFor(genreNames),

        watchStyle:
            getWatchStyle(genreNames),

        similarity:
            userProfile.favoriteMovies || []

    };
}


/* =========================================
   PERSONALITY
   ========================================= */

function getPersonality(genres) {

    if (
        genres.includes("Science Fiction") &&
        genres.includes("Thriller")
    ) {
        return "The Curious Mind";
    }

    if (
        genres.includes("Action") &&
        genres.includes("Adventure")
    ) {
        return "The Adventurer";
    }

    if (
        genres.includes("Romance") &&
        genres.includes("Drama")
    ) {
        return "The Emotional Storyteller";
    }

    if (
        genres.includes("Comedy")
    ) {
        return "The Feel-Good Explorer";
    }

    if (
        genres.includes("Horror")
    ) {
        return "The Fear Seeker";
    }

    return "The Cinematic Explorer";
}


/* =========================================
   THEMES
   ========================================= */

function getThemes(movie) {

    const overview =
        (movie.overview || "").toLowerCase();

    const themes = [];


    if (
        overview.includes("dream")
    ) {
        themes.push("Dreams");
    }

    if (
        overview.includes("love")
    ) {
        themes.push("Love");
    }

    if (
        overview.includes("family")
    ) {
        themes.push("Family");
    }

    if (
        overview.includes("power")
    ) {
        themes.push("Power");
    }

    if (
        overview.includes("time")
    ) {
        themes.push("Time");
    }


    if (themes.length === 0) {

        themes.push(
            "Story",
            "Characters",
            "Conflict"
        );
    }


    return themes;
}


/* =========================================
   BEST FOR
   ========================================= */

function getBestFor(genres) {

    const result = [];


    if (genres.includes("Science Fiction")) {
        result.push("Curious minds");
    }

    if (genres.includes("Thriller")) {
        result.push("Late-night watching");
    }

    if (genres.includes("Comedy")) {
        result.push("Relaxed evenings");
    }

    if (genres.includes("Drama")) {
        result.push("Emotional stories");
    }

    if (genres.includes("Action")) {
        result.push("High-energy viewing");
    }


    if (result.length === 0) {
        result.push("Movie lovers");
    }


    return result;
}


/* =========================================
   WATCH STYLE
   ========================================= */

function getWatchStyle(genres) {

    if (
        genres.includes("Thriller") ||
        genres.includes("Mystery")
    ) {
        return [
            "Focused watching",
            "Minimal distractions"
        ];
    }


    if (
        genres.includes("Comedy")
    ) {
        return [
            "Casual watching",
            "Group viewing"
        ];
    }


    return [
        "Immersive watching",
        "Story-focused"
    ];
}


module.exports = {
    generateMovieDNA
};