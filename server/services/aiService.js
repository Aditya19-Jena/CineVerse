const { GoogleGenAI } = require("@google/genai");

// =========================================================
// GEMINI CLIENT
// =========================================================

const client = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })
    : null;


// =========================================================
// GENERATE AI RESPONSE
// =========================================================

async function generateAIResponse(
    prompt,
    schema = null,
    schemaName = "cineverse_response"
) {

    // -----------------------------------------
    // Check API configuration
    // -----------------------------------------

    if (!client) {

        throw new Error(
            "GEMINI_API_KEY is missing from .env"
        );

    }


    try {

        // -----------------------------------------
        // Gemini request configuration
        // -----------------------------------------

        const config = {

            temperature: 0.7,

            systemInstruction:
                "You are CineVerse AI, a movie recommendation assistant. Follow the requested JSON structure exactly."

        };


        // -----------------------------------------
        // Structured JSON output
        // -----------------------------------------

        if (schema) {

            config.responseMimeType =
                "application/json";

            config.responseSchema =
                schema;

        }


        // -----------------------------------------
        // Gemini request
        // -----------------------------------------

        const response =
            await client.models.generateContent({

                model: "gemini-3.5-flash-lite",

                contents: prompt,

                config

            });


        const content =
            response.text;


        if (!content) {

            throw new Error(
                "Empty Gemini response"
            );

        }


        // -----------------------------------------
        // Parse structured JSON
        // -----------------------------------------

        if (schema) {

            try {

                return JSON.parse(content);

            } catch (parseError) {

                console.error(
                    "Gemini JSON parsing failed:",
                    parseError
                );

                console.error(
                    "Raw Gemini response:",
                    content
                );

                throw new Error(
                    "Gemini returned invalid JSON"
                );

            }

        }


        // -----------------------------------------
        // Normal text response
        // -----------------------------------------

        return content;


    } catch (error) {

        console.error(
            "Gemini Service Error:",
            error.status || "",
            error.code || "",
            error.message
        );

        throw error;

    }

}


// =========================================================
// EXPORT
// =========================================================

module.exports = {
    generateAIResponse
};