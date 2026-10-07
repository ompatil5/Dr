/* ==========================================================================
   Dr. Firdous Shaikh - Clinic & Personal Brand Website
   Main Interactive Engine (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Dr. Firdous Shaikh Website - Vanilla JS Engine Initialized.');

  // ==========================================
  // 1. Sticky Navbar Scroll Shrink & Active Route Highlight
  // ==========================================
  const navbar = document.querySelector('.navbar-custom');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');

  function checkNavbarScroll() {
    if (window.scrollY > 40) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', checkNavbarScroll);
  checkNavbarScroll();

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // 2. Pure Vanilla JS Hero Photo Slider (2-Second Auto Interval)
  // ==========================================
  const sliderEl = document.querySelector('#heroPhotoSlider');
  if (sliderEl) {
    const slides = sliderEl.querySelectorAll('.carousel-item');
    const indicators = sliderEl.querySelectorAll('.carousel-indicators button');
    const prevBtn = sliderEl.querySelector('.carousel-control-prev');
    const nextBtn = sliderEl.querySelector('.carousel-control-next');
    let currentIndex = 0;
    let slideTimer = null;
    const intervalTime = parseInt(sliderEl.getAttribute('data-bs-interval'), 10) || 2000; // 2 seconds delay

    function showSlide(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      indicators.forEach((ind, idx) => {
        if (idx === index) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });

      currentIndex = index;
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(nextSlide, intervalTime);
    }

    function stopAutoSlide() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    // Manual Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
        startAutoSlide();
      });
    }

    indicators.forEach((indicator, idx) => {
      indicator.addEventListener('click', function () {
        showSlide(idx);
        startAutoSlide();
      });
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
        startAutoSlide();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
        startAutoSlide();
      }
    }, { passive: true });

    // Start 1-second auto slider
    startAutoSlide();
  }

  // ==========================================
  // 3. Vanilla JS Animated Number Counter (Without hiding content)
  // ==========================================
  const doctorBioSection = document.getElementById('knowYourDoctor');
  const counterElements = document.querySelectorAll('.stat-box .number');
  let animatedCounters = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const targetText = counter.textContent.trim();
      const hasPlus = targetText.includes('+');
      const hasK = targetText.toLowerCase().includes('k');
      let targetNum = parseInt(targetText.replace(/[^0-9]/g, ''), 10);

      if (isNaN(targetNum)) return;

      let startNum = 0;
      const duration = 1200; // ms
      const stepTime = 30; // ms
      const steps = duration / stepTime;
      const increment = targetNum / steps;

      const timer = setInterval(() => {
        startNum += increment;
        if (startNum >= targetNum) {
          startNum = targetNum;
          clearInterval(timer);
        }
        let formatted = Math.floor(startNum).toString();
        if (hasK) formatted += 'k';
        if (hasPlus) formatted += '+';
        counter.textContent = formatted;
      }, stepTime);
    });
  }

  if (doctorBioSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedCounters) {
          animatedCounters = true;
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterObserver.observe(doctorBioSection);
  }

  // ==========================================
  // 4. Contact Form Submission Handling
  // ==========================================
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Anti-spam honeypot
      const honeypot = document.getElementById('website_hp');
      if (honeypot && honeypot.value !== '') {
        return false;
      }

      const nameInput = document.getElementById('patientName');
      const phoneInput = document.getElementById('patientPhone');
      const feedbackDiv = document.getElementById('formFeedback');

      if (!nameInput || !phoneInput) return;

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        if (feedbackDiv) {
          feedbackDiv.className = 'alert alert-danger mt-3 rounded-3';
          feedbackDiv.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> Please provide your Name and Phone Number.';
          feedbackDiv.classList.remove('d-none');
        }
        return;
      }

      if (feedbackDiv) {
        feedbackDiv.className = 'alert alert-success mt-3 rounded-3 shadow-sm';
        feedbackDiv.innerHTML = '<i class="fas fa-check-circle me-2 text-success"></i> <strong>Thank you, ' + escapeHTML(nameInput.value) + '!</strong> Your inquiry has been sent to Dr. Firdous Shaikh\'s clinic team. We will contact you shortly.';
        feedbackDiv.classList.remove('d-none');
      }

      contactForm.reset();
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ==========================================
  // 5. Floating Back-to-Top Button
  // ==========================================
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top-btn';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.setAttribute('title', 'Back to Top');
  backToTopBtn.setAttribute('aria-label', 'Back to Top');
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
