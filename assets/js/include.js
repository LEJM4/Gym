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

    // Active-Link automatisch setzen
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.sidebar a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === current) a.classList.add('active');
    });
  } catch (e) {
    console.error('Fehler beim Laden der Partials:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadPartials);
