/* ===========================================================
   mitgliedschaften.js – Vertragsauswahl, Login & Registrierung
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const flowSection = document.getElementById("mitgliedschaft-flow");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toggleLink = document.getElementById("toggle-link");
  const toggleText = document.getElementById("toggle-text");
  const flowHeading = document.getElementById("flow-heading");
  const flowDesc = document.getElementById("flow-desc");
  const confirmation = document.getElementById("contract-confirmation");
  const selectedTarif = document.getElementById("selected-tarif");

  // === 1️⃣ Wenn eingeloggt → nur Vertragsabschluss anzeigen ===
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  if (isLoggedIn) {
    document.querySelector(".highlight-cards").classList.remove("hidden");
  }

  // === 2️⃣ Klick auf Tarif-Karte ===
  document.querySelectorAll(".vertrag-btn").forEach(card => {
    card.addEventListener("click", () => {
      const tarif = card.dataset.tarif;
      selectedTarif.textContent = tarif;
      flowSection.classList.remove("hidden");
      flowSection.scrollIntoView({ behavior: "smooth" });

      if (isLoggedIn) {
        document.querySelector(".login-container").classList.add("hidden");
        confirmation.classList.remove("hidden");
      } else {
        document.querySelector(".login-container").classList.remove("hidden");
      }
    });
  });

  // === 3️⃣ Login-Formular ===
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("userLoggedIn", "true");
    alert("✅ Login erfolgreich!");
    loginForm.classList.add("hidden");
    document.querySelector(".register-hint").classList.add("hidden");
    confirmation.classList.remove("hidden");
  });

  // === 4️⃣ Registrierung ===
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("userLoggedIn", "true");
    alert("🎉 Konto erstellt & eingeloggt!");
    registerForm.classList.add("hidden");
    document.querySelector(".register-hint").classList.add("hidden");
    confirmation.classList.remove("hidden");
  });

  // === 5️⃣ Umschalten Login <-> Registrierung ===
  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    const showRegister = registerForm.classList.contains("hidden");
    registerForm.classList.toggle("hidden", !showRegister);
    loginForm.classList.toggle("hidden", showRegister);

    toggleText.textContent = showRegister
      ? "Bereits ein Konto?"
      : "Noch kein Konto?";
    toggleLink.textContent = showRegister
      ? "Jetzt einloggen"
      : "Jetzt registrieren";
  });

  // === 6️⃣ Vertragsabschluss ===
  document.getElementById("confirm-contract").addEventListener("click", () => {
    alert(`✅ Vertrag für "${selectedTarif.textContent}" abgeschlossen!`);
    window.location.href = "index.html";
  });
});
