/* ===============================
   include.js
   Lädt Topbar & Sidebar automatisch
   + Theme / Language / Active-Link
   + Preloader / Fade-In (flackerfrei)
   + Universeller Burger (mit Slide-Animation)
   =============================== */

// --- 0️⃣ Ladezustand sofort aktivieren (vor jeglichem Rendern) ---
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

    // === Jetzt sind die Partials im DOM – also Init-Funktionen starten ===
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

/* --- Sidebar: aktiven Menüpunkt markieren (SPA-kompatibel) --- */
function initSidebarActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.sidebar a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === current);
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
    const preloaderText = document.querySelector('#preloader p');
    if (preloaderText)
      preloaderText.textContent = lang === 'de' ? 'Lädt...' : 'Loading...';
  };

  const saved = localStorage.getItem('lang') || 'de';
  setLang(saved);
  btnDe.addEventListener('click', () => setLang('de'));
  btnEn.addEventListener('click', () => setLang('en'));
}

/* === 📱💻 Mobile & Desktop Menü Toggle mit weicher Animation === */
/* === 📱💻 Mobile & Desktop Menü Toggle mit perfektem Slide === */
function initMenuToggle() {
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMobile = window.innerWidth < 900;

    if (isMobile) {
      // --- Mobile Version ---
      const isOpen = sidebar.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuBtn.classList.toggle('open', isOpen);
    } else {
      // --- Desktop Slide-Version ---
      const isCollapsed = sidebar.classList.contains('collapsed');

      sidebar.style.transition = 'width 0.45s ease, opacity 0.35s ease';
      sidebar.style.overflow = 'hidden';

      if (!isCollapsed) {
        // ✅ Einklappen
        sidebar.style.width = '0px';
        sidebar.style.opacity = '0';
        document.body.classList.add('sidebar-collapsed');
        // sorgt dafür, dass Content gleichzeitig mitfährt
        sidebar.offsetHeight; // reflow-Trick, um Transition zu synchronisieren
        sidebar.classList.add('collapsed');
      } else {
        // ✅ Weiches Ausklappen
        sidebar.style.width = '230px';
        sidebar.style.opacity = '1';
        sidebar.classList.remove('collapsed');

        // Sobald Animation durch ist, entfernen wir overflow hidden
        setTimeout(() => {
          sidebar.style.overflow = 'auto';
          document.body.classList.remove('sidebar-collapsed');
        }, 450);
      }
    }
  });

  // Klick außerhalb → schließt Menü (nur Mobile)
  document.addEventListener('click', e => {
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
