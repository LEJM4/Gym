/* ===============================
   include.js – erweitert mit Sprachsystem (DE / EN)
   =============================== */

// --- 0️⃣ Ladezustand sofort aktivieren ---
document.documentElement.style.visibility = 'hidden';
document.body.classList.add('loading');

// --- 1️⃣ Theme direkt setzen ---
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// --- 2️⃣ Partials laden ---
async function loadPartials() {
  try {
    const [topbarHtml, sidebarHtml] = await Promise.all([
      fetch('./partials/topbar.html').then(r => r.ok ? r.text() : Promise.reject('Topbar Fehler')),
      fetch('./partials/sidebar.html').then(r => r.ok ? r.text() : Promise.reject('Sidebar Fehler'))
    ]);

    // Mount-Punkte einfügen
    document.getElementById('topbar-mount').innerHTML = topbarHtml;
    document.getElementById('sidebar-mount').innerHTML = sidebarHtml;

    // Init-Funktionen erst starten, wenn HTML geladen ist
    initSidebarActive();
    initThemeToggle();
    initLanguageSwitch();
    initMenuToggle();

    // --- Preloader sichtbar lassen bis alles eingefügt ist ---
    const preloader = document.getElementById('preloader');
    document.documentElement.style.visibility = 'hidden';

    setTimeout(() => preloader?.classList.add('hidden'), 300);
    setTimeout(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
      document.documentElement.style.visibility = 'visible';
    }, 900);
  } catch (err) {
    console.error('Fehler beim Laden der Partials:', err);
    document.body.classList.remove('loading');
    document.body.classList.add('ready');
    document.documentElement.style.visibility = 'visible';
  }
}

/* --- Sidebar: aktiven Menüpunkt markieren --- */
function initSidebarActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.sidebar a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === current);
  });
}

/* --- 🌗 Theme Toggle mit SVG --- */
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
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  } else {
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    `;
  }
}

/* === 🌍 Sprachsystem === */
async function loadLanguage(lang) {
  try {
    const res = await fetch(`./assets/lang/${lang}.json`);
    if (!res.ok) throw new Error('Sprachdatei fehlt');
    const data = await res.json();
    applyTranslations(data);
  } catch (err) {
    console.error('❌ Fehler beim Laden der Übersetzung:', err);
  }
}

function applyTranslations(data) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (data[key]) el.textContent = data[key];
  });
}

function initLanguageSwitch() {
  const btnDe = document.getElementById('lang-de');
  const btnEn = document.getElementById('lang-en');
  if (!btnDe || !btnEn) return;

  const setLang = (lang) => {
    localStorage.setItem('lang', lang);
    btnDe.classList.toggle('active', lang === 'de');
    btnEn.classList.toggle('active', lang === 'en');
    document.documentElement.setAttribute('lang', lang);

    const preloaderText = document.querySelector('#preloader p');
    if (preloaderText)
      preloaderText.textContent = lang === 'de' ? 'Lädt...' : 'Loading...';

    loadLanguage(lang);
  };

  const saved = localStorage.getItem('lang') || 'de';
  setLang(saved);
  btnDe.addEventListener('click', () => setLang('de'));
  btnEn.addEventListener('click', () => setLang('en'));
}

/* === 📱💻 Mobile & Desktop Menü Toggle (synchronisiert) === */
function initMenuToggle() {
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  if (!menuBtn || !sidebar || !content) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMobile = window.innerWidth < 900;

    if (isMobile) {
      const isOpen = sidebar.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuBtn.classList.toggle('open', isOpen);
    } else {
      const isCollapsed = sidebar.classList.contains('collapsed');
      sidebar.style.transition = 'width 0.45s ease, opacity 0.35s ease';
      sidebar.style.overflow = 'hidden';

      if (!isCollapsed) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
        sidebar.style.width = '0px';
        sidebar.style.opacity = '0';
      } else {
        sidebar.classList.remove('collapsed');
        sidebar.style.width = '230px';
        sidebar.style.opacity = '1';
        sidebar.offsetHeight;
        requestAnimationFrame(() => {
          document.body.classList.remove('sidebar-collapsed');
        });
        setTimeout(() => (sidebar.style.overflow = 'auto'), 460);
      }
    }
  });

  // Klick außerhalb → schließt Menü (nur Mobile)
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth < 900 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sidebar.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.classList.remove('open');
    }
  });

  // Klick auf Link (nur Mobile) → Sidebar automatisch schließen
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth < 900) {
      sidebar.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.classList.remove('open');
    }
  });
}

/* === Start + Topbar-Höhenbeobachtung === */
document.addEventListener('DOMContentLoaded', () => {
  loadPartials();

  if (window.innerWidth < 900) {
    document.body.classList.add('sidebar-collapsed');
  } else {
    document.body.classList.remove('sidebar-collapsed');
  }

  const observer = new ResizeObserver(() => {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      const h = topbar.offsetHeight;
      document.documentElement.style.setProperty('--real-topbar-height', `${h}px`);
    }
  });

  const checkTopbar = setInterval(() => {
    const topbar = document.querySelector('.topbar');
    if (topbar) {
      observer.observe(topbar);
      clearInterval(checkTopbar);
    }
  }, 100);
});

window.addEventListener('resize', updateTopbarHeight);
window.addEventListener('orientationchange', updateTopbarHeight);

function updateTopbarHeight() {
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    const h = topbar.offsetHeight;
    document.documentElement.style.setProperty('--real-topbar-height', `${h}px`);
  }
}

/* === 🪄 SPA-Hook: Seitenabhängiger Code === */
document.addEventListener('pageLoaded', (e) => {
  const current = (e.detail.url.split('/').pop() || 'index.html').toLowerCase();

  // Sprache nachladen bei SPA-Wechsel
  const lang = localStorage.getItem('lang') || 'de';
  loadLanguage(lang);

  // Nur auf der Mitgliedschaftsseite aktivieren
  if (current === 'mitgliedschaften.html') {
    initVertragsAuswahl();
  }
});

/* === 🧾 Vertragsauswahl (Mitgliedschaften) === */
function initVertragsAuswahl() {
  const buttons = document.querySelectorAll('.vertrag-btn');
  const vertragSection = document.getElementById('vertrag-section');
  const selectedTarif = document.getElementById('selected-tarif');

  if (!buttons.length || !vertragSection) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tarif = btn.closest('.card').dataset.tarif;
      selectedTarif.textContent = tarif;
      vertragSection.classList.add('active');
      vertragSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const form = document.getElementById('vertrags-formular');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`✅ Vertrag für "${selectedTarif.textContent}" wurde erfolgreich übermittelt!`);
    form.reset();
  });
}
