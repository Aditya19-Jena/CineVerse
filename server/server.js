const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log(
    "OpenAI API key loaded:",
    Boolean(process.env.OPENAI_API_KEY)
);

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CineVerse API is running"
    });
});

const aiRoutes = require("./routes/aiRoutes");
const movieRoutes = require("./routes/movieRoutes");

app.use("/api/ai", aiRoutes);
app.use("/api/movies", movieRoutes);

app.listen(PORT, () => {
    console.log(
        `CineVerse server running on http://localhost:${PORT}`
    );
});