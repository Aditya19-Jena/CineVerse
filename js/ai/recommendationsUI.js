import {
    getPersonalizedRecommendations
} from "./recommendations.js";


// ========================================
// INIT RECOMMENDATIONS
// ========================================

export async function renderRecommendations(
    container
) {

    if (!container) return;


    // ------------------------------------
    // Loading
    // ------------------------------------

    showLoading(container);


    try {

        const result =
            await getPersonalizedRecommendations();


        // --------------------------------
        // No user data
        // --------------------------------

        if (
            !result.recommendations ||
            !result.recommendations.length
        ) {

            showEmptyState(container);

            return;
        }


        // --------------------------------
        // Render recommendations
        // --------------------------------

        renderRecommendationCards(
            container,
            result.recommendations,
            result.candidates
        );


    } catch (error) {

        console.error(
            "Recommendation UI error:",
            error
        );


        if (
            error.code ===
            "AI_QUOTA_EXCEEDED"
        ) {

            showUnavailableState(
                container
            );

            return;
        }


        showErrorState(container);

    }

}


// ========================================
// LOADING
// ========================================

function showLoading(container) {

    container.innerHTML = `

        <div class="ai-recommendation-loading">

            <div class="ai-loading-spinner"></div>

            <div>

                <strong>
                    Finding something you'll love...
                </strong>

                <p>
                    CineVerse is analyzing your Movie DNA.
                </p>

            </div>

        </div>

    `;

}


// ========================================
// EMPTY STATE
// ========================================

function showEmptyState(container) {

    container.innerHTML = `

        <div class="ai-recommendation-empty">

            <div class="recommendation-empty-icon">
                🎬
            </div>

            <h3>
                Your recommendations are still forming
            </h3>

            <p>
                Favorite a few movies and search for
                titles you enjoy. CineVerse will use
                your Movie DNA to personalize your picks.
            </p>

            <div class="recommendation-actions">

                <span>⭐ Favorite movies</span>

                <span>🔎 Search movies</span>

                <span>🎬 Explore titles</span>

            </div>

        </div>

    `;

}


// ========================================
// RENDER CARDS
// ========================================

function renderRecommendationCards(
    container,
    recommendations,
    candidates
) {

    const movieMap =
        new Map(
            candidates.map(
                movie => [
                    movie.id,
                    movie
                ]
            )
        );


    const cards =
        recommendations
            .slice(0, 5)
            .map(recommendation => {

                const movie =
                    movieMap.get(
                        Number(
                            recommendation.movieId
                        )
                    );


                if (!movie) {
                    return "";
                }


                const poster =
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "";


                const score =
                    Math.round(
                        recommendation.matchScore
                    );


                return `

                    <article
                        class="ai-recommendation-card movie-card"
                        data-movie-id="${movie.id}"
                    >

                        <div class="ai-recommendation-poster">

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


                            <div class="ai-match-badge">

                                ${score}%

                                <span>
                                    MATCH
                                </span>

                            </div>

                        </div>


                        <div class="ai-recommendation-info">

                            <h3>
                                ${escapeHTML(movie.title)}
                            </h3>


                            <div class="ai-recommendation-meta">

                                <span>
                                    ${
                                        movie.release_date
                                            ?.slice(0, 4) ||
                                        "N/A"
                                    }
                                </span>

                                <span>
                                    ★
                                    ${
                                        movie.vote_average
                                            ?.toFixed(1) ||
                                        "N/A"
                                    }
                                </span>

                            </div>


                            <p class="ai-recommendation-reason">

                                ${escapeHTML(
                                    recommendation.reason
                                )}

                            </p>


                            <span class="ai-best-for-tag">

                                ${escapeHTML(
                                    recommendation.bestFor
                                )}

                            </span>

                        </div>

                    </article>

                `;

            })
            .join("");


    container.innerHTML = `

        <div class="ai-recommendation-grid">

            ${cards}

        </div>

    `;

}


// ========================================
// UNAVAILABLE
// ========================================

function showUnavailableState(container) {

    container.innerHTML = `

        <div class="ai-recommendation-empty">

            <div class="recommendation-empty-icon">
                ✨
            </div>

            <h3>
                CineVerse AI is temporarily unavailable
            </h3>

            <p>
                Your personalized recommendations will
                appear here when the AI service is available.
            </p>

        </div>

    `;

}


// ========================================
// ERROR
// ========================================

function showErrorState(container) {

    container.innerHTML = `

        <div class="ai-recommendation-empty">

            <div class="recommendation-empty-icon">
                ⚠️
            </div>

            <h3>
                Recommendations couldn't be generated
            </h3>

            <p>
                Something went wrong while creating
                your personalized recommendations.
            </p>

        </div>

    `;

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}