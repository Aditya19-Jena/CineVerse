// ========================================
// FAQ DATA
// ========================================

const faqData = [
  {
    question: "What is CineVerse?",
    answer:
      "CineVerse is a movie discovery platform that helps you explore trending, popular, and highly rated movies in one place."
  },
  {
    question: "Where does CineVerse get movie information?",
    answer:
      "CineVerse uses The Movie Database (TMDB) API to retrieve movie information such as posters, ratings, release dates, and popularity."
  },
  {
    question: "Can I search for a movie?",
    answer:
      "Yes. CineVerse will allow you to search for movies and explore detailed information about them."
  },
  {
    question: "Can I save movies to my favourites?",
    answer:
      "Yes. You can add movies to your favourites so you can easily find them later."
  },
  {
    question: "Are the movie ratings from CineVerse?",
    answer:
      "No. Movie ratings and other movie metadata are provided through TMDB."
  },
  {
    question: "Is CineVerse free to use?",
    answer:
      "Yes. CineVerse is designed as a free movie discovery platform."
  }
];

// ========================================
// INITIALIZE FAQ
// ========================================

function initFAQ() {
  const faqContainer = document.getElementById("faq");

  if (!faqContainer) {
    console.error("FAQ container not found!");
    return;
  }

  faqContainer.innerHTML = `
    <section class="faq-section">
      <div class="faq-header">
        <span class="section-label">
          Got Questions?
        </span>

        <h2 class="faq-title">
          Frequently Asked Questions
        </h2>

        <p class="faq-description">
          Everything you need to know about CineVerse.
        </p>
      </div>

      <div class="faq-list">
        ${faqData.map((faq, index) => `
            <div class="faq-item">
              <button class="faq-question" aria-expanded="false" data-index="${index}">
              
              <span>
                ${faq.question}
              </span>

              <i class="fa-solid fa-plus"></i>

              </button>
              
              <div class="faq-answer">
                <p>
                  ${faq.answer}
                </p>
              </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  // ========================================
  // FAQ ACCORDION
  // ========================================

  const questions = faqContainer.querySelectorAll(".faq-question");

  questions.forEach(question => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const icon = question.querySelector("i");
      const isActive = question.getAttribute("aria-expanded") === "true";

      // Close all other answers
      questions.forEach(otherQuestion => {
        const otherItem = otherQuestion.closest(".faq-item");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherIcon = otherQuestion.querySelector("i");

        otherQuestion.setAttribute("aria-expanded", "false");

        otherItem.classList.remove("active");
        otherAnswer.style.maxHeight = null;
        otherIcon.classList.remove("fa-minus");
        otherIcon.classList.add("fa-plus");
      });

      // Open or close the clicked answer

      if (!isActive) {
        question.setAttribute("aria-expanded", "true");
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      }
    });
  });
}

export default initFAQ;