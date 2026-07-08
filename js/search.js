/* ============================================================
   SkillVault — search.js
   Debounced search input that filters the course grid rendered
   by courses.js via the shared window.SVCourses interface.
   ============================================================ */

(function () {
  'use strict';

  const input = document.getElementById('courseSearch');
  if (!input) return;

  let debounceTimer = null;

  function applySearch(value) {
    if (window.SVCourses && typeof window.SVCourses.setQuery === 'function') {
      window.SVCourses.setQuery(value);
    }
  }

  input.addEventListener('input', (e) => {
    const value = e.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applySearch(value), 200);
  });

  // Support "/" as a quick focus shortcut, a small power-user touch.
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });

  // Clear on Escape when focused.
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      applySearch('');
      input.blur();
    }
  });
})();
