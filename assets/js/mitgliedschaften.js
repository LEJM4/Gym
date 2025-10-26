console.log("mitgliedschaften.js geladen ✅");

// === 🧾 Vertragsauswahl + Login/Register Flow ===
function initMitgliedschaftFlow() {
  const buttons = document.querySelectorAll('.vertrag-btn');
  const vertragSection = document.getElementById('vertrag-section');
  const selectedTarif = document.getElementById('selected-tarif');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterBtn = document.getElementById('show-register');
  const vertragsForm = document.getElementById('vertrags-formular');
  const authSection = document.getElementById('auth-section');

  if (!buttons.length || !vertragSection) return;

  // 🧾 Tarif auswählen
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tarif = btn.closest('.card').dataset.tarif;
      selectedTarif.textContent = tarif;
      vertragSection.classList.remove('hidden');
      vertragSection.scrollIntoView({ behavior: "smooth" });

      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      if (isLoggedIn) {
        authSection.classList.add('hidden');
        vertragsForm.classList.remove('hidden');
      } else {
        authSection.classList.remove('hidden');
        vertragsForm.classList.add('hidden');
      }
    });
  });

  // 🔐 Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('userLoggedIn', 'true');
    alert("✅ Erfolgreich eingeloggt!");
    authSection.classList.add('hidden');
    vertragsForm.classList.remove('hidden');
  });

  // 🆕 Registrierung umschalten
  showRegisterBtn?.addEventListener('click', () => {
    registerForm.classList.toggle('hidden');
  });

  // 🆕 Registrierung abschließen
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('userLoggedIn', 'true');
    alert("🎉 Konto erstellt und eingeloggt!");
    authSection.classList.add('hidden');
    vertragsForm.classList.remove('hidden');
  });

  // 📄 Vertragsformular absenden
  vertragsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const tarif = selectedTarif.textContent;
    alert(`✅ Vertrag für "${tarif}" erfolgreich abgeschlossen!`);
    vertragsForm.reset();
  });
}

// === 📦 Initialisierung nach DOM-Load ===
document.addEventListener("DOMContentLoaded", initMitgliedschaftFlow);

// === 🔄 SPA-Hook (wenn du deine Navigation über JS lädst) ===
document.addEventListener("pageLoaded", (e) => {
  const current = (e.detail.url.split("/").pop() || "").toLowerCase();
  if (current === "mitgliedschaften.html") {
    initMitgliedschaftFlow();
  }
});
