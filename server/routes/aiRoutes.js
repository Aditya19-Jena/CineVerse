// ============================================================
// AI ROUTES
// ============================================================

// Import Express
// Express helps us create API routes for our backend.
const express = require("express");

// Create an Express Router
// Instead of putting every route inside server.js/app.js,
// we keep related routes inside separate files.
const router = express.Router();

// ============================================================
// CONTROLLERS
// ============================================================

// Movie Explanation Controller
// Handles the logic for:
// POST /api/ai/explain
const { explainMovie } = require("../controllers/aiController");

// Movie DNA Controller
// Handles the logic for:
// POST /api/ai/movie-dna
const { createMovieDNA } = require("../controllers/movieDNAController");

// Recommendation Controller
// Handles the logic for:
// POST /api/ai/recommendations
const { getRecommendations } = require("../controllers/recommendationController");

// Mood Recommendation Controller
// Handles the logic for:
// POST /api/ai/mood
const { getMoodRecommendations } = require("../controllers/moodController");

// Double Feature Controller
// Handles the logic for:
// POST /api/ai/double-feature
const { getDoubleFeature } = require("../controllers/doubleFeatureController");

// ============================================================
// SERVICES
// ============================================================

// Import the AI service.
//
// The controller usually handles the request/response,
// while the service contains the actual AI-related logic.
//
// We use this directly in the /test route below.
const { generateAIResponse } = require("../services/aiService");

// ============================================================
// MOVIE DNA ROUTE
// ============================================================

// POST /api/ai/movie-dna
//
// This route receives the user's movie preferences/history
// and sends them to createMovieDNA().
//
// Example request:
//
// POST /api/ai/movie-dna
//
// The actual logic is inside:
// controllers/movieDNAController.js
router.post("/movie-dna", createMovieDNA);

// ============================================================
// MOVIE RECOMMENDATION ROUTE
// ============================================================

// POST /api/ai/recommendations
//
// This route generates personalized movie recommendations.
//
// The actual recommendation logic is handled by:
// controllers/recommendationController.js
router.post("/recommendations", getRecommendations);

// ============================================================ 
// 
// MOOD → MOVIE ROUTE
// ============================================================

// POST /api/ai/mood
//
// This route receives the user's mood
// and returns movie recommendations based on that mood.
//
// Example: 
// mood = "sad"
// mood = "happy"
// mood = "thriller"
//
// The actual logic is inside: // 
// controllers/moodController.js 
router.post("/mood", getMoodRecommendations);

// ============================================================
// AI DOUBLE-FEATURE ROUTE
// ============================================================

// POST /api/ai/double-feature
//
// This route generates two movies that work well together
// as a double-feature.
// 
// Example:
// Movie 1 → Inception
// Movie 2 → Shutter Island
// 
// The actual logic is inside:
// controllers/doubleFeatureController.js
router.post("/double-feature", getDoubleFeature);


// ============================================================
// AI TEST ROUTE
// ============================================================

// GET /api/ai/test
//
// This is a simple route to check whether our AI service
// is working correctly.
//
// We use GET because we are simply testing the service
// and don't need to send data from the frontend.

router.get("/test", async (req, res) => { 
    try { 
        // Call our AI service. 
        //
        // generateAIResponse() sends the prompt to the
        // configured AI model and returns the response. 
        const result = await generateAIResponse(
            "Give me one short sentence explaining why Inception is an interesting movie." 
        );
        
        // If the AI request succeeds, // 
        // send a successful JSON response to the frontend. 
        res.json({
            success: true,
            response: result
        });
    } catch (error) {
        // If something goes wrong,
        // print the error in the backend terminal.
        console.error("AI Test Error:", error);
        
        // Send an error response to the frontend.
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================================
// MOVIE EXPLANATION ROUTE
// ============================================================

// POST /api/ai/explain
//
// This route is used when CineVerse needs to explain
// why a particular movie is recommended.
//
// The actual AI logic is inside:
// controllers/aiController.js
//
// Example:
//
// User → "Why should I watch Interstellar?"
//
// Frontend
//   ↓ 
// POST /api/ai/explain
//   ↓
// explainMovie()
//   ↓
// AI Service
//   ↓
// AI response

router.post("/explain", explainMovie);

// ============================================================
// EXPORT ROUTER
// ============================================================

// Export this router so that it can be used
// inside server.js / app.js.

module.exports = router;