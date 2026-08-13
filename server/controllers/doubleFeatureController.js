const {
    generateDoubleFeature
} = require("../services/doubleFeatureService");


async function getDoubleFeature(req, res) {

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
            candidates.length < 2
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "At least two movie candidates are required"

            });

        }


        const result =
            await generateDoubleFeature(
                userProfile,
                movieDNA,
                candidates
            );


        if (!result) {

            return res.status(503).json({

                success: false,

                code: "AI_UNAVAILABLE",

                message:
                    "CineVerse AI is temporarily unavailable."

            });

        }


        res.json({

            success: true,

            data: result

        });


    } catch (error) {

        console.error(
            "Double Feature error:",
            error
        );


        res.status(500).json({

            success: false,

            code: "DOUBLE_FEATURE_ERROR",

            message:
                "Failed to generate double feature."

        });

    }

}


module.exports = {
    getDoubleFeature
};