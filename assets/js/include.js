/* ===============================
   include.js
   Lädt Topbar & Sidebar automatisch
   + Theme / Language / Active-Link
   + Preloader / Fade-In
   =============================== */

// --- 0️⃣ Ladezustand aktivieren ---
document.body.classList.add('loading');

// --- 1️⃣ Theme sofort setzen, bevor HTML rendert ---
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// --- 2️⃣ Nach Laden der Seite: Partials einfügen ---
async function loadPartials() {
  try {
    // Dateien parallel laden
    const [topbarHtml, sidebarHtml] = await Promise.all([
      fetch('./partials/topbar.html').then(r => {
        if (!r.ok) throw new Error('Topbar konnte nicht geladen werden.');
        return r.text();
      }),
      fetch('./partials/sidebar.html').then(r => {
        if (!r.ok) throw new Error('Sidebar konnte nicht geladen werden.');
        return r.text();
      })
    ]);

    // Mount-Punkte holen
    const topbarMount = document.getElementById('topbar-mount');
    const sidebarMount = document.getElementById('sidebar-mount');

    // Inhalte einfügen
    if (topbarMount) topbarMount.innerHTML = topbarHtml;
    if (sidebarMount) sidebarMount.innerHTML = sidebarHtml;

    // Nachträgliche Funktionen aktivieren
    initSidebarActive();
    initThemeToggle();
    initLanguageSwitch();

    // --- Preloader ausblenden, wenn alles geladen ist ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 300); // kleine Verzögerung für weichen Übergang
    }

    // Body anzeigen
    document.body.classList.remove('loading');
    document.body.classList.add('ready');

  } catch (err) {
    console.error('Fehler beim Laden der Partials:', err);
    document.body.classList.remove('loading');
    document.body.classList.add('ready');
  }
}

/* --- Sidebar: aktiven Menüpunkt markieren --- */
function initSidebarActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.sidebar a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) a.classList.add('active');
  });
}

/* --- 🌗 Theme Toggle mit SVG + sanfter Animation --- */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  if (!btn || !icon) return;

  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', saved);
  setThemeIcon(saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    // kleine Dreh-/Fade-Animation
    icon.classList.add('icon-anim');
    setTimeout(() => icon.classList.remove('icon-anim'), 400);

    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcon(next);
  });
}

/* --- 🔆 SVG-Icon wechseln --- */
function setThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;

  if (theme === 'dark') {
    // 🌙 Mond
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  } else {
    // ☀️ Sonne
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    `;
  }
}

/* --- 🌍 Language Switch --- */
function initLanguageSwitch() {
  const btnDe = document.getElementById('lang-de');
  const btnEn = document.getElementById('lang-en');
  if (!btnDe || !btnEn) return;

  const setLang = (lang) => {
    localStorage.setItem('lang', lang);
    btnDe.classList.toggle('active', lang === 'de');
    btnEn.classList.toggle('active', lang === 'en');
    document.documentElement.setAttribute('lang', lang);

    // Optional: Text im Preloader anpassen
    const preloaderText = document.querySelector('#preloader p');
    if (preloaderText) {
      preloaderText.textContent = lang === 'de' ? 'Lädt...' : 'Loading...';
    }
  };

  const saved = localStorage.getItem('lang') || 'de';
  setLang(saved);

  btnDe.addEventListener('click', () => setLang('de'));
  btnEn.addEventListener('click', () => setLang('en'));
}

// --- 3️⃣ Start ---
document.addEventListener('DOMContentLoaded', loadPartials);
