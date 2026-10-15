/**
 * BOYMURODOV IBROHIMBEK - ILMIY MAQOLALAR VA ISHLAR PORTALI
 * Core JavaScript logic: Theme toggle, instant search, category filtering,
 * clipboard copy, fullscreen viewer.
 */

// Theme Handling
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('theme', target);
  updateThemeIcon(target);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  if (theme === 'light') {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
  } else {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
  }
}

// Copy URL to Clipboard with Toast
function copyLink(urlToCopy, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const targetUrl = urlToCopy || window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(targetUrl).then(() => {
      showToast('Havola nusxalandi: ' + targetUrl);
    }).catch(() => {
      fallbackCopy(targetUrl);
    });
  } else {
    fallbackCopy(targetUrl);
  }
}

function fallbackCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast('Havola nusxalandi: ' + text);
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    toast.innerHTML = `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg><span id="toast-text"></span>`;
    document.body.appendChild(toast);
  }
  
  const toastText = document.getElementById('toast-text');
  if (toastText) toastText.textContent = message;
  
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Search and Filter logic for index.html
function initSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.article-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const text = (card.textContent || '').toLowerCase();
      
      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = (!searchQuery || text.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResults = document.getElementById('no-results');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }
}

// Fullscreen Viewer Toggle
function toggleFullscreenViewer() {
  const frameWrap = document.querySelector('.viewer-frame-wrap');
  if (!frameWrap) return;

  if (!document.fullscreenElement) {
    if (frameWrap.requestFullscreen) {
      frameWrap.requestFullscreen();
    } else if (frameWrap.webkitRequestFullscreen) {
      frameWrap.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearchAndFilter();

  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});
