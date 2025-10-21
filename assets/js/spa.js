/* ===============================
   spa.js
   Client-Side Navigation (Mini SPA)
   funktioniert mit include.js + Preloader
   =============================== */

const contentContainer = document.querySelector('main.content');

/** Seite dynamisch laden */
async function loadPage(url, addToHistory = true) {
  try {
    document.body.classList.add('loading');
    document.documentElement.style.visibility = 'hidden';

    // Inhalt abrufen
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fehler beim Laden von ${url}`);
    const html = await response.text();

    // Nur <main> aus dem Dokument extrahieren
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main.content');
    if (!newMain) throw new Error('Kein <main> gefunden.');

    // Sanftes Ausblenden
    contentContainer.classList.add('fade-out');
    await new Promise(res => setTimeout(res, 200));

    // Inhalt ersetzen
    contentContainer.innerHTML = newMain.innerHTML;

    // Sanftes Einblenden
    contentContainer.classList.remove('fade-out');
    contentContainer.classList.add('fade-in');
    setTimeout(() => contentContainer.classList.remove('fade-in'), 400);

    // URL aktualisieren (wenn gewünscht)
    if (addToHistory) history.pushState(null, '', url);

    // Nachladen: Sidebar-Active + Scroll reset
    initSidebarActive();
    window.scrollTo(0, 0);

    // Sichtbar machen
    document.body.classList.remove('loading');
    document.documentElement.style.visibility = 'visible';
  } catch (err) {
    console.error('❌ Fehler beim Laden:', err);
    contentContainer.innerHTML = `<p style="padding:2rem;color:red;">Fehler beim Laden der Seite.</p>`;
    document.documentElement.style.visibility = 'visible';
  }
}

/** Klicks auf interne Links abfangen */
document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return; // externe Links ignorieren

  // Wenn Link auf gleiche Domain zeigt → SPA
  if (href.endsWith('.html')) {
    e.preventDefault();
    loadPage(href);
  }
});

/** Browser-Navigation (← / →) */
window.addEventListener('popstate', () => {
  loadPage(location.pathname, false);
});
