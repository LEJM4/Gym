async function loadPartials() {
  try {
    const [topbarHtml, sidebarHtml] = await Promise.all([
      fetch('./partials/topbar.html').then(r => r.text()),
      fetch('./partials/sidebar.html').then(r => r.text())
    ]);

    const topbarMount = document.getElementById('topbar-mount');
    const sidebarMount = document.getElementById('sidebar-mount');

    if (topbarMount) topbarMount.innerHTML = topbarHtml;
    if (sidebarMount) sidebarMount.innerHTML = sidebarHtml;

    // Nach Laden: init Funktionen starten
    initSidebarActive();
    initThemeToggle();
    initLanguageSwitch();
  } catch (e) {
    console.error('Fehler beim Laden der Partials:', e);
  }
}

/* Aktiven Menüpunkt markieren */
function initSidebarActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.sidebar a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) a.classList.add('active');
  });
}

/* 🌗 Theme Toggle */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '🌙' : '☀️';

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

/* 🌍 Language Switch (einfaches Text-Umschalten) */
function initLanguageSwitch() {
  const btnDe = document.getElementById('lang-de');
  const btnEn = document.getElementById('lang-en');
  if (!btnDe || !btnEn) return;

  const setLang = (lang) => {
    localStorage.setItem('lang', lang);
    btnDe.classList.toggle('active', lang === 'de');
    btnEn.classList.toggle('active', lang === 'en');
    document.documentElement.setAttribute('lang', lang);
  };

  const saved = localStorage.getItem('lang') || 'de';
  setLang(saved);

  btnDe.addEventListener('click', () => setLang('de'));
  btnEn.addEventListener('click', () => setLang('en'));
}

document.addEventListener('DOMContentLoaded', loadPartials);
