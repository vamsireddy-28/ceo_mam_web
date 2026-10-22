document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initAwardFilters();
});
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');
  const navBackdrop = document.getElementById('navBackdrop');
  const navDrawerClose = document.getElementById('navDrawerClose');
  if (navToggle && navMenu) {
    const closeMobileMenu = () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };
    const openMobileMenu = () => {
      navMenu.classList.add('active');
      navToggle.classList.add('active');
      if (navBackdrop) navBackdrop.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
    if (navDrawerClose) {
      navDrawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
      });
    }
    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }
    navMenu.querySelectorAll('.nav-link, .btn-nav').forEach(el => {
      el.addEventListener('click', closeMobileMenu);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }
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
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  let animated = false;
  const runCounter = () => {
    statElements.forEach(el => {
      const target = +el.getAttribute('data-target');
      const duration = 1800;
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
function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const interest = document.getElementById('interest');
  const interestLabel = interest.options[interest.selectedIndex].text;
  const message = document.getElementById('message').value.trim();
  const originalButtonText = submitBtn.textContent;

  if (window.location.protocol === 'file:') {
    feedback.className = 'form-feedback error';
    feedback.textContent =
      'No email was sent because this page is open as a local file. Run the site with VS Code Live Server or `python -m http.server 8000`, then open http://localhost:8000 and submit again.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  fetch('https://formsubmit.co/ajax/hr@adhocnetwork.tech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      interest: interestLabel,
      message,
      _subject: `Website collaboration inquiry: ${interestLabel}`
    })
  })
    .then(async response => {
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = null;
      }

      if (!response.ok || !result || (result.success !== true && result.success !== 'true')) {
        const serviceMessage = result && typeof result.message === 'string'
          ? result.message
          : `The email service returned an unexpected response (HTTP ${response.status}).`;
        throw new Error(serviceMessage);
      }
      return result;
    })
    .then(() => {
      form.reset();
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Your message was sent successfully. Thank you for reaching out.';
    })
    .catch(error => {
      console.error('Contact form submission failed:', error);
      feedback.className = 'form-feedback error';
      const reason = error instanceof Error ? error.message : 'Unknown submission error.';
      feedback.textContent = `We could not send your message: ${reason}`;
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalButtonText;
    });
}
