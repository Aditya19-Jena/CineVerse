// ========================================
// SEARCH MODULE
// ========================================

import { searchMovies as searchMoviesAPI } from "../api.js";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const RECENT_SEARCHES_KEY = "cineverse_recent_searches";

// ========================================
// SAVE RECENT SEARCH
// ========================================

function saveRecentSearch(query) {

    const cleanQuery = query.trim();

    if (!cleanQuery) return;

    try {

        let searches =
            JSON.parse(
                localStorage.getItem(
                    RECENT_SEARCHES_KEY
                )
            ) || [];


        // Remove duplicate

        searches = searches.filter(
            item =>
                item.toLowerCase() !==
                cleanQuery.toLowerCase()
        );

        // Add newest first

        searches.unshift(cleanQuery);

        // Keep only last 10

        searches = searches.slice(0, 10);

        localStorage.setItem(
            RECENT_SEARCHES_KEY,
            JSON.stringify(searches)
        );

    } catch (error) {

        console.error("Failed to save recent search:", error);

    }
}

// ========================================
// INITIALIZE SEARCH
// ========================================

export default function initSearch() {

    console.log("SEARCH MODULE STARTED");

    // ========================================
    // SEARCH ELEMENTS
    // ========================================

    const searchBtn = document.getElementById("searchBtn");

    const searchOverlay = document.getElementById("searchOverlay");

    const searchInput = document.getElementById("searchInput");

    const searchClose = document.getElementById("searchClose");

    const searchClear = document.getElementById("searchClear");

    const searchResults = document.getElementById("searchResults");

    const searchStatus = document.getElementById("searchStatus");

    // ========================================
    // VALIDATE ELEMENTS
    // ========================================

    if (
        !searchBtn ||
        !searchOverlay ||
        !searchInput ||
        !searchClose ||
        !searchClear ||
        !searchResults ||
        !searchStatus
    ) {

        console.error("SEARCH: Required elements not found!");

        return;

    }

    console.log("SEARCH ELEMENTS FOUND");

    // ========================================
    // SEARCH STATE
    // ========================================

    let searchTimeout = null;

    let currentQuery = "";

    let currentController = null;

    // ========================================
    // OPEN SEARCH
    // ========================================

    function openSearch() {

        searchOverlay.classList.add("active");

        document.body.classList.add("search-open");


        setTimeout(() => {

            searchInput.focus();

        }, 100);

    }

    // ========================================
    // CLOSE SEARCH
    // ========================================

    function closeSearch() {

        searchOverlay.classList.remove("active");

        document.body.classList.remove("search-open");

    }

    // ========================================
    // CLEAR SEARCH
    // ========================================

    function clearSearch() {

        searchInput.value = "";

        currentQuery = "";

        searchResults.innerHTML = "";


        searchClear.classList.remove(
            "visible"
        );


        searchStatus.classList.remove(
            "loading",
            "error"
        );


        searchStatus.innerHTML = `
            <span>
                Search for your favorite movies
            </span>
        `;


        searchInput.focus();

    }


    // ========================================
    // SEARCH MOVIES
    // ========================================

    async function searchMovies(query) {

        // ----------------------------------------
        // EMPTY QUERY
        // ----------------------------------------

        if (query.trim().length < 2) {

            searchResults.innerHTML = "";

            searchStatus.classList.remove("loading", "error");


            searchStatus.innerHTML = `
                <span>
                    Search for your favorite movies
                </span>
            `;

            return;

        }

        // ----------------------------------------
        // CANCEL PREVIOUS REQUEST
        // ----------------------------------------

        if (currentController) {

            currentController.abort();

        }

        currentController = new AbortController();

        // ----------------------------------------
        // LOADING STATE
        // ----------------------------------------

        searchStatus.classList.remove("error");

        searchStatus.classList.add("loading");

        searchStatus.innerHTML = `
            <span>
                Searching for "${escapeHTML(query)}"...
            </span>
        `;

        searchResults.innerHTML = `

            <div class="search-loading">

                <div class="search-spinner"></div>

            </div>

        `;

        // ----------------------------------------
        // API REQUEST
        // ----------------------------------------

        try {

            const results = await searchMoviesAPI(query, currentController.signal);

            saveRecentSearch(query);

            // ----------------------------------------
            // REMOVE LOADING
            // ----------------------------------------

            searchStatus.classList.remove("loading");

            // ----------------------------------------
            // NO RESULTS
            // ----------------------------------------

            if (!results.length) {

                showEmptyResults(query);

                return;

            }

            // ----------------------------------------
            // RESULTS FOUND
            // ----------------------------------------

            searchStatus.classList.remove(
                "error"
            );

            searchStatus.innerHTML = `
                <span>
                    ${results.length} results found
                </span>
            `;

            renderSearchResults(results);

        }


        // ----------------------------------------
        // ERROR
        // ----------------------------------------

        catch (error) {

            // Ignore cancelled requests

            if (
                error.name === "AbortError"
            ) {

                return;

            }


            console.error("SEARCH ERROR:",error);

            searchStatus.classList.remove("loading");

            searchStatus.classList.add("error");

            searchStatus.innerHTML = `
                <span>
                    Something went wrong.
                    Please try again.
                </span>
            `;

            searchResults.innerHTML = "";

        }

    }

    // ========================================
    // RENDER SEARCH RESULTS
    // ========================================

    function renderSearchResults(results) {

        searchResults.innerHTML = results

            .map(movie => {

                // ----------------------------------------
                // MOVIE INFORMATION
                // ----------------------------------------

                const title =
                    movie.title ||
                    "Unknown";


                const releaseDate =
                    movie.release_date ||
                    "";


                const year =
                    releaseDate
                        ? releaseDate.substring(0, 4)
                        : "N/A";


                const poster =
                    movie.poster_path
                        ? `${IMAGE_BASE_URL}${movie.poster_path}`
                        : null;


                // ----------------------------------------
                // MOVIE CARD
                // ----------------------------------------

                return `

                    <article

                        class="
                            search-card
                            movie-card
                        "

                        data-movie-id="${movie.id}"

                    >

                        ${
                            poster

                            ? `

                                <img

                                    class="
                                        search-card-poster
                                    "

                                    src="${poster}"

                                    alt="${escapeHTML(title)}"

                                    loading="lazy"

                                >

                            `

                            : `

                                <div

                                    class="
                                        search-card-poster
                                        search-no-poster
                                    "

                                >

                                    <i
                                        class="
                                            fa-solid
                                            fa-film
                                        "
                                    ></i>

                                </div>

                            `
                        }


                        <div
                            class="search-card-info"
                        >

                            <h3
                                class="search-card-title"
                            >
                                ${escapeHTML(title)}
                            </h3>


                            <span
                                class="search-card-year"
                            >
                                ${year}
                            </span>

                        </div>

                    </article>

                `;

            })

            .join("");

    }


    // ========================================
    // EMPTY RESULTS
    // ========================================

    function showEmptyResults(query) {

        searchStatus.classList.remove(
            "loading"
        );


        searchStatus.innerHTML = `
            <span>
                No results found
            </span>
        `;


        searchResults.innerHTML = `

            <div class="search-empty">

                <i
                    class="
                        fa-solid
                        fa-film
                    "
                ></i>


                <h3>
                    No movies found
                </h3>


                <p>

                    We couldn't find anything for

                    "<strong>
                        ${escapeHTML(query)}
                    </strong>"

                </p>

            </div>

        `;

    }


    // ========================================
    // ESCAPE HTML
    // ========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent = value;


        return div.innerHTML;

    }


    // ========================================
    // SEARCH BUTTON
    // ========================================

    searchBtn.addEventListener("click", openSearch);

    // ========================================
    // CLOSE BUTTON
    // ========================================

    searchClose.addEventListener("click", closeSearch);

    // ========================================
    // CLEAR BUTTON
    // ========================================

    searchClear.addEventListener("click", clearSearch);

    // ========================================
    // SEARCH INPUT
    // ========================================

    searchInput.addEventListener("input", () => {

            const query = searchInput.value.trim();

            currentQuery = query;

            // Show / hide clear button

            searchClear.classList.toggle(
                "visible",
                query.length > 0
            );


            // Cancel previous timer

            clearTimeout(searchTimeout);


            // Wait before API request

            searchTimeout = setTimeout(() => {

                    searchMovies(query);

                }, 400);

        }
    );


    // ========================================
    // ESC KEY
    // ========================================

    document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" && searchOverlay.classList.contains("active")
            ) {

                closeSearch();

            }

        }
    );

    // ========================================
    // SEARCH MODULE READY
    // ========================================

    console.log("SEARCH MODULE READY");

}