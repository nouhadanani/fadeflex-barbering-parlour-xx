/* ===========================
   FADEFLEX BARBERING PARLOUR
   script.js — Main JavaScript
   =========================== */

// =============================================
// 1. NAVBAR — Scroll effect + Mobile toggle
// =============================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      // Keep scrolled on product page (it always has scrolled class)
      if (!navbar.classList.contains('scrolled-initial')) {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();


// =============================================
// 2. SCROLL REVEAL — Animate elements on scroll
// =============================================
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.fs-card, .service-card, .about-left, .about-right, .ci-item');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();


// =============================================
// 3. TESTIMONIAL SLIDER
// =============================================
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  const track = document.getElementById('testiTrack');
  const dots = document.querySelectorAll('.testi-dots .dot');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  currentSlide = Math.max(0, Math.min(index, cards.length - 1));

  track.scrollTo({
    left: currentSlide * track.clientWidth,
    behavior: 'smooth'
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

(function initTestimonials() {
  const track = document.getElementById('testiTrack');
  if (!track) return;

  // Auto-advance
  slideInterval = setInterval(() => {
    const cards = track.querySelectorAll('.testi-card');
    const next = (currentSlide + 1) % cards.length;
    goToSlide(next);
  }, 5000);

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(slideInterval));
  track.addEventListener('mouseleave', () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      const cards = track.querySelectorAll('.testi-card');
      const next = (currentSlide + 1) % cards.length;
      goToSlide(next);
    }, 5000);
  });

  // Touch/swipe support
  let touchStart = 0;
  track.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const cards = track.querySelectorAll('.testi-card');
      if (diff > 0) goToSlide(Math.min(currentSlide + 1, cards.length - 1));
      else goToSlide(Math.max(currentSlide - 1, 0));
    }
  }, { passive: true });
})();


// =============================================
// 4. CONTACT FORM — Validation & Submission
// =============================================
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Show loading state
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate form submission
    setTimeout(() => {
      btn.textContent = '✓ Booking Request Sent!';
      btn.style.background = '#2a6e2a';
      btn.style.borderColor = '#2a6e2a';
      btn.style.color = '#fff';

      // Reset after 4 seconds
      setTimeout(() => {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 4000);
    }, 1500);
  });
})();


// =============================================
// 5. SERVICE FILTER — Product page tabs
// =============================================
(function initServiceFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      serviceCards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), i * 60);
        } else {
          card.classList.add('hidden');
          card.classList.remove('visible');
        }
      });
    });
  });
})();


// =============================================
// 6. SMOOTH SCROLL for anchor links
// =============================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });
})();


// =============================================
// 7. ACTIVE NAV LINK on scroll (index page)
// =============================================
(function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();


// =============================================
// 8. GALLERY items — subtle parallax tilt
// =============================================
(function initGalleryTilt() {
  const gItems = document.querySelectorAll('.g-item');
  if (!gItems.length) return;

  gItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      item.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
})();


// =============================================
// 9. PRICE TABLE — highlight on hover
// =============================================
(function initPriceTable() {
  const rows = document.querySelectorAll('.price-table tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(201,168,76,0.06)';
    });
    row.addEventListener('mouseleave', () => {
      if (!row.classList.contains('highlight-row')) {
        row.style.background = '';
      }
    });
  });
})();


// =============================================
// 10. PAGE LOAD — entry animation
// =============================================
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Also handle immediate display if load already fired
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }
})();


// =============================================
// 11. IMAGE FALLBACKS — graceful error handling
// =============================================
(function initImageFallbacks() {
  // Hero background image fallback
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    heroBgImg.addEventListener('error', () => {
      heroBgImg.style.display = 'none';
      // Restore original radial gradient background
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.background =
          'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.07) 0%, transparent 70%), #0A0A0A';
      }
    });
  }

  // Page hero background image fallback (product page)
  const pageHeroBg = document.querySelector('.page-hero-bg-img');
  if (pageHeroBg) {
    pageHeroBg.addEventListener('error', () => {
      pageHeroBg.style.display = 'none';
    });
  }

  // About image fallback — show placeholder div if image fails
  const aboutImg = document.querySelector('.about-img');
  if (aboutImg) {
    aboutImg.addEventListener('error', () => {
      aboutImg.style.display = 'none';
      const placeholder = document.querySelector('.about-img-placeholder');
      if (placeholder) placeholder.style.display = 'flex';
    });
  }

  // Gallery image fallbacks — show a gold-tinted gradient if image is missing
  document.querySelectorAll('.g-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  // Service card image fallbacks
  document.querySelectorAll('.sc-img').forEach(img => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.sc-img-wrap');
      if (wrap) {
        wrap.style.background =
          'linear-gradient(135deg, rgba(201,168,76,0.08), #181818)';
        // Show a scissors icon as placeholder
        wrap.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;opacity:0.25;">✂</div>';
      }
    });
  });

  // Client avatar image fallbacks — show initials if photo missing
  document.querySelectorAll('.avatar-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      // Initials span is already behind the image as fallback
    });
  });
})();