let pocetPoloziek = 0;

document.addEventListener("DOMContentLoaded", function () {
  pridajPolozku();
  document.getElementById("btn-pridat-polozku").addEventListener("click", pridajPolozku);
  document.getElementById("admin-formular").addEventListener("submit", ulozUmyvaren);
  zobrazVsetkyUmyvarne();
  zobrazNahlaseneProblemy();
});

function pridajPolozku() {
  pocetPoloziek++;
  let id = "polozka-" + pocetPoloziek;

  let div = document.createElement("div");
  div.id = id;
  div.className = "form-row";
  div.style.marginBottom = "10px";
  div.style.alignItems = "flex-end";

  div.innerHTML = `
    <div class="form-group" style="margin-bottom:0; flex:2">
      <label>Názov služby</label>
      <input type="text" class="form-input cennik-sluzba" placeholder="napr. Základné umytie">
    </div>
    <div class="form-group" style="margin-bottom:0; flex:1">
      <label>Cena</label>
      <input type="text" class="form-input cennik-cena" placeholder="napr. 8 €">
    </div>
    <button type="button" class="btn btn-outline" onclick="odstranPolozku('${id}')"
      style="margin-bottom:0; padding:10px 14px; flex-shrink:0">✕</button>
  `;

  document.getElementById("cennik-polozky").appendChild(div);
}

function odstranPolozku(id) {
  let el = document.getElementById(id);
  if (el) el.remove();
}

async function ulozUmyvaren(e) {
  e.preventDefault();

  let nazov      = document.getElementById("a-nazov").value.trim();
  let telefon    = document.getElementById("a-telefon").value.trim();
  let mesto      = document.getElementById("a-mesto").value.trim();
  let typ        = document.getElementById("a-typ").value;
  let adresa     = document.getElementById("a-adresa").value.trim();
  let hodiny     = document.getElementById("a-hodiny").value.trim();
  let hodnotenie = parseFloat(document.getElementById("a-hodnotenie").value) || 4.0;
  let lat        = parseFloat(document.getElementById("a-lat").value);
  let lng        = parseFloat(document.getElementById("a-lng").value);
  let popis      = document.getElementById("a-popis").value.trim();

  // CZ+SK rozsah: lat 47–52, lng 12–24
  if (isNaN(lat) || isNaN(lng) || lat < 47 || lat > 52 || lng < 12 || lng > 24) {
    alert("Zadaj platné GPS súradnice.\nSlovensko: lat 47.5–49.6 / lng 16.8–22.6\nČesko: lat 48.5–51.1 / lng 12.1–18.9");
    return;
  }

  let cennik = [];
  let sluzby = document.querySelectorAll(".cennik-sluzba");
  let ceny   = document.querySelectorAll(".cennik-cena");
  for (let i = 0; i < sluzby.length; i++) {
    let sluzba = sluzby[i].value.trim();
    let cena   = ceny[i].value.trim();
    if (sluzba && cena) cennik.push({ sluzba, cena });
  }

  let novaUmyvaren = {
    nazov, mesto, adresa, typ, lat, lng, hodnotenie,
    pocet_recenzii: 0,
    telefon:        telefon || "Neuvedené",
    hodiny:         hodiny  || "Neuvedené",
    popis:          popis   || "Popis nie je k dispozícii.",
    platby:         [],
    cena_orientacna: "",
    vybavenie: {
      vysavac: false, aktivna_pena: false, osusovac: false,
      kartace: false, vosk: false, menička: false
    },
    pocet_boxov: null,
    max_vyska:   null,
    cennik
  };

  try {
    await fetch("/api/umyvarne", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(novaUmyvaren)
    });
  } catch (chyba) {
    alert("Nepodarilo sa uložiť umyváreň. Je server spustený?");
    return;
  }

  let sprava = document.getElementById("sprava-uspech");
  sprava.style.display = "block";

  document.getElementById("admin-formular").reset();
  document.getElementById("cennik-polozky").innerHTML = "";
  pocetPoloziek = 0;
  pridajPolozku();

  await zobrazVsetkyUmyvarne();
  sprava.scrollIntoView({ behavior: "smooth" });

  setTimeout(function () { sprava.style.display = "none"; }, 6000);
}

async function zobrazVsetkyUmyvarne() {
  let kontajner = document.getElementById("admin-zoznam");
  let pridane = [];
  let skryte  = [];

  try {
    let [resPridane, resSkryte] = await Promise.all([
      fetch("/api/umyvarne/pridane"),
      fetch("/api/umyvarne/skryte")
    ]);
    pridane = await resPridane.json();
    skryte  = await resSkryte.json();
  } catch (chyba) {
    console.warn("API nedostupné.", chyba);
  }

  let zakladne = umyvarne.filter(function (u) {
    return skryte.indexOf(u.id) === -1;
  });

  let typyNazvy = {
    automaticka:  "Automatická",
    rucna:        "Ručná",
    samoobsluzna: "Samoobslužná"
  };

  function vytvorRiadok(u, etiketa) {
    let typNazov = typyNazvy[u.typ] || u.typ;
    let nazovHtml = etiketa
      ? `${u.nazov} <span style="font-size:0.78rem;color:var(--seda)">(${etiketa})</span>`
      : u.nazov;
    return `
      <div class="admin-item">
        <div class="admin-item-info">
          <strong>${nazovHtml}</strong>
          <span>${u.mesto} &middot; ${typNazov} &middot; ${u.adresa}</span>
        </div>
        <div class="admin-item-akcie">
          <a href="detail.html?id=${u.id}" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem">Detail</a>
          <button onclick="vymazUmyvaren(${u.id})" class="btn btn-zmazat">Zmazať</button>
        </div>
      </div>
    `;
  }

  let html = "";
  zakladne.forEach(function (u) { html += vytvorRiadok(u, "");        });
  pridane.forEach(function  (u) { html += vytvorRiadok(u, "pridané"); });

  kontajner.innerHTML = html || '<p style="color:var(--seda)">Žiadne umyvárne.</p>';
}

async function vymazUmyvaren(id) {
  if (!confirm("Naozaj chceš vymazať túto umyváreň?")) return;

  try {
    await fetch("/api/umyvarne/" + id, { method: "DELETE" });
  } catch (chyba) {
    alert("Nepodarilo sa vymazať umyváreň.");
    return;
  }

  await zobrazVsetkyUmyvarne();
}

// stav 'novy'  = čaká na reakciu admina
// stav 'viem'  = admin vie, varovanie sa zobrazuje na detail stránke
async function zobrazNahlaseneProblemy() {
  let kontajner = document.getElementById("admin-problemy");
  let zoznam = [];

  try {
    let res = await fetch("/api/problemy");
    zoznam = await res.json();
  } catch (chyba) {
    console.warn("Nepodarilo sa načítať problémy.", chyba);
  }

  if (zoznam.length === 0) {
    kontajner.innerHTML = '<p class="admin-prazdne">✅ Žiadne čakajúce hlásenia.</p>';
    return;
  }

  kontajner.innerHTML = zoznam.map(function (problem) {
    let datum = new Date(problem.datum).toLocaleString("sk-SK", {
      day: "numeric", month: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

    let akcie = problem.stav === "viem"
      ? `<span class="problem-viem-tag">👁 Zobrazené na stránke</span>
         <button class="btn btn-opravene" onclick="opravitProblem(${problem.id})">✔ Opravené</button>`
      : `<button class="btn btn-viem" onclick="vedietOProbleme(${problem.id})">👁 Viem o nej</button>
         <button class="btn btn-zamietnut" onclick="zamietnutProblem(${problem.id})">✕ Zamietnuť</button>`;

    return `
      <div class="admin-problem-item" id="problem-${problem.id}">
        <div class="admin-problem-info">
          <strong>🏪 ${escapeHtmlAdmin(problem.umyvaren_nazov)}</strong>
          <p>${escapeHtmlAdmin(problem.text)}</p>
          <span class="admin-problem-datum">📅 ${datum}</span>
        </div>
        <div class="admin-problem-akcie">${akcie}</div>
      </div>
    `;
  }).join("");
}

async function vedietOProbleme(problemId) {
  try {
    await fetch("/api/problemy/" + problemId + "/viem", { method: "PATCH" });
  } catch (chyba) {
    console.warn("Chyba.", chyba);
  }
  await zobrazNahlaseneProblemy();
}

async function opravitProblem(problemId) {
  try {
    await fetch("/api/problemy/" + problemId + "/opravit", { method: "PATCH" });
  } catch (chyba) {
    console.warn("Chyba.", chyba);
  }
  await zobrazNahlaseneProblemy();
}

async function zamietnutProblem(problemId) {
  try {
    await fetch("/api/problemy/" + problemId, { method: "DELETE" });
  } catch (chyba) {
    console.warn("Chyba.", chyba);
  }
  await zobrazNahlaseneProblemy();
}

async function resetDemo() {
  if (!confirm(
    "Naozaj vymazať VŠETKY dáta?\n\n" +
    "Bude vymazané:\n" +
    "• Všetky recenzie\n" +
    "• Všetky nahlásené problémy\n" +
    "• Všetky stavy vyťaženosti\n" +
    "• Umyvárne pridané cez formulár\n\n" +
    "Základné umyvárne ostanú."
  )) return;

  try {
    await fetch("/api/reset", { method: "POST" });
  } catch (chyba) {
    alert("Nepodarilo sa resetovať dáta.");
    return;
  }

  await zobrazVsetkyUmyvarne();
  await zobrazNahlaseneProblemy();
  alert("✅ Demo vymazané! Môžeš začať odznova.");
}

function escapeHtmlAdmin(text) {
  let div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
