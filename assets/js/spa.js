/* =======================================================
   spa.js – Mini-SPA mit Cache, Auto-Refresh & Tages-Reset
   Version 4.0 – ERIK-Fit 🚀
   ======================================================= */

const contentContainer = document.querySelector('main.content');
const preloader = document.getElementById('preloader');

// 🧠 Cache: speichert HTML + Zeitstempel
const pageCache = new Map();
const CACHE_LIFETIME = 30 * 60 * 1000; // 30 Minuten in Millisekunden
const CACHE_RESET_DAYS = 1; // nach wie vielen Tagen alles gelöscht wird

/** 🧹 Alte Caches automatisch löschen, wenn Tag gewechselt hat */
function clearCacheIfExpired() {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('lastVisitDay');
  if (lastVisit !== today) {
    pageCache.clear();
    localStorage.setItem('lastVisitDay', today);
    console.log('🧹 Cache automatisch gelöscht – neuer Tag:', today);
  }
}
// Beim Laden prüfen
clearCacheIfExpired();

/** Seite laden (mit Cache und Auto-Refresh) */
async function loadPage(url, addToHistory = true) {
  try {
    preloader.classList.remove('hidden');
    document.body.classList.add('loading');
    document.documentElement.style.visibility = 'hidden';

    // 🧠 Prüfen: Ist Seite im Cache und noch frisch?
    const cached = pageCache.get(url);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_LIFETIME) {
      await renderPage(cached.html, url, addToHistory);
      hidePreloader();
      return;
    }

    // ⏳ Wenn Cache fehlt oder alt → neu laden
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Fehler beim Laden von ${url}`);
    const html = await response.text();

    // 💾 Im Cache speichern (mit neuem Zeitstempel)
    pageCache.set(url, { html, timestamp: now });

    await renderPage(html, url, addToHistory);
  } catch (err) {
    console.error('❌ Fehler beim Laden:', err);
    contentContainer.innerHTML = `<p style="padding:2rem;color:red;">Fehler beim Laden der Seite.</p>`;
  } finally {
    hidePreloader();
  }
}

/** Inhalt anzeigen + sanft ein-/ausblenden */
async function renderPage(html, url, addToHistory) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const newMain = doc.querySelector('main.content');
  if (!newMain) return;

  contentContainer.classList.add('fade-out');
  await new Promise(res => setTimeout(res, 100));

  contentContainer.innerHTML = newMain.innerHTML;

  if (addToHistory) history.pushState(null, '', url);

  initSidebarActive();
  window.scrollTo(0, 0);

  contentContainer.classList.remove('fade-out');
  contentContainer.classList.add('fade-in');
  setTimeout(() => contentContainer.classList.remove('fade-in'), 400);
}

/** Preloader sanft ausblenden */
function hidePreloader() {
  setTimeout(() => {
    preloader?.classList.add('hidden');
    document.body.classList.remove('loading');
    document.documentElement.style.visibility = 'visible';
  }, 200);
}

/** Klicks auf interne Links abfangen */
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-link]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return;

  // 🚫 Wenn aktuelle Seite → nicht neu laden
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const target = href.toLowerCase();
  if (target === current) {
    e.preventDefault();
    const active = document.querySelector('.sidebar a.active');
    if (active) {
      active.classList.add('pulse');
      setTimeout(() => active.classList.remove('pulse'), 400);
    }
    return;
  }

  e.preventDefault();
  loadPage(href);
});

/** Browser-Navigation (← / →) */
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);
});
