const state = {
  wasserHeute: 0,
  wochenWasser: [0, 0, 0, 0, 0, 0, 0], // Mo-So
  erledigteZiele: [],
};

const wasserAnzeige = document.getElementById("waterCount");
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const resetBtn = document.getElementById("resetBtn");
const weekBox = document.getElementById("weekBox");
const alleCheckboxen = document.querySelectorAll(".goal");

function laden() {
  const gespeichert = localStorage.getItem("gesundState");

  if (gespeichert) {
    const data = JSON.parse(gespeichert);
    state.wasserHeute = data.wasserHeute || 0;
    state.wochenWasser = data.wochenWasser || [0, 0, 0, 0, 0, 0, 0];
    state.erledigteZiele = data.erledigteZiele || [];
  }
}

function speichern() {
  localStorage.setItem("gesundState", JSON.stringify(state));
}

function heuteIndex() {
  const heute = new Date().getDay();

  // Sonntag
  if (heute === 0) {
    return 6;
  }

  // Montag = 0, Dienstag = 1 ...
  return heute - 1;
}

function updateUI() {
  // Wasserstand anzeigen
  wasserAnzeige.textContent = state.wasserHeute;

  // Checkboxen aktualisieren
  alleCheckboxen.forEach((cb) => {
    cb.checked = state.erledigteZiele.includes(cb.value);
  });
}

function updateWoche() {
  const tage = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const heute = heuteIndex();

  weekBox.innerHTML = "";

  for (let i = 0; i < state.wochenWasser.length; i++) {
    const div = document.createElement("div");
    div.className = "week-item";

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

plusBtn.addEventListener("click", () => {
  const heute = heuteIndex();

  state.wasserHeute++;
  state.wochenWasser[heute]++;

  updateUI();
  updateWoche();

  speichern();

  wasserAnzeige.style.transform = "scale(1.1)";
  setTimeout(() => {
    wasserAnzeige.style.transform = "scale(1)";
  }, 150);
});

minusBtn.addEventListener("click", () => {
  const heute = heuteIndex();

  if (state.wasserHeute > 0) {
    state.wasserHeute--;
    state.wochenWasser[heute]--;

    updateUI();
    updateWoche();

    speichern();

    wasserAnzeige.style.transform = "scale(0.9)";
    setTimeout(() => {
      wasserAnzeige.style.transform = "scale(1)";
    }, 150);
  }
});

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

    const originalText = resetBtn.textContent;
    resetBtn.textContent = "Zurückgesetzt!";
    setTimeout(() => {
      resetBtn.textContent = originalText;
    }, 1500);
  }
});

alleCheckboxen.forEach((cb) => {
  cb.addEventListener("change", () => {
    if (cb.checked) {
      state.erledigteZiele.push(cb.value);
    } else {
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

function start() {
  laden();
  updateUI();
  updateWoche();
}

start();
