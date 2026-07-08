/* ============================================================
   SkillVault — app.js
   Shared utilities used across every page: scroll reveal,
   back-to-top control, footer year, hero dial ticks, toast
   notifications, and the contact form handler.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      revealTargets.forEach((el) => observer.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero vault-dial ticks (24 marks around the ring) ---------- */
  const ring = document.querySelector('.vault-ring');
  if (ring) {
    const total = 24;
    for (let i = 0; i < total; i++) {
      const tick = document.createElement('span');
      tick.className = 'tick';
      tick.style.transform = `rotate(${(360 / total) * i}deg)`;
      if (i % 6 === 0) tick.style.opacity = '1';
      ring.appendChild(tick);
    }
  }

  /* ---------- Drive root links (footer / nav on every page) ---------- */
  const driveLinks = document.querySelectorAll('[data-drive-root]');
  if (driveLinks.length && !document.getElementById('courseGrid')) {
    // courses.html sets these itself once it loads the full dataset;
    // every other page just needs the root folder link.
    fetch('data/courses.json')
      .then((res) => res.json())
      .then((data) => {
        driveLinks.forEach((el) => { el.href = data.driveRoot; });
      })
      .catch(() => {
        driveLinks.forEach((el) => { el.removeAttribute('target'); });
      });
  }

  /* ---------- Toast helper (exposed for other scripts) ---------- */
  function ensureToastHost() {
    let host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      host.style.position = 'fixed';
      host.style.top = '20px';
      host.style.right = '20px';
      host.style.zIndex = '999';
      host.style.display = 'flex';
      host.style.flexDirection = 'column';
      host.style.gap = '10px';
      document.body.appendChild(host);
    }
    return host;
  }

  function showToast(message, type = 'success') {
    const host = ensureToastHost();
    const el = document.createElement('div');
    el.className = 'toast';
    el.style.padding = '14px 18px';
    el.style.borderRadius = '10px';
    el.style.fontSize = '0.88rem';
    el.style.maxWidth = '320px';
    el.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
    el.style.border = '1px solid ' + (type === 'success' ? '#34D399' : '#E5484D');
    el.style.background = type === 'success' ? 'rgba(52,211,153,0.14)' : 'rgba(229,72,77,0.14)';
    el.style.color = type === 'success' ? '#34D399' : '#E5484D';
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 3600);
  }

  window.SVToast = { show: showToast };

  /* ---------- Contact form handling ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      subject: contactForm.querySelector('#subject'),
      message: contactForm.querySelector('#message'),
    };
    const statusBox = document.getElementById('formStatus');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      const wrapper = field.closest('.field');
      const errorEl = wrapper.querySelector('.error-msg');
      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(field) {
      const wrapper = field.closest('.field');
      wrapper.classList.remove('has-error');
    }

    function validate() {
      let valid = true;

      if (!fields.name.value.trim()) {
        setError(fields.name, 'Tell us your name.');
        valid = false;
      } else {
        clearError(fields.name);
      }

      if (!fields.email.value.trim()) {
        setError(fields.email, 'Enter an email address.');
        valid = false;
      } else if (!emailPattern.test(fields.email.value.trim())) {
        setError(fields.email, 'That email address doesn\u2019t look right.');
        valid = false;
      } else {
        clearError(fields.email);
      }

      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        setError(fields.message, 'Add a few more details (10+ characters).');
        valid = false;
      } else {
        clearError(fields.message);
      }

      return valid;
    }

    ['input', 'blur'].forEach((evt) => {
      Object.values(fields).forEach((field) => {
        if (!field) return;
        field.addEventListener(evt, () => {
          if (field.closest('.field').classList.contains('has-error')) validate();
        });
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        if (statusBox) {
          statusBox.textContent = 'Please fix the highlighted fields before sending.';
          statusBox.className = 'form-status fail is-visible';
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending\u2026';

      // No backend is wired up yet — this simulates a send so the
      // interface can be demoed end to end. Replace with a real
      // endpoint (e.g. Formspree, a Cloud Function) when ready.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        contactForm.reset();
        if (statusBox) {
          statusBox.textContent = 'Message received \u2014 we usually reply within two business days.';
          statusBox.className = 'form-status success is-visible';
        }
        showToast('Your message is on its way to us.', 'success');
      }, 900);
    });
  }

  /* ---------- FAQ accordion (about / contact pages) ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const trigger = item.querySelector('h4');
    const body = item.querySelector('p');
    if (!trigger || !body) return;
    trigger.style.cursor = 'pointer';
  });
})();
