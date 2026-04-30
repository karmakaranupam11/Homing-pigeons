/**
 * theme.js — shared dark/light mode manager
 * Reads from localStorage, applies [data-theme] on <html>,
 * and wires up every .theme-toggle button on the page.
 */

(function () {
  const STORAGE_KEY = 'hp-theme';
  const html = document.documentElement;

  // Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
  }

  function getTheme() {
    return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggle() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // Wire buttons after DOM is ready
  function wireButtons() {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', toggle);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }
})();
