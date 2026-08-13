
import {
    API_BASE_URL
} from "../config.js";

export async function explainMovie(movie, userProfile = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/ai/explain`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    movie,
                    userProfile
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `AI request failed: ${response.status}`
            );
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                result.message || "AI request failed"
            );
        }

        return result.data;

    } catch (error) {

        console.error(
            "Movie explanation error:",
            error
        );

        throw error;
    }
}