/* Lightweight motion enhancements for the Industries page. */
(() => {
  const page = document.querySelector('.industries-page');
  if (!page) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    '.intro-section > *',
    '.sectors-section > .eyebrow, .sectors-section > h2',
    '.sector-grid article',
    '.benefits-section .section-title-row', '.benefit-grid article',
    '.process-section .section-title-row', '.process-grid article',
    '.impact-band',
    '.projects-section .section-title-row', '.project-grid article',
    '.cta-content > *', '.industries-page .main-footer'
  ];

  page.classList.add('industries-motion-ready');
  document.querySelectorAll(revealTargets.join(',')).forEach((element, index) => {
    element.classList.add('industry-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 85}ms`);
  });

  const showAll = () => document.querySelectorAll('.industry-reveal').forEach(el => el.classList.add('is-revealed'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px' });
  document.querySelectorAll('.industry-reveal').forEach(el => revealObserver.observe(el));

  const statBand = document.querySelector('.impact-band');
  const count = (element) => {
    const label = element.textContent.trim();
    const target = Number(label.replace(/\D/g, ''));
    const suffix = label.replace(/[0-9]/g, '');
    const duration = 1350;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  if (statBand) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      statBand.classList.add('stats-counted');
      statBand.querySelectorAll('.impact-grid strong').forEach(count);
      observer.disconnect();
    }, { threshold: 0.35 });
    statObserver.observe(statBand);
  }
})();
