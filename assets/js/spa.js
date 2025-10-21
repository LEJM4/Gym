/* =======================================================
   spa.js – Optimierte Mini-SPA mit Caching + Preloader
   Version 2.0 – ERIK-Fit Project
   ======================================================= */

const contentContainer = document.querySelector('main.content');
const preloader = document.getElementById('preloader');
const pageCache = new Map(); // 🧠 Zwischenspeicher für geladene Seiten

/** Hauptfunktion: Seite laden (mit Cache + Animation) */
async function loadPage(url, addToHistory = true) {
  try {
    // 🌀 Preloader aktivieren
    preloader.classList.remove('hidden');
    document.body.classList.add('loading');
    document.documentElement.style.visibility = 'hidden';

    // 🧠 Wenn Seite im Cache → sofort anzeigen (kein neuer Fetch nötig)
    if (pageCache.has(url)) {
      const cachedHtml = pageCache.get(url);
      await renderPage(cachedHtml, url, addToHistory);
      hidePreloader();
      return;
    }

    // 📡 Seite erstmals laden
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fehler beim Laden von ${url}`);
    const html = await response.text();

    // 💾 Im Cache speichern
    pageCache.set(url, html);

    // 🔧 Seite anzeigen
    await renderPage(html, url, addToHistory);
  } catch (err) {
    console.error('❌ Fehler beim Laden:', err);
    contentContainer.innerHTML = `<p style="padding:2rem;color:red;">Fehler beim Laden der Seite.</p>`;
  } finally {
    hidePreloader();
  }
}

/** Hilfsfunktion: HTML in <main> einfügen */
async function renderPage(html, url, addToHistory) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const newMain = doc.querySelector('main.content');
  if (!newMain) return;

  // Sanft ausblenden
  contentContainer.classList.add('fade-out');
  await new Promise(res => setTimeout(res, 100));

  // Inhalt ersetzen
  contentContainer.innerHTML = newMain.innerHTML;

  // URL anpassen
  if (addToHistory) history.pushState(null, '', url);

  // Sidebar & Scroll
  initSidebarActive();
  window.scrollTo(0, 0);

  // Sanft einblenden
  contentContainer.classList.remove('fade-out');
  contentContainer.classList.add('fade-in');
  setTimeout(() => contentContainer.classList.remove('fade-in'), 400);
}

/** Preloader ausblenden (sanft) */
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

  // 🚫 Wenn Link auf gleiche Seite zeigt → nicht neu laden
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const target = href.toLowerCase();
  if (target === current) {
    e.preventDefault();
    // Optional: kleine visuelle Rückmeldung (Leuchten)
    const active = document.querySelector('.sidebar a.active');
    if (active) {
      active.classList.add('pulse');
      setTimeout(() => active.classList.remove('pulse'), 400);
    }
    return;
  }

  // ✅ Neue Seite laden
  e.preventDefault();
  loadPage(href);
});

/** Browser-Navigation (← / →) */
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);
});
