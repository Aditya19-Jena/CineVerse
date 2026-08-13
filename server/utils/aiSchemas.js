const movieDNASchema = {

    type: "object",

    properties: {

        personality: {
            type: "string"
        },

        summary: {
            type: "string"
        },

        genres: {
            type: "array",

            items: {

                type: "object",

                properties: {

                    name: {
                        type: "string"
                    },

                    score: {
                        type: "number"
                    }

                },

                required: [
                    "name",
                    "score"
                ],

                additionalProperties: false
            }
        },

        themes: {
            type: "array",

            items: {
                type: "string"
            }
        },

        preferences: {
            type: "array",

            items: {
                type: "string"
            }
        },

        avoidances: {
            type: "array",

            items: {
                type: "string"
            }
        }

    },

    required: [
        "personality",
        "summary",
        "genres",
        "themes",
        "preferences",
        "avoidances"
    ],

    additionalProperties: false
};



const recommendationSchema = {

    type: "object",

    properties: {

        recommendations: {

            type: "array",

            items: {

                type: "object",

                properties: {

                    movieId: {
                        type: "number"
                    },

                    matchScore: {
                        type: "number"
                    },

                    reason: {
                        type: "string"
                    },

                    bestFor: {
                        type: "string"
                    }

                },

                required: [
                    "movieId",
                    "matchScore",
                    "reason",
                    "bestFor"
                ],

                additionalProperties: false
            }
        }

    },

    required: [
        "recommendations"
    ],

    additionalProperties: false
};

const doubleFeatureSchema = {

    type: "object",

    properties: {

        movie1: {

            type: "object",

            properties: {

                movieId: {
                    type: "number"
                }

            },

            required: [
                "movieId"
            ],

            additionalProperties: false
        },


        movie2: {

            type: "object",

            properties: {

                movieId: {
                    type: "number"
                }

            },

            required: [
                "movieId"
            ],

            additionalProperties: false
        },


        pairScore: {

            type: "number",

            minimum: 0,
            maximum: 100
        },


        whyItWorks: {

            type: "array",

            minItems: 2,
            maxItems: 4,

            items: {
                type: "string"
            }
        },


        bestFor: {

            type: "string"

        }

    },


    required: [

        "movie1",
        "movie2",
        "pairScore",
        "whyItWorks",
        "bestFor"

    ],


    additionalProperties: false

};


module.exports = {
    movieDNASchema,
    recommendationSchema,
    doubleFeatureSchema
};