

// Nav: scroll shadow + mobile toggle + active link highlight
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);

  let current = sections[0]?.id;
  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }),
);

// Works filter
const filterBtns = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    workCards.forEach((card) => {
      card.classList.toggle(
        "hidden",
        card.dataset.category !== filter
      );
    });
  });
});

// Testimonial slider
const track = document.getElementById("testimonialTrack");
const prevBtn = document.getElementById("testimonialPrev");
const nextBtn = document.getElementById("testimonialNext");
const dotsWrap = document.getElementById("testimonialDots");
const testimonialCards = Array.from(track.children);
const slideCount = testimonialCards.length;

const TESTIMONIAL_GAP = 24;

let slideIndex = 0;

function getVisibleCount() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function maxSlideIndex() {
  return Math.max(0, slideCount - getVisibleCount());
}

function buildDots() {
  if (!dotsWrap) return;

  dotsWrap.innerHTML = "";

  for (let i = 0; i <= maxSlideIndex(); i++) {
    const dot = document.createElement("button");

    dot.className = "testimonial-dot";
    dot.setAttribute(
      "aria-label",
      `Go to testimonial ${i + 1}`
    );

    dot.addEventListener("click", () => {
      slideIndex = i;
      updateSlide();
    });

    dotsWrap.appendChild(dot);
  }
}

function updateSlide() {
  const maxIndex = maxSlideIndex();

  slideIndex = Math.min(slideIndex, maxIndex);

  const cardWidth =
    testimonialCards[0].getBoundingClientRect().width;

  track.style.transform =
    `translateX(-${slideIndex * (cardWidth + TESTIMONIAL_GAP)}px)`;

  if (dotsWrap) {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        i === slideIndex
      );
    });
  }
}

prevBtn.addEventListener("click", () => {
  const max = maxSlideIndex();

  slideIndex =
    (slideIndex - 1 + max + 1) % (max + 1);

  updateSlide();
});

nextBtn.addEventListener("click", () => {
  const max = maxSlideIndex();

  slideIndex =
    (slideIndex + 1) % (max + 1);

  updateSlide();
});

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    buildDots();
    updateSlide();
  }, 150);
});

buildDots();
updateSlide();

// Contact form: send to Formspree via fetch (stay on the page, no redirect)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent =
          "Thanks! Your message was sent. I'll get back to you soon.";
        formStatus.classList.add("success");
      } else {
        const data = await response.json().catch(() => ({}));
        formStatus.textContent =
          data.errors?.map((err) => err.message).join(", ") ||
          "Oops! Something went wrong. Please try again.";
        formStatus.classList.add("error");
      }
    } catch (err) {
      formStatus.textContent =
        "Network error. Please check your connection and try again.";
      formStatus.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}