const {
    generateMoodRecommendations
} = require("../services/moodService");


async function getMoodRecommendations(
    req,
    res
) {

    try {

        const {
            mood,
            userProfile,
            movieDNA,
            candidates
        } = req.body;


        if (!mood) {

            return res.status(400).json({
                success: false,
                message: "Mood is required"
            });

        }


        if (!userProfile) {

            return res.status(400).json({
                success: false,
                message:
                    "User profile is required"
            });

        }


        if (!movieDNA) {

            return res.status(400).json({
                success: false,
                message:
                    "Movie DNA is required"
            });

        }


        if (
            !Array.isArray(candidates) ||
            !candidates.length
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Movie candidates are required"
            });

        }


        const recommendations =
            await generateMoodRecommendations(
                mood,
                userProfile,
                movieDNA,
                candidates
            );


        return res.json({

            success: true,

            data: recommendations

        });


    } catch (error) {

        console.error(
            "Mood recommendation error:",
            error
        );


        if (
            error?.status === 429 ||
            error?.code ===
                "credit_balance_exhausted"
        ) {

            return res.status(503).json({

                success: false,

                code:
                    "AI_QUOTA_EXCEEDED",

                message:
                    "CineVerse AI is temporarily unavailable."

            });

        }


        return res.status(500).json({

            success: false,

            code: "AI_ERROR",

            message:
                "Failed to generate mood recommendations."

        });

    }

}


module.exports = {
    getMoodRecommendations
};