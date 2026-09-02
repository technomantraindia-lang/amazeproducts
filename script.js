/* ==========================================================================
   Amaze Products - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle.querySelector('i')) {
          mobileToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }

  // 2. Product Slider Navigation
  const slider = document.getElementById('productsSlider');
  const prevBtn = document.getElementById('prevProduct');
  const nextBtn = document.getElementById('nextProduct');

  if (slider && prevBtn && nextBtn) {
    const scrollAmount = 260;

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Touch/Drag scroll support
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // 3. Video Lightbox Modal
  const watchVideoBtn = document.getElementById('watchVideoBtn');
  const videoModal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const promoVideo = document.getElementById('promoVideo');

  if (watchVideoBtn && videoModal && modalClose && promoVideo) {
    watchVideoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.classList.add('active');
      promoVideo.play();
    });

    const closeModal = () => {
      videoModal.classList.remove('active');
      promoVideo.pause();
      promoVideo.currentTime = 0;
    };

    modalClose.addEventListener('click', closeModal);

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 4. Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Stat Counter Animation on Scroll
  const statNumbers = document.querySelectorAll('.stat-number, .sec-stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const targetText = counter.getAttribute('data-target') || counter.innerText;
      const targetNumber = parseInt(targetText.replace(/\D/g, ''));
      const suffix = targetText.replace(/[0-9]/g, '');
      
      if (!isNaN(targetNumber)) {
        let count = 0;
        const speed = Math.ceil(targetNumber / 40);
        
        const updateCount = () => {
          count += speed;
          if (count < targetNumber) {
            counter.innerText = count + suffix;
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = targetNumber + suffix;
          }
        };
        updateCount();
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  const statsBanner = document.querySelector('.stats-banner-card');
  if (statsBanner) {
    observer.observe(statsBanner);
  }

  // 6. Smart Auto-Hiding / Revealing Header on Scroll
  const mainHeader = document.querySelector('.main-header');
  let lastScrollY = window.scrollY;

  if (mainHeader) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY && (!navMenu || !navMenu.classList.contains('active'))) {
          // User is scrolling DOWN -> Hide Header
          mainHeader.classList.add('header-hidden');
        } else {
          // User is scrolling UP -> Show Header
          mainHeader.classList.remove('header-hidden');
        }
      } else {
        // At top of page -> Show Header
        mainHeader.classList.remove('header-hidden');
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }
});
