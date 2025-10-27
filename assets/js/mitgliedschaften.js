/* ===========================================================
   mitgliedschaften.js – Klick auf Vertrag zeigt Login-Box
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const loginFlow = document.getElementById("login-flow");
  const loginForm = document.getElementById("login-form");

  // 🧩 Klick auf Vertrag zeigt den Login-Bereich
  document.querySelectorAll(".vertrag-btn").forEach(card => {
    card.addEventListener("click", () => {
      const tarif = card.dataset.tarif;
      localStorage.setItem("selectedTarif", tarif);
      loginFlow.classList.remove("hidden");
      loginFlow.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 💾 Login-Simulation
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("userLoggedIn", "true");
    const tarif = localStorage.getItem("selectedTarif") || "-";
    alert(`✅ Erfolgreich eingeloggt! Du hast den Tarif "${tarif}" gewählt.`);
    window.location.href = "index.html";
  });
});
