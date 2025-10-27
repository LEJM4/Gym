/* ===========================================================
   mitgliedschaften.js – Vertragsauswahl, Login & Registrierung
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const flowSection = document.getElementById("mitgliedschaft-flow");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const switchLink = document.getElementById("switch-link");
  const switchInfo = document.getElementById("switch-info");
  const formTitle = document.getElementById("form-title");

  // === 1️⃣ Vertrag auswählen ===
  document.querySelectorAll(".vertrag-btn").forEach(card => {
    card.addEventListener("click", () => {
      const tarif = card.dataset.tarif;
      localStorage.setItem("selectedTarif", tarif);
      flowSection.classList.remove("hidden");
      flowSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  // === 2️⃣ Login-Formular absenden ===
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("userLoggedIn", "true");
    alert("✅ Erfolgreich eingeloggt!");
    showContractConfirmation();
  });

  // === 3️⃣ Registrierung absenden ===
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("userLoggedIn", "true");
    alert("🎉 Konto erstellt & eingeloggt!");
    showContractConfirmation();
  });

  // === 4️⃣ Wechsel zwischen Login & Registrierung ===
  switchLink.addEventListener("click", (e) => {
    e.preventDefault();

    const showingLogin = !loginForm.classList.contains("hidden");

    if (showingLogin) {
      // Wechsel zu Registrierung
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
      formTitle.textContent = "Registrieren";
      switchInfo.textContent = "Wenn Sie bereits ein Konto haben,";
      switchLink.textContent = "jetzt einloggen";
    } else {
      // Wechsel zu Login
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      formTitle.textContent = "Login";
      switchInfo.textContent = "Wenn Sie noch kein Konto haben,";
      switchLink.textContent = "jetzt registrieren";
    }
  });

  // === 5️⃣ Nach Login / Registrierung → Vertrag bestätigen ===
  function showContractConfirmation() {
    const tarif = localStorage.getItem("selectedTarif") || "-";
    flowSection.innerHTML = `
      <div class="confirmation centered">
        <h3>Vertrag bestätigen</h3>
        <p>Sie haben den Tarif <strong>${tarif}</strong> gewählt.</p>
        <button id="confirm-contract" class="btn btn-gold">Vertrag abschließen</button>
      </div>
    `;

    document.getElementById("confirm-contract").addEventListener("click", () => {
      alert(`✅ Vertrag für "${tarif}" erfolgreich abgeschlossen!`);
      window.location.href = "index.html";
    });
  }
});
