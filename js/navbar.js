/* ============================================================
   SkillVault — navbar.js
   Mobile nav toggle, scroll shadow, active-link highlighting.
   ============================================================ */

(function () {
  'use strict';

  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  // --- Mobile menu toggle ---
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is tapped (mobile)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scrolled shadow / background state ---
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Highlight the active nav link based on current page ---
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
