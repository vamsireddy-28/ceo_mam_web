document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initAwardFilters();
});

/* 1. Mobile Menu Toggle & Sticky Nav */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Scroll effect on navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      navbar.style.background = 'rgba(10, 14, 23, 0.92)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(10, 14, 23, 0.75)';
    }
  });
}

/* 2. Interactive Stats Counter Animation */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounter = () => {
    statElements.forEach(el => {
      const target = +el.getAttribute('data-target');
      const duration = 1800; // ms
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.innerText = target.toLocaleString();
          clearInterval(timer);
        } else {
          el.innerText = Math.ceil(current).toLocaleString();
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounter();
      }
    });
  }, { threshold: 0.4 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    observer.observe(heroStats);
  }
}

/* 3. Awards & Honors Filter Logic */
function initAwardFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const awardCards = document.querySelectorAll('.award-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      awardCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* 4. Contact Form Submission Simulation */
function handleFormSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  const originalText = submitBtn.innerText;
  submitBtn.innerText = 'Sending Inquiries...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerText = 'Message Delivered ✔';
    feedback.className = 'form-feedback success';
    feedback.innerText = 'Thank you! Your executive inquiry has been recorded. Our office will connect with you shortly.';

    document.getElementById('contactForm').reset();

    setTimeout(() => {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
      feedback.innerText = '';
    }, 4500);
  }, 1200);
}