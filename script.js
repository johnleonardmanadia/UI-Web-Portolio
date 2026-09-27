// Nav: scroll shadow + mobile toggle + active link highlight
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);

  let current = sections[0]?.id;
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// Works filter
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// Testimonial slider
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');
const slideCount = track.children.length;
let slideIndex = 0;

function updateSlide() {
  track.style.transform = `translateX(-${slideIndex * 100}%)`;
}
prevBtn.addEventListener('click', () => {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  updateSlide();
});
nextBtn.addEventListener('click', () => {
  slideIndex = (slideIndex + 1) % slideCount;
  updateSlide();
});

// Contact form (front-end only — connect to a backend or form service to send real messages)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    status.style.color = '#FF4433';
    status.textContent = 'Please fill in all required fields.';
    return;
  }
  status.style.color = '#4ADE80';
  status.textContent = 'Thanks — your message has been noted. (Connect this form to an email service to actually send it.)';
  form.reset();
});