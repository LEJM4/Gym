/* ===========================================================
   mitgliedschaften.js – Vertragsauswahl, Login & Registrierung
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const flowSection = document.getElementById("mitgliedschaft-flow");
  const formContainer = document.getElementById("form-container");
  const formTitle = document.getElementById("form-title");
  const switchLink = document.getElementById("switch-link");
  const switchInfo = document.getElementById("switch-info");

  // === 1️⃣ Vertrag auswählen ===
  document.querySelectorAll(".vertrag-btn").forEach(card => {
    card.addEventListener("click", () => {
      const tarif = card.dataset.tarif;
      localStorage.setItem("selectedTarif", tarif);
      flowSection.classList.remove("hidden");
      flowSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  // === 2️⃣ Initial: Login anzeigen ===
  renderLoginForm();

  // === 3️⃣ Dynamischer Wechsel Login ↔ Registrierung ===
  switchLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isLogin = formContainer.dataset.state === "login";

    if (isLogin) {
      renderRegisterForm();
    } else {
      renderLoginForm();
    }
  });

  // === 🧩 Login-Formular generieren ===
  function renderLoginForm() {
    formContainer.dataset.state = "login";
    formTitle.textContent = "Login";
    switchInfo.textContent = "Wenn Sie noch kein Konto haben,";
    switchLink.textContent = "jetzt registrieren";

    formContainer.innerHTML = `
      <form id="login-form" class="kontakt-form">
        <input type="email" name="email" placeholder="E-Mail" required>
        <input type="password" name="password" placeholder="Passwort" required>
        <button type="submit" class="btn btn-gold">Einloggen</button>
      </form>
    `;

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("userLoggedIn", "true");
      alert("✅ Erfolgreich eingeloggt!");
      showContractConfirmation();
    });
  }

  // === 🧩 Registrierungsformular generieren ===
  function renderRegisterForm() {
    formContainer.dataset.state = "register";
    formTitle.textContent = "Registrierung";
    switchInfo.textContent = "Wenn Sie bereits ein Konto haben,";
    switchLink.textContent = "jetzt einloggen";

    formContainer.innerHTML = `
      <form id="register-form" class="kontakt-form">
        <input type="text" name="vorname" placeholder="Vorname" required>
        <input type="text" name="nachname" placeholder="Nachname" required>
        <input type="email" name="email" placeholder="E-Mail" required>
        <input type="password" name="password" placeholder="Passwort" required>
        <input type="password" name="password_repeat" placeholder="Passwort wiederholen" required>
        <button type="submit" class="btn btn-gold">Registrieren</button>
      </form>
    `;

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("userLoggedIn", "true");
      alert("🎉 Konto erstellt & eingeloggt!");
      showContractConfirmation();
    });
  }

  // === ✅ Nach Login oder Registrierung → Vertragsbestätigung ===
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
