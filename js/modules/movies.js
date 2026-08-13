// ========================================
// Movie API Functionality
// ========================================

const API_KEY = "6959e539d352dad1e9cf62ec6f3d8f85"; 
const BASE_URL = "https://api.themoviedb.org/3";

// ========================================
// Get Trending Movies
// ========================================

async function getTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Fetched trending movies:", data.results);

    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    
    return [];
  }
}

// ========================================
// Display Trending Movies
// ========================================

function displayTrendingMovies(movies) {
  const grid = document.querySelector(".trending-grid");

  if (!grid) {
    console.error("Trending grid container not found!");
    return;
  }

  grid.innerHTML = "";

  movies.slice(0, 10).forEach(movie => {
    const card = document.createElement("article");

    card.className = "movie-card";
    card.dataset.movieId = movie.id;

    console.log("Creating card:", movie.title, movie.id);

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">

      <div class = "movie-info">
        <h3 class = "movie-title">
          ${movie.title}
        </h3>

        <div class = "movie-meta">
          <span>
            ${movie.release_date?.slice(0, 4) || "N/A"}
          </span>

          <span class = "movie-rating">
            <i class="fa-solid fa-star"></i>
              ${movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Main function to initialize the movies module

async function initMovies() {
  const trending = document.getElementById("trending-movies");

  console.log("Movies module loaded");

  if (!trending) {
    console.error("Trending movies container not found!");
    return;
  }

  trending.innerHTML= `
    <section class = "trending-section">
      <div class="section-header">
        <div>
          <span class="section-label">
            What's Trending
          </span>

          <h2 class="section-title">
            Trending Movies
          </h2>
        </div>

        <button class="view-all-btn">
          View All
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div class="trending-grid">
        <!-- Movie cards will be generated here -->
      </div>
    </section>
  `;

  // Fetch movies
  const movies = await getTrendingMovies();

  // Display movies
  displayTrendingMovies(movies);
}

export default initMovies;
