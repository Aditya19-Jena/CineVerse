const {
    generateRecommendations
} = require("../services/recommendationService");


async function getRecommendations(req, res) {

    try {

        const {
            userProfile,
            movieDNA,
            candidates
        } = req.body;


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
            await generateRecommendations(
                userProfile,
                movieDNA,
                candidates
            );


        res.json({
            success: true,
            data: recommendations
        });


    } catch (error) {

        console.error(
            "Recommendation error:",
            error
        );


        if (
            error?.status === 429 ||
            error?.code ===
                "credit_balance_exhausted"
        ) {

            return res.status(503).json({
                success: false,
                code: "AI_QUOTA_EXCEEDED",
                message:
                    "CineVerse AI is temporarily unavailable."
            });

        }


        res.status(500).json({
            success: false,
            code: "AI_ERROR",
            message:
                "Failed to generate recommendations."
        });

    }

}


module.exports = {
    getRecommendations
};