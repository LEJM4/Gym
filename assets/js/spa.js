/* ===============================
   spa.js
   Mini SPA mit Preloader + korrekter Sidebar-Aktualisierung
   =============================== */

const contentContainer = document.querySelector('main.content');
const preloader = document.getElementById('preloader');

/** Seite dynamisch laden */
async function loadPage(url, addToHistory = true) {
  try {
    // Preloader aktivieren
    preloader.classList.remove('hidden');
    document.body.classList.add('loading');
    document.documentElement.style.visibility = 'hidden';

    await new Promise(res => setTimeout(res, 200)); // sanftes Einblenden

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fehler beim Laden von ${url}`);
    const html = await response.text();

    // Nur <main> extrahieren
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main.content');
    if (!newMain) throw new Error('Kein <main> gefunden.');

    // Sanft ausblenden
    contentContainer.classList.add('fade-out');
    await new Promise(res => setTimeout(res, 200));

    // Inhalt ersetzen
    contentContainer.innerHTML = newMain.innerHTML;

    // URL zuerst aktualisieren
    if (addToHistory) history.pushState(null, '', url);

    // Jetzt Sidebar aktualisieren (korrekt)
    initSidebarActive();
    window.scrollTo(0, 0);

    // Sanft einblenden
    contentContainer.classList.remove('fade-out');
    contentContainer.classList.add('fade-in');
    setTimeout(() => contentContainer.classList.remove('fade-in'), 400);

  } catch (err) {
    console.error('❌ Fehler beim Laden:', err);
    contentContainer.innerHTML = `<p style="padding:2rem;color:red;">Fehler beim Laden der Seite.</p>`;
  } finally {
    // Preloader ausblenden, Seite zeigen
    setTimeout(() => {
      preloader?.classList.add('hidden');
      document.body.classList.remove('loading');
      document.documentElement.style.visibility = 'visible';
    }, 400);
  }
}

/** Klicks auf interne Links abfangen */
document.addEventListener('click', e => {
  const link = e.target.closest('a[data-link]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return;

  e.preventDefault();
  loadPage(href);
});

/** Browser-Navigation (← / →) */
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);
});
