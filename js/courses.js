/* ============================================================
   SkillVault — courses.js
   Loads data/courses.json and renders the category chips and
   course cards on courses.html. Exposes window.SVCourses so
   search.js can apply filters on top of the same dataset.
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('courseGrid');
  const chipRow = document.getElementById('chipRow');
  const resultsMeta = document.getElementById('resultsMeta');

  if (!grid) return; // Not on the courses page.

  const state = {
    all: [],
    categories: [],
    activeCategory: 'all',
    query: '',
  };

  const iconCache = {};

  async function loadIcon(path) {
    if (iconCache[path]) return iconCache[path];
    try {
      const res = await fetch(path);
      const svgText = await res.text();
      iconCache[path] = svgText;
      return svgText;
    } catch (err) {
      return '';
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function courseCardHtml(course) {
    const tags = course.tags.map((t) => `<span>#${escapeHtml(t)}</span>`).join('');
    return `
      <article class="course-card card-pop" data-id="${course.id}">
        <div class="row-top">
          <span class="badge">${escapeHtml(course.level)}</span>
          <span class="badge" style="color:var(--accent-gold); border-color: var(--accent-gold-soft, var(--border-strong));">${escapeHtml(course.category)}</span>
        </div>
        <h3>${escapeHtml(course.title)}</h3>
        <p class="desc">${escapeHtml(course.description)}</p>
        <div class="tags">${tags}</div>
        <div class="meta-row">
          <span>\uD83D\uDCFC ${course.lessons} lessons</span>
          <span>\u23F1 ${course.hours}h</span>
        </div>
        <a class="drive-btn" href="${course.driveLink}" target="_blank" rel="noopener noreferrer">
          Open playlist in Drive \u2197
        </a>
      </article>
    `;
  }

  function render() {
    const q = state.query.trim().toLowerCase();

    const filtered = state.all.filter((course) => {
      const matchesCategory = state.activeCategory === 'all' || course.category === state.activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [course.title, course.description, course.category, ...course.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    if (resultsMeta) {
      resultsMeta.textContent = `${filtered.length} playlist${filtered.length === 1 ? '' : 's'} found`;
    }

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No playlists match yet</h3>
          <p>Try a different keyword, or clear the category filter to see everything in the vault.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(courseCardHtml).join('');
  }

  function renderChips() {
    if (!chipRow) return;
    const allChip = `<button class="chip is-active" data-category="all" type="button">All playlists</button>`;
    const chips = state.categories
      .map((cat) => `<button class="chip" data-category="${cat.id}" type="button">${escapeHtml(cat.label)}</button>`)
      .join('');
    chipRow.innerHTML = allChip + chips;

    chipRow.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        state.activeCategory = chip.dataset.category;
        render();
      });
    });
  }

  async function init() {
    grid.innerHTML = Array.from({ length: 6 }).map(() => '<div class="skeleton"></div>').join('');

    try {
      const res = await fetch('data/courses.json');
      if (!res.ok) throw new Error('Failed to load courses.json');
      const data = await res.json();

      state.all = data.courses || [];
      state.categories = data.categories || [];

      // Populate the "browse the drive folder" link wherever it appears.
      document.querySelectorAll('[data-drive-root]').forEach((el) => {
        el.href = data.driveRoot;
      });

      renderChips();
      render();
    } catch (err) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>Playlists couldn\u2019t load</h3>
          <p>Check that data/courses.json is reachable, then refresh the page.</p>
        </div>
      `;
      console.error(err);
    }
  }

  // Exposed so search.js can update the query and re-render.
  window.SVCourses = {
    setQuery(value) {
      state.query = value;
      render();
    },
    getState: () => state,
  };

  init();
})();
