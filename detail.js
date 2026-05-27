let umyvarnePridane = [];
let umyvarneSkryte  = [];

document.addEventListener("DOMContentLoaded", async function () {
  let urlParametre = new URLSearchParams(window.location.search);
  let id = parseInt(urlParametre.get("id"));

  await nacitajDataZAPI();

  let umyvaren = najdiUmyvaren(id);

  if (!umyvaren) {
    document.getElementById("detail-obsah").innerHTML =
      "<p style='color:var(--seda);padding:20px 0'>Umyváreň nebola nájdená. " +
      "<a href='index.html'>← Späť na zoznam</a></p>";
    return;
  }

  document.title = umyvaren.nazov + " – Umyj.to";

  zobrazDetail(umyvaren);
  initDetailMapa(umyvaren);
  await zobrazSchvaleneProblemy(id);
  await zobrazRecenzie(id);
  nastavFormularRecenzia(id);
  await nastavStatusReporter(id);
  nastavHlasenieProblemov(id);
});

async function nacitajDataZAPI() {
  try {
    let [resPridane, resSkryte] = await Promise.all([
      fetch("/api/umyvarne/pridane"),
      fetch("/api/umyvarne/skryte")
    ]);
    umyvarnePridane = await resPridane.json();
    umyvarneSkryte  = await resSkryte.json();
  } catch (chyba) {
    console.warn("API nedostupné.", chyba);
  }
}

function najdiUmyvaren(id) {
  if (umyvarneSkryte.indexOf(id) !== -1) return null;

  let najdena = umyvarne.find(function (u) { return u.id === id; });
  if (najdena) return najdena;

  return umyvarnePridane.find(function (u) { return u.id === id; }) || null;
}

function zobrazDetail(umyvaren) {
  let typyNazvy = {
    automaticka:  "Automatická",
    rucna:        "Ručná",
    samoobsluzna: "Samoobslužná"
  };
  let typNazov = typyNazvy[umyvaren.typ] || umyvaren.typ;
  let hviezdy  = generujHviezdy(umyvaren.hodnotenie);

  let platbyIkony = {
    karta:     "💳 Karta",
    mince:     "🪙 Mince",
    hotovost:  "💵 Hotovosť",
    apple_pay: "🍎 Apple Pay",
    google_pay:"🤖 Google Pay"
  };
  let platbyHtml = (umyvaren.platby || []).map(function (p) {
    return '<span class="platba-tag">' + (platbyIkony[p] || p) + '</span>';
  }).join("");

  let vybavenieInfo = [
    { klic: "vysavac",      ikona: "🌀", nazov: "Vysávač"      },
    { klic: "aktivna_pena", ikona: "🧼", nazov: "Aktívna pena" },
    { klic: "osusovac",     ikona: "💨", nazov: "Osušovač"     },
    { klic: "kartace",      ikona: "🪣", nazov: "Kefové umytie"},
    { klic: "vosk",         ikona: "✨", nazov: "Vosk"         },
    { klic: "menička",      ikona: "🪙", nazov: "Menička"      }
  ];
  let vybavenieHtml = vybavenieInfo.map(function (v) {
    let ma = umyvaren.vybavenie && umyvaren.vybavenie[v.klic];
    return '<span class="vybavenie-tag ' + (ma ? "vybavenie-tag--ano" : "vybavenie-tag--nie") + '">' +
      v.ikona + " " + v.nazov + '</span>';
  }).join("");

  let boxHtml = "";
  if (umyvaren.pocet_boxov) {
    boxHtml = '<div class="detail-meta-row"><span class="meta-ikonka">🏠</span><span>' + umyvaren.pocet_boxov + ' boxov</span></div>';
  }
  let vyskaHtml = "";
  if (umyvaren.max_vyska) {
    vyskaHtml = '<div class="detail-meta-row"><span class="meta-ikonka">📏</span><span>Max. výška vozidla: ' + umyvaren.max_vyska + '</span></div>';
  }

  let cennikHtml = (umyvaren.cennik || []).map(function (polozka) {
    return '<div class="cennik-riadok"><span>' + polozka.sluzba + '</span><span class="cennik-cena">' + polozka.cena + '</span></div>';
  }).join("");

  let html = `
    <div id="schvalene-problemy"></div>

    <div class="detail-grid">
      <div class="detail-info">
        <div class="detail-typ-badge">${typNazov}</div>
        <h1 class="detail-nazov">${umyvaren.nazov}</h1>

        <div class="detail-hodnotenie">
          <span class="hviezdy" style="font-size:1.3rem">${hviezdy}</span>
          <span class="hodnotenie-cislo" style="font-size:1.1rem">${umyvaren.hodnotenie}</span>
          <span class="pocet-recenzii">(${umyvaren.pocet_recenzii} recenzií)</span>
        </div>

        <div class="detail-meta">
          <div class="detail-meta-row">
            <span class="meta-ikonka">📍</span>
            <span>${umyvaren.adresa}</span>
          </div>
          <div class="detail-meta-row">
            <span class="meta-ikonka">📞</span>
            <span><a href="tel:${umyvaren.telefon}">${umyvaren.telefon}</a></span>
          </div>
          <div class="detail-meta-row">
            <span class="meta-ikonka">🕐</span>
            <span>${umyvaren.hodiny}</span>
          </div>
          ${boxHtml}
          ${vyskaHtml}
        </div>

        <p class="detail-popis">${umyvaren.popis}</p>

        <div class="detail-sekcia">
          <h3 class="detail-sekcia-nazov">Vybavenie</h3>
          <div class="vybavenie-tagy">${vybavenieHtml}</div>
        </div>

        <div class="detail-sekcia">
          <h3 class="detail-sekcia-nazov">Platba</h3>
          <div class="platba-tagy">${platbyHtml}</div>
          ${umyvaren.cena_orientacna
            ? '<p class="cena-orientacna">💰 Orientačná cena: <strong>' + umyvaren.cena_orientacna + '</strong></p>'
            : ""}
        </div>

        <div id="detail-mapa" class="detail-mapa"></div>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px">
        <div class="cennik-panel">
          <h2>💰 Cenník</h2>
          ${cennikHtml}
        </div>

        <div class="status-panel" id="status-panel">
          <h2>🚦 Aktuálna vyťaženosť</h2>
          <div id="status-zobrazenie" class="status-zobrazenie">
            <span class="status-neznamy">Zatiaľ nikto nenahlásil</span>
          </div>
          <p class="status-hint">Si tu? Nahlásiť aktuálny stav:</p>
          <div class="status-tlacidla">
            <button type="button" class="status-btn status-btn--volno" data-stav="volno">🟢 Voľno</button>
            <button type="button" class="status-btn status-btn--caka" data-stav="caka">🟡 Čaká sa</button>
            <button type="button" class="status-btn status-btn--plno" data-stav="plno">🔴 Plno</button>
          </div>
        </div>
      </div>
    </div>

    <div class="recenzie-sekcia">
      <h2>💬 Recenzie zákazníkov</h2>
      <div id="zoznam-recenzii"></div>
    </div>

    <div class="formular-recenzia">
      <h2>✍️ Napíš recenziu</h2>
      <form id="formular-recenzia">
        <div class="form-group">
          <label for="r-autor">Tvoje meno</label>
          <input type="text" id="r-autor" class="form-input" placeholder="napr. Ján Novák" required>
        </div>
        <div class="form-group">
          <label>Hodnotenie</label>
          <div class="hviezdy-vstup">
            <input type="radio" id="h5" name="hodnotenie" value="5">
            <label for="h5">★</label>
            <input type="radio" id="h4" name="hodnotenie" value="4">
            <label for="h4">★</label>
            <input type="radio" id="h3" name="hodnotenie" value="3" checked>
            <label for="h3">★</label>
            <input type="radio" id="h2" name="hodnotenie" value="2">
            <label for="h2">★</label>
            <input type="radio" id="h1" name="hodnotenie" value="1">
            <label for="h1">★</label>
          </div>
        </div>
        <div class="form-group">
          <label for="r-text">Tvoja recenzia</label>
          <textarea id="r-text" class="form-textarea" placeholder="Aká bola tvoja skúsenosť?" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Odoslať recenziu</button>
      </form>
    </div>

    <div class="problem-sekcia">
      <button type="button" class="btn btn-outline" id="btn-nahlasit-problem">⚠️ Nahlásiť problém</button>
      <div id="problem-formular" class="problem-formular" style="display:none">
        <h3>Opíš problém</h3>
        <p>Napr.: „V boxe 2 netečie vosk" alebo „Menička nefunguje"</p>
        <textarea id="problem-text" class="form-textarea" placeholder="Popíš problém..."></textarea>
        <div style="display:flex; gap:10px; margin-top:12px">
          <button type="button" class="btn btn-primary" id="btn-odoslat-problem">Odoslať</button>
          <button type="button" class="btn btn-outline" id="btn-zrusit-problem">Zrušiť</button>
        </div>
        <p id="problem-sprava" style="display:none; color:var(--modra); margin-top:10px; font-weight:600">
          ✅ Problém bol odoslaný. Po schválení administrátorom sa zobrazí na tejto stránke.
        </p>
      </div>
    </div>
  `;

  document.getElementById("detail-obsah").innerHTML = html;
}

function initDetailMapa(umyvaren) {
  let mapa = L.map("detail-mapa").setView([umyvaren.lat, umyvaren.lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);
  L.marker([umyvaren.lat, umyvaren.lng]).addTo(mapa).bindPopup(umyvaren.nazov).openPopup();
}

async function zobrazRecenzie(umyvarenId) {
  let kontajner = document.getElementById("zoznam-recenzii");
  let recenzie = [];

  try {
    let res = await fetch("/api/recenzie/" + umyvarenId);
    recenzie = await res.json();
  } catch (chyba) {
    console.warn("Nepodarilo sa načítať recenzie.", chyba);
  }

  if (recenzie.length === 0) {
    kontajner.innerHTML = '<p style="color:var(--seda)">Zatiaľ žiadne recenzie. Buď prvý/á! 👇</p>';
    return;
  }

  kontajner.innerHTML = recenzie.map(function (rec) {
    return '<div class="recenzia-karta">' +
      '<div class="recenzia-hlavicka">' +
        '<div>' +
          '<span class="recenzia-autor">' + escapeHtml(rec.autor) + '</span>' +
          '<span class="hviezdy" style="margin-left:10px;font-size:.95rem">' + generujHviezdy(rec.hodnotenie) + '</span>' +
        '</div>' +
        '<span class="recenzia-datum">' + rec.datum + '</span>' +
      '</div>' +
      '<p class="recenzia-text">' + escapeHtml(rec.text) + '</p>' +
    '</div>';
  }).join("");
}

function nastavFormularRecenzia(umyvarenId) {
  let form = document.getElementById("formular-recenzia");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let autor      = document.getElementById("r-autor").value.trim();
    let text       = document.getElementById("r-text").value.trim();
    let hodnotenie = document.querySelector('input[name="hodnotenie"]:checked');

    if (!autor || !text || !hodnotenie) { alert("Prosím vyplň všetky polia."); return; }

    try {
      await fetch("/api/recenzie/" + umyvarenId, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ autor, text, hodnotenie: parseInt(hodnotenie.value) })
      });
    } catch (chyba) {
      console.warn("Nepodarilo sa uložiť recenziu.", chyba);
    }

    await zobrazRecenzie(umyvarenId);
    form.reset();
    document.querySelector(".recenzie-sekcia").scrollIntoView({ behavior: "smooth" });
  });
}

async function nastavStatusReporter(umyvarenId) {
  await zobrazStatus(umyvarenId);

  document.querySelectorAll(".status-btn").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      let stav = this.dataset.stav;

      try {
        await fetch("/api/status/" + umyvarenId, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ stav })
        });
      } catch (chyba) {
        console.warn("Nepodarilo sa uložiť stav.", chyba);
      }

      document.querySelectorAll(".status-btn").forEach(function (b) {
        b.classList.remove("status-btn--aktivny");
      });
      this.classList.add("status-btn--aktivny");

      await zobrazStatus(umyvarenId);
    });
  });
}

async function zobrazStatus(umyvarenId) {
  let zobraz = document.getElementById("status-zobrazenie");
  if (!zobraz) return;

  let data = null;
  try {
    let res = await fetch("/api/status/" + umyvarenId);
    data = await res.json();
  } catch (chyba) {
    console.warn("Nepodarilo sa načítať stav.", chyba);
  }

  if (!data) {
    zobraz.innerHTML = '<span class="status-neznamy">Zatiaľ nikto nenahlásil</span>';
    return;
  }

  let minuty = Math.floor((Date.now() - data.cas) / 60000);

  // stav platí 3 hodiny (180 min)
  if (minuty > 180) {
    zobraz.innerHTML = '<span class="status-neznamy">Posledné hlásenie je staré – nie je aktuálne</span>';
    return;
  }

  let casText = minuty < 1 ? "Práve teraz" : "Pred " + minuty + " min";

  let stavInfo = {
    volno: { text: "🟢 Voľno",   css: "status-badge--volno" },
    caka:  { text: "🟡 Čaká sa", css: "status-badge--caka"  },
    plno:  { text: "🔴 Plno",    css: "status-badge--plno"  }
  };

  let info = stavInfo[data.stav] || stavInfo.volno;

  zobraz.innerHTML =
    '<span class="status-badge ' + info.css + '">' + info.text + '</span>' +
    '<span class="status-cas">' + casText + ' nahlásené</span>';

  let aktivnyBtn = document.querySelector('.status-btn[data-stav="' + data.stav + '"]');
  if (aktivnyBtn) aktivnyBtn.classList.add("status-btn--aktivny");
}

function nastavHlasenieProblemov(umyvarenId) {
  let btnOtvorit = document.getElementById("btn-nahlasit-problem");
  let formular   = document.getElementById("problem-formular");
  let btnOdoslat = document.getElementById("btn-odoslat-problem");
  let btnZrusit  = document.getElementById("btn-zrusit-problem");

  btnOtvorit.addEventListener("click", function () {
    formular.style.display = formular.style.display === "none" ? "block" : "none";
  });

  btnZrusit.addEventListener("click", function () {
    formular.style.display = "none";
    document.getElementById("problem-text").value = "";
    document.getElementById("problem-sprava").style.display = "none";
  });

  btnOdoslat.addEventListener("click", async function () {
    let text = document.getElementById("problem-text").value.trim();
    if (!text) { alert("Prosím opíš problém."); return; }

    try {
      await fetch("/api/problemy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          umyvaren_id:    umyvarenId,
          umyvaren_nazov: document.title.replace(" – Umyj.to", ""),
          text
        })
      });
    } catch (chyba) {
      console.warn("Nepodarilo sa odoslať problém.", chyba);
    }

    document.getElementById("problem-text").value = "";
    document.getElementById("problem-sprava").style.display = "block";
    btnOdoslat.disabled = true;
  });
}

async function zobrazSchvaleneProblemy(umyvarenId) {
  let kontajner = document.getElementById("schvalene-problemy");
  let problemy = [];

  try {
    let res = await fetch("/api/problemy/schvalene/" + umyvarenId);
    problemy = await res.json();
  } catch (chyba) {
    console.warn("Nepodarilo sa načítať problémy.", chyba);
  }

  if (!kontajner || problemy.length === 0) return;

  kontajner.innerHTML = problemy.map(function (p) {
    let datumText = new Date(p.datum).toLocaleDateString("sk-SK", {
      day: "numeric", month: "numeric", year: "numeric"
    });
    return '<div class="problem-varovanie">' +
      '<span class="problem-ikona">⚠️</span>' +
      '<div class="problem-varovanie-text">' +
        '<strong>Nahlásený problém:</strong> ' + escapeHtml(p.text) +
        '<span class="problem-datum">' + datumText + '</span>' +
      '</div>' +
    '</div>';
  }).join("");
}

function generujHviezdy(hodnotenie) {
  let hviezdy = "";
  let zaokruhlene = Math.round(hodnotenie);
  for (let i = 1; i <= 5; i++) {
    hviezdy += i <= zaokruhlene ? "★" : "☆";
  }
  return hviezdy;
}

function escapeHtml(text) {
  let div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
