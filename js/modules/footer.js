// ========================================
// INITIALIZE FOOTER
// ========================================

function initFooter() {
  const footer = document.getElementById("footer");

  if (!footer) {
    console.error("Footer container not found!");
      return;
  }

  footer.innerHTML = `
    <footer class = "site-footer">
      <div class = "footer-container">
        <!-- Brand -->
        <div class="footer-brand">
          <a href="#" class="footer-logo" aria-label="CineVerse Home">
    <span class="logo-main">Cine</span><span class="logo-accent">Verse</span>
</a>

          <p class="footer-description">
            Discover trending movies, explore popular titles, and find your next favorite movie.
          </p>
        </div>

        <!-- Explore -->
        <div class="footer-column">
          <h3> Explore </h3>

          <a href="#trending-movies">
            Trending
          </a>

          <a href="#popular-movies">
            Popular
          </a>

          <a href="#">
            Top Rated
          </a>

                    <a href="#">
                        Upcoming
                    </a>

        </div>

        <!-- Company -->
          <div class="footer-column">
            <h3>Company</h3>

            <a href="#">
              About
            </a>

                    <a href="#">
                        Privacy
                    </a>

                    <a href="#">
                        Terms
                    </a>

                </div>


                <!-- Support -->

                <div class="footer-column">

                    <h3>Support</h3>

                    <a href="#faq">
                        FAQ
                    </a>

                    <a href="#">
                        Contact
                    </a>

                    <a href="#">
                        Help Center
                    </a>

                </div>


                <!-- Social -->

                <div class="footer-column">

                    <h3>Follow Us</h3>

                    <div class="footer-social">

                        <a href="#" aria-label="Instagram">
                            <i class="fa-brands fa-instagram"></i>
                        </a>

                        <a href="#" aria-label="Twitter">
                            <i class="fa-brands fa-x-twitter"></i>
                        </a>

                        <a href="#" aria-label="GitHub">
                            <i class="fa-brands fa-github"></i>
                        </a>

                    </div>

                </div>

            </div>


      <!-- Bottom -->
      <div class="footer-bottom">
        <p>
          © 2026 CineVerse. All rights reserved.
        </p>

        <p>
          Made by Aditya
        </p>
      </div>
    </footer>
  `;
}

export default initFooter;