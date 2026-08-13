const {
    generateMovieDNA
} = require("../services/movieDNAService");

async function createMovieDNA(req, res) {

    try {

        const { userProfile } = req.body;

        if (!userProfile) {
            return res.status(400).json({
                success: false,
                message: "User profile is required"
            });
        }

        const result =
            await generateMovieDNA(userProfile);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

    console.error(
        "Movie DNA error:",
        error
    );


    if (
        error?.status === 429 ||
        error?.code === "credit_balance_exhausted"
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
            "Failed to generate Movie DNA."
    });

}
}

module.exports = {
    createMovieDNA
};