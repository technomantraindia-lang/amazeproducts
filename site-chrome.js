/* Shared site header and footer. Keep global navigation and contact details in one place. */
(() => {
  if (!document.getElementById('shared-footer-styles')) {
    const sharedFooterStyles = document.createElement('style');
    sharedFooterStyles.id = 'shared-footer-styles';
    sharedFooterStyles.textContent = `
      .main-footer.site-footer { display: block; position: static; }
      .main-footer.site-footer .footer-brand { display: block; margin-bottom: 20px; }
      .main-footer.site-footer .footer-logo { width: 90px; height: 90px; filter: none; }
    `;
    document.head.appendChild(sharedFooterStyles);
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    ['index.html', 'Home'],
    ['about.html', 'About Us'],
    ['industries.html', 'Industries'],
    ['why-choose-us.html', 'Why Choose Us'],
    ['products.html', 'Products <i class="fas fa-chevron-down" aria-hidden="true"></i>'],
    ['certifications.html', 'Certifications'],
    ['contact-us.html', 'Contact Us']
  ];

  const navigation = links.map(([href, label]) => {
    const isActive = href === page || (page === 'index.html' && href === 'index.html');
    return `<a href="${href}" class="nav-link${isActive ? ' active' : ''}">${label}</a>`;
  }).join('');

  const topBar = `
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-contact">
          <div class="top-bar-item top-bar-message">Building Safer, More Joyful Water Experiences Worldwide</div>
          <div class="top-bar-item"><i class="fas fa-phone-alt"></i><a href="tel:9833594449">9833594449</a> / <a href="tel:9833494449">9833494449</a></div>
          <div class="top-bar-item"><i class="fas fa-envelope"></i><a href="mailto:sales@amazeproducts.co.in">sales@amazeproducts.co.in</a></div>
          <div class="top-bar-item"><i class="fas fa-envelope-open"></i><a href="mailto:amazellp@gmail.com">amazellp@gmail.com</a></div>
        </div>
        <div class="top-bar-social">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>`;

  const header = document.querySelector('header');
  if (header) {
    const existingTopBar = document.querySelector('.top-bar');
    if (existingTopBar) existingTopBar.outerHTML = topBar;
    else header.insertAdjacentHTML('beforebegin', topBar);
    header.className = 'main-header';
    header.innerHTML = `
      <div class="container">
        <a href="index.html" class="logo-link"><img src="assets/logo.png" alt="Amaze Products Logo" class="logo-img"></a>
        <nav class="nav-menu" id="navMenu" aria-label="Main navigation">${navigation}</nav>
        <a href="contact-us.html#message" class="btn btn-primary">Get a Quote <i class="fas fa-arrow-right"></i></a>
        <button class="mobile-toggle" id="mobileToggle" aria-label="Open navigation"><i class="fas fa-bars"></i></button>
      </div>`;

    const mobileToggle = header.querySelector('#mobileToggle');
    const navMenu = header.querySelector('#navMenu');
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.querySelector('i').className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.querySelector('i').className = 'fas fa-bars';
    }));
  }

  // Every header quote button opens the same working quote form, regardless
  // of the page from which it is clicked.
  document.addEventListener('click', event => {
    const quoteButton = event.target.closest('header a, header button');
    if (!quoteButton || !quoteButton.textContent.includes('Get a Quote')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = 'contact-us.html#message';
  }, true);

  const footer = document.querySelector('footer');
  if (footer) {
    footer.className = 'main-footer site-footer';
    footer.id = 'contact';
    // Certifications previously used unscoped `footer` styles; these preserve
    // the shared layout when that page's stylesheet is present.
    footer.style.display = 'block';
    footer.style.position = 'static';
    footer.innerHTML = `
      <div class="container"><div class="footer-grid">
        <div>
          <div class="footer-brand"><img src="assets/logo.png" alt="Amaze Products Logo" class="footer-logo"><h4>Amaze Products</h4><p>Waterparks. People. A Brighter Tomorrow.</p></div>
          <p class="footer-desc">Leading manufacturer and supplier of heavy-duty PVC water slide tubes, rafts, racer mats, and custom aquatic inflatables.</p>
          <div class="footer-social"><a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a><a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a><a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a><a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a></div>
        </div>
        <div><h4 class="footer-col-title">ADDRESS</h4><div class="footer-info-list"><div class="footer-info-item"><i class="fas fa-map-marker-alt"></i><div><strong>Reg. Office:</strong> B-1 Rita Palace, Chandavakar Road, Borivali West, Mumbai 400092</div></div><div class="footer-info-item"><i class="fas fa-industry"></i><div><strong>Gala No. 17,</strong> Sonal Industrial Estate, Tungarreshwar, Sativali Highway, Vasai East</div></div></div></div>
        <div><h4 class="footer-col-title">CONTACT US</h4><div class="footer-info-list"><div class="footer-info-item"><i class="fas fa-phone-alt"></i><div><a href="tel:9833594449">9833594449</a> / <a href="tel:9833494449">9833494449</a></div></div><div class="footer-info-item"><i class="fas fa-envelope"></i><div><a href="mailto:sales@amazeproducts.co.in">sales@amazeproducts.co.in</a></div></div><div class="footer-info-item"><i class="fas fa-envelope-open"></i><div><a href="mailto:amazellp@gmail.com">amazellp@gmail.com</a></div></div></div></div>
        <div><h4 class="footer-col-title">QUICK LINKS</h4><div class="footer-links-list"><a href="index.html">Home</a><a href="about.html">About Us</a><a href="products.html">Products</a><a href="why-choose-us.html">Why Choose Us</a><a href="industries.html">Industries</a><a href="certifications.html">Certifications</a><a href="contact-us.html">Contact Us</a></div></div>
      </div></div>
      <div class="sub-footer"><div class="container"><div>&copy; 2025 Amaze Products. All Rights Reserved.</div><div>Waterparks. People. A Brighter Tomorrow.</div></div></div>`;
    footer.querySelector('.footer-logo').style.filter = 'none';
  }
})();
