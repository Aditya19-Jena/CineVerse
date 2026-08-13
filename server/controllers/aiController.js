const { generateAIResponse } =
    require("../services/aiService");

const {
    movieExplanationPrompt
} = require("../utils/prompts");


// ========================================
// MOVIE EXPLANATION SCHEMA
// ========================================

const movieExplanationSchema = {

    type: "object",

    properties: {

        matchScore: {
            type: "integer",
            minimum: 0,
            maximum: 100
        },

        headline: {
            type: "string"
        },

        reasons: {
            type: "array",
            items: {
                type: "string"
            }
        },

        bestFor: {
            type: "array",
            items: {
                type: "string"
            }
        },

        warning: {
            type: "string"
        }

    },

    required: [
        "matchScore",
        "headline",
        "reasons",
        "bestFor",
        "warning"
    ]

};


// ========================================
// EXPLAIN MOVIE
// ========================================

async function explainMovie(req, res) {

    try {

        const {
            movie,
            userProfile
        } = req.body;


        if (!movie) {

            return res.status(400).json({

                success: false,

                message:
                    "Movie data is required"

            });

        }


        const prompt =
            movieExplanationPrompt(
                movie,
                userProfile
            );


        const result =
            await generateAIResponse(
                prompt,
                movieExplanationSchema,
                "cineverse_movie_explanation"
            );


        res.json({

            success: true,

            data: result

        });


    } catch (error) {

        console.error(
            "AI Controller Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to generate AI response"

        });

    }

}


module.exports = {
    explainMovie
};