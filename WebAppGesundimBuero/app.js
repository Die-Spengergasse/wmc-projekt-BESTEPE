// ============================================
// 1. STATE-OBJEKT (KEIN darkMode mehr)
// ============================================
const state = {
  wasserHeute: 0,
  wochenWasser: [0, 0, 0, 0, 0, 0, 0], // Mo-So
  erledigteZiele: [],
};

// ============================================
// 2. DOM ELEMENTE
// ============================================
const wasserAnzeige = document.getElementById("waterCount");
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const resetBtn = document.getElementById("resetBtn");
const weekBox = document.getElementById("weekBox");
const alleCheckboxen = document.querySelectorAll(".goal");

// ============================================
// 3. LOCAL STORAGE LADEN
// ============================================
function laden() {
  const gespeichert = localStorage.getItem("gesundState");

  if (gespeichert) {
    const data = JSON.parse(gespeichert);
    state.wasserHeute = data.wasserHeute || 0;
    state.wochenWasser = data.wochenWasser || [0, 0, 0, 0, 0, 0, 0];
    state.erledigteZiele = data.erledigteZiele || [];
  }
}

// ============================================
// 4. LOCAL STORAGE SPEICHERN
// ============================================
function speichern() {
  localStorage.setItem("gesundState", JSON.stringify(state));
}

// ============================================
// 5. HEUTIGEN WOCHENTAG ERMITTELN
// 0 = Montag, 6 = Sonntag
// ============================================
function heuteIndex() {
  const heute = new Date().getDay();

  // Sonntag
  if (heute === 0) {
    return 6;
  }

  // Montag = 0, Dienstag = 1 ...
  return heute - 1;
}

// ============================================
// 6. UI AKTUALISIEREN
// ============================================
function updateUI() {
  // Wasserstand anzeigen
  wasserAnzeige.textContent = state.wasserHeute;

  // Checkboxen aktualisieren
  alleCheckboxen.forEach((cb) => {
    cb.checked = state.erledigteZiele.includes(cb.value);
  });
}

// ============================================
// 7. WOCHENÜBERSICHT AKTUALISIEREN
// ============================================
function updateWoche() {
  const tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const heute = heuteIndex();

  // Alte Übersicht löschen
  weekBox.innerHTML = "";

  // Neue Übersicht erstellen
  for (let i = 0; i < state.wochenWasser.length; i++) {
    const div = document.createElement("div");
    div.className = "week-item";

    // Heutigen Tag hervorheben
    if (i === heute) {
      div.classList.add("today");
    }

    div.innerHTML = `
            <span>${tage[i]}</span>
            <span>${state.wochenWasser[i]} Gläser</span>
        `;

    weekBox.appendChild(div);
  }
}

// ============================================
// 8. EVENT-HANDLER
// ============================================

// PLUS BUTTON
plusBtn.addEventListener("click", () => {
  const heute = heuteIndex();

  // State ändern
  state.wasserHeute++;
  state.wochenWasser[heute]++;

  // UI aktualisieren
  updateUI();
  updateWoche();

  // Local Storage speichern
  speichern();

  // Kleine Animation
  wasserAnzeige.style.transform = "scale(1.1)";
  setTimeout(() => {
    wasserAnzeige.style.transform = "scale(1)";
  }, 150);
});

// MINUS BUTTON
minusBtn.addEventListener("click", () => {
  const heute = heuteIndex();

  if (state.wasserHeute > 0) {
    // State ändern
    state.wasserHeute--;
    state.wochenWasser[heute]--;

    // UI aktualisieren
    updateUI();
    updateWoche();

    // Speichern
    speichern();

    // Kleine Animation
    wasserAnzeige.style.transform = "scale(0.9)";
    setTimeout(() => {
      wasserAnzeige.style.transform = "scale(1)";
    }, 150);
  }
});

// RESET BUTTON (ersetzt Dark Mode)
resetBtn.addEventListener("click", () => {
  const heute = heuteIndex();
  const bestaetigt = confirm(
    "Möchten Sie die Wasser-Einträge für heute wirklich zurücksetzen?",
  );

  if (bestaetigt) {
    state.wasserHeute = 0;
    state.wochenWasser[heute] = 0;
    updateUI();
    updateWoche();
    speichern();

    // Kurze Rückmeldung
    const originalText = resetBtn.textContent;
    resetBtn.textContent = "Zurückgesetzt!";
    setTimeout(() => {
      resetBtn.textContent = originalText;
    }, 1500);
  }
});

// CHECKBOXEN
alleCheckboxen.forEach((cb) => {
  cb.addEventListener("change", () => {
    // Checkbox aktiviert
    if (cb.checked) {
      state.erledigteZiele.push(cb.value);
    } else {
      // Ziel entfernen
      const neueListe = [];
      for (let i = 0; i < state.erledigteZiele.length; i++) {
        if (state.erledigteZiele[i] !== cb.value) {
          neueListe.push(state.erledigteZiele[i]);
        }
      }
      state.erledigteZiele = neueListe;
    }
    speichern();
  });
});

// ============================================
// 9. START DER APP
// ============================================
function start() {
  laden();
  updateUI();
  updateWoche();
}

// App starten
start();
