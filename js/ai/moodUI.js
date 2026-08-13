import {
    getMoodRecommendations
} from "./moodEngine.js";


export function initMoodEngine() {

    const buttons =
        document.querySelectorAll(
            ".mood-btn"
        );


    const results =
        document.getElementById(
            "mood-results"
        );


    if (
        !buttons.length ||
        !results
    ) {
        return;
    }


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const mood =
                    button.dataset.mood;


                buttons.forEach(btn =>
                    btn.classList.remove(
                        "active"
                    )
                );


                button.classList.add(
                    "active"
                );


                await renderMoodResults(
                    results,
                    mood
                );

            }
        );

    });

}


async function renderMoodResults(
    container,
    mood
) {

    container.innerHTML = `

        <div class="mood-loading">

            <div class="ai-loading-spinner"></div>

            <div>

                <strong>
                    Finding your ${mood} movie...
                </strong>

                <p>
                    CineVerse is matching your mood
                    with your Movie DNA.
                </p>

            </div>

        </div>

    `;


    try {

        const result =
            await getMoodRecommendations(
                mood
            );


        if (
            !result.recommendations.length
        ) {

            container.innerHTML = `
                <div class="mood-empty">
                    No suitable movies found.
                </div>
            `;

            return;
        }


        renderResults(
            container,
            result
        );


    } catch (error) {

        console.error(
            "Mood UI error:",
            error
        );


        if (
            error.code ===
            "AI_QUOTA_EXCEEDED"
        ) {

            container.innerHTML = `

                <div class="mood-empty">

                    <div class="recommendation-empty-icon">
                        ✨
                    </div>

                    <h3>
                        CineVerse AI is temporarily unavailable
                    </h3>

                    <p>
                        Your mood engine will be available
                        when the AI service is back online.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = `

            <div class="mood-empty">

                <h3>
                    Something went wrong
                </h3>

                <p>
                    We couldn't generate mood-based
                    recommendations right now.
                </p>

            </div>

        `;

    }

}


function renderResults(
    container,
    result
) {

    const movieMap =
        new Map(
            result.candidates.map(
                movie => [
                    Number(movie.id),
                    movie
                ]
            )
        );


    const cards =
        result.recommendations
            .slice(0, 5)
            .map(item => {

                const movie =
                    movieMap.get(
                        Number(item.movieId)
                    );


                if (!movie) {
                    return "";
                }


                const poster =
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "";


                return `

                    <article
                        class="mood-result-card movie-card"
                        data-movie-id="${movie.id}"
                    >

                        <div class="mood-result-poster">

                            ${
                                poster
                                    ? `
                                        <img
                                            src="${poster}"
                                            alt="${escapeHTML(movie.title)}"
                                            loading="lazy"
                                        >
                                    `
                                    : `
                                        <div class="poster-placeholder">
                                            🎬
                                        </div>
                                    `
                            }

                            <span class="mood-score">
                                ${Math.round(item.matchScore)}%
                            </span>

                        </div>


                        <div class="mood-result-info">

                            <h3>
                                ${escapeHTML(movie.title)}
                            </h3>

                            <p>
                                ${escapeHTML(item.reason)}
                            </p>

                            <span>
                                ${escapeHTML(item.bestFor)}
                            </span>

                        </div>

                    </article>

                `;

            })
            .join("");


    container.innerHTML = `

        <div class="mood-results-header">

            <div>

                <span>
                    MOOD MATCH
                </span>

                <h3>
                    Movies for your ${escapeHTML(
                        result.mood || "current"
                    )} mood
                </h3>

            </div>

        </div>


        <div class="mood-results-grid">

            ${cards}

        </div>

    `;

}


function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}