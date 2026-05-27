let aktualneFiltre = {
  hladanie: "",
  mesto: "",
  typ: "",
  vybavenie: []
};

let mapa;
let markery = [];

// dáta z API – naplní sa pri načítaní stránky
let umyvarnePridane = [];
let umyvarneSkryte  = [];

document.addEventListener("DOMContentLoaded", async function () {
  await nacitajDataZAPI();
  initMapa();
  zobrazUmyvarne(nacitajVsetkyUmyvarne());
  pridajEventListeners();
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
    console.warn("API nedostupné, použijú sa iba základné dáta z data.js.", chyba);
  }
}

function initMapa() {
  mapa = L.map("mapa").setView([49.5, 16.5], 7);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);
  pridajMarkery(nacitajVsetkyUmyvarne());
}

function pridajMarkery(zoznam) {
  markery.forEach(function (marker) {
    mapa.removeLayer(marker);
  });
  markery = [];

  zoznam.forEach(function (umyvaren) {
    let marker = L.marker([umyvaren.lat, umyvaren.lng])
      .addTo(mapa)
      .bindPopup(
        "<strong>" + umyvaren.nazov + "</strong><br>" +
        umyvaren.adresa + "<br><br>" +
        "<a href='detail.html?id=" + umyvaren.id + "'>Zobraziť detail →</a>"
      );
    markery.push(marker);
  });
}

function zobrazUmyvarne(zoznam) {
  let grid = document.getElementById("zoznam-umyvarne");
  let pocetEl = document.getElementById("pocet-vysledkov");

  pocetEl.textContent = zoznam.length;
  grid.innerHTML = "";

  if (zoznam.length === 0) {
    grid.innerHTML = '<p class="ziadne-vysledky">Žiadne umyvárne nevyhovujú vašim kritériám. Skús zmeniť filtre.</p>';
    pridajMarkery([]);
    return;
  }

  zoznam.forEach(function (umyvaren) {
    let karta = vytvorKartu(umyvaren);
    grid.appendChild(karta);
  });

  pridajMarkery(zoznam);
}

function vytvorKartu(umyvaren) {
  let typyNazvy = {
    automaticka:   "Automatická",
    rucna:         "Ručná",
    samoobsluzna:  "Samoobslužná"
  };
  let typNazov = typyNazvy[umyvaren.typ] || umyvaren.typ;
  let hviezdy = generujHviezdy(umyvaren.hodnotenie);

  let vzdialenostHtml = "";
  if (umyvaren.vzdialenost !== undefined) {
    vzdialenostHtml = '<span class="karta-vzdialenost">📍 ' + umyvaren.vzdialenost.toFixed(1) + ' km</span>';
  }

  let a = document.createElement("a");
  a.href = "detail.html?id=" + umyvaren.id;
  a.className = "karta";

  a.innerHTML = `
    <div class="karta-hlavicka">
      <div class="karta-typ">${typNazov}</div>
      <div class="karta-nazov">${umyvaren.nazov}</div>
      <div class="karta-adresa">${umyvaren.adresa}</div>
    </div>
    <div class="karta-telo">
      <div class="karta-hodnotenie">
        <span class="hviezdy">${hviezdy}</span>
        <span class="hodnotenie-cislo">${umyvaren.hodnotenie}</span>
        <span class="pocet-recenzii">(${umyvaren.pocet_recenzii} recenzií)</span>
      </div>
      <p class="karta-popis">${umyvaren.popis}</p>
      <div class="karta-footer">
        <span class="karta-hodiny">🕐 ${umyvaren.hodiny}</span>
        ${vzdialenostHtml}
        <span class="btn btn-primary btn-karta">Detail →</span>
      </div>
    </div>
  `;

  return a;
}

function generujHviezdy(hodnotenie) {
  let hviezdy = "";
  let zaokruhlene = Math.round(hodnotenie);
  for (let i = 1; i <= 5; i++) {
    hviezdy += i <= zaokruhlene ? "★" : "☆";
  }
  return hviezdy;
}

function filtrujUmyvarne() {
  let vsetky = nacitajVsetkyUmyvarne();

  let vysledky = vsetky.filter(function (umyvaren) {
    let pasujePodlaNazvu = true;
    if (aktualneFiltre.hladanie) {
      pasujePodlaNazvu = umyvaren.nazov
        .toLowerCase()
        .includes(aktualneFiltre.hladanie.toLowerCase());
    }

    let pasujePodlaMesta = true;
    if (aktualneFiltre.mesto) {
      pasujePodlaMesta = umyvaren.mesto === aktualneFiltre.mesto;
    }

    let pasujePodlaTypu = true;
    if (aktualneFiltre.typ) {
      pasujePodlaTypu = umyvaren.typ === aktualneFiltre.typ;
    }

    // musí mať VŠETKY zaškrtnuté funkcie
    let pasujeVybavenie = true;
    if (aktualneFiltre.vybavenie.length > 0) {
      pasujeVybavenie = aktualneFiltre.vybavenie.every(function (klic) {
        return umyvaren.vybavenie && umyvaren.vybavenie[klic] === true;
      });
    }

    return pasujePodlaNazvu && pasujePodlaMesta && pasujePodlaTypu && pasujeVybavenie;
  });

  zobrazUmyvarne(vysledky);
}

function nacitajVsetkyUmyvarne() {
  let vsetky = umyvarne.concat(umyvarnePridane);
  return vsetky.filter(function (u) {
    return umyvarneSkryte.indexOf(u.id) === -1;
  });
}

function najdiNajblizisie() {
  if (!navigator.geolocation) {
    alert("Tvoj prehliadač nepodporuje geolokáciu.");
    return;
  }

  let btn = document.getElementById("btn-najblizsia");
  btn.textContent = "⏳ Zisťujem polohu...";
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    function (pozicia) {
      let mojLat = pozicia.coords.latitude;
      let mojLng  = pozicia.coords.longitude;

      let vsetky = nacitajVsetkyUmyvarne();
      let sVzdialenostou = vsetky.map(function (umyvaren) {
        let kopia = Object.assign({}, umyvaren);
        kopia.vzdialenost = vypocitajVzdialenost(mojLat, mojLng, umyvaren.lat, umyvaren.lng);
        return kopia;
      });

      sVzdialenostou.sort(function (a, b) {
        return a.vzdialenost - b.vzdialenost;
      });

      zobrazUmyvarne(sVzdialenostou);

      // červená bodka = poloha používateľa
      L.marker([mojLat, mojLng], {
        icon: L.divIcon({
          className: "",
          html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.4)"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        })
      }).addTo(mapa).bindPopup("Tvoja poloha").openPopup();

      mapa.setView([mojLat, mojLng], 11);

      btn.textContent = "📍 Nájsť najbližšie";
      btn.disabled = false;
    },

    function (chyba) {
      alert("Nepodarilo sa získať polohu. Skontroluj povolenia v prehliadači.\n(" + chyba.message + ")");
      btn.textContent = "📍 Nájsť najbližšie";
      btn.disabled = false;
    }
  );
}

// Haversine formula – vzdialenosť medzi dvoma GPS bodmi v km
function vypocitajVzdialenost(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng  = (lng2 - lng1)  * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function pridajEventListeners() {
  document.getElementById("input-hladanie").addEventListener("input", function () {
    aktualneFiltre.hladanie = this.value;
    filtrujUmyvarne();
  });

  document.getElementById("filter-mesto").addEventListener("change", function () {
    aktualneFiltre.mesto = this.value;
    filtrujUmyvarne();
  });

  document.getElementById("filter-typ").addEventListener("change", function () {
    aktualneFiltre.typ = this.value;
    filtrujUmyvarne();
  });

  document.getElementById("btn-najblizsia").addEventListener("click", najdiNajblizisie);

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let klic = this.dataset.vybavenie;
      let index = aktualneFiltre.vybavenie.indexOf(klic);

      if (index === -1) {
        aktualneFiltre.vybavenie.push(klic);
        this.classList.add("filter-btn--aktivny");
      } else {
        aktualneFiltre.vybavenie.splice(index, 1);
        this.classList.remove("filter-btn--aktivny");
      }
      filtrujUmyvarne();
    });
  });

  document.getElementById("btn-reset").addEventListener("click", function () {
    aktualneFiltre = { hladanie: "", mesto: "", typ: "", vybavenie: [] };
    document.getElementById("input-hladanie").value = "";
    document.getElementById("filter-mesto").value = "";
    document.getElementById("filter-typ").value = "";
    document.querySelectorAll(".filter-btn").forEach(function (b) {
      b.classList.remove("filter-btn--aktivny");
    });
    zobrazUmyvarne(nacitajVsetkyUmyvarne());
    mapa.setView([49.5, 16.5], 7);
  });
}
