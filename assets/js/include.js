/* ===========================================================
   include.js – ERIK-Fit Modular System v6
   Lädt Layout, Sections & Components automatisch
   + Theme, Language, SPA-Kompatibilität & Komponentenlogik
   =========================================================== */

// --- 0️⃣ Ladezustand sofort aktivieren ---
document.documentElement.style.visibility = 'hidden';
document.body.classList.add('loading');

// --- 1️⃣ Theme direkt setzen ---
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ===========================================================
// 🧩 UNIVERSAL-COMPONENT-LOADER
// ===========================================================
async function loadComponent(path, targetId, replacements = {}) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Fehler beim Laden von ${path}`);
    let html = await res.text();

    // 🧠 Platzhalter ersetzen → {{TITLE}} etc.
    for (const [key, value] of Object.entries(replacements)) {
      html = html.replaceAll(`{{${key}}}`, value);
    }

    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

// ===========================================================
// 🧭 PARTIALS LADEN (Topbar + Sidebar)
// ===========================================================
async function loadPartials() {
  try {
    const [topbarHtml, sidebarHtml] = await Promise.all([
      fetch('./partials/layout/topbar.html').then(r => r.ok ? r.text() : Promise.reject('Topbar Fehler')),
      fetch('./partials/layout/sidebar.html').then(r => r.ok ? r.text() : Promise.reject('Sidebar Fehler'))
    ]);

    document.getElementById('topbar-mount').innerHTML = topbarHtml;
    document.getElementById('sidebar-mount').innerHTML = sidebarHtml;

    initSidebarActive();
    initThemeToggle();
    initLanguageSwitch();
    initMenuToggle();

    // --- Preloader steuern ---
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

// ===========================================================
// 🔗 SIDEBAR – aktiven Menüpunkt markieren
// ===========================================================
function initSidebarActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.sidebar a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === current);
  });
}

// ===========================================================
// 🌗 THEME SWITCH
// ===========================================================
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

function setThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.innerHTML = theme === 'dark'
    ? `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`
    : `<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;
}

// ===========================================================
// 🌍 LANGUAGE SYSTEM (JSON + Auto Translate)
// ===========================================================
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
  // Normaler Text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (data[key]) el.innerHTML = data[key];
  });

  // Placeholder-Texte
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (data[key]) el.setAttribute('placeholder', data[key]);
  });

  // Aria-Labels, Title usw.
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (data[key]) el.setAttribute('aria-label', data[key]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (data[key]) el.setAttribute('title', data[key]);
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
    if (preloaderText) preloaderText.textContent = lang === 'de' ? 'Lädt...' : 'Loading...';

    loadLanguage(lang);
  };

  const saved = localStorage.getItem('lang') || 'de';
  setLang(saved);
  btnDe.addEventListener('click', () => setLang('de'));
  btnEn.addEventListener('click', () => setLang('en'));
}

// ===========================================================
// 📱 MENÜ-TOGGLE (Mobile + Desktop Slide)
// ===========================================================
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

  // Klick außerhalb → Menü schließen (nur Mobile)
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

  // Klick auf Link (nur Mobile)
  sidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && window.innerWidth < 900) {
      sidebar.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.classList.remove('open');
    }
  });
}

// ===========================================================
// 🧾 Vertragsauswahl (Mitgliedschaften)
// ===========================================================
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

// ===========================================================
// 📏 INIT (nach DOM-Load)
// ===========================================================
document.addEventListener('DOMContentLoaded', () => {
  loadPartials();

  // Sidebar-Zustand
  if (window.innerWidth < 900) document.body.classList.add('sidebar-collapsed');
  else document.body.classList.remove('sidebar-collapsed');

  // Dynamische Topbar-Höhe
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

// ===========================================================
// 🪄 SPA-HOOK: Seitenabhängiger Code
// ===========================================================
document.addEventListener('pageLoaded', (e) => {
  const current = (e.detail.url.split('/').pop() || 'index.html').toLowerCase();

  // Sprache immer nachladen
  const lang = localStorage.getItem('lang') || 'de';
  loadLanguage(lang);

  if (current === 'mitgliedschaften.html') {
    initVertragsAuswahl();
  }
});
