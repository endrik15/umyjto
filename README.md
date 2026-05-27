# Umyj.to

Webová aplikácia na vyhľadávanie autoumyvární v Slovensku a Českej republike.  
Ročníkový projekt — Adam Mark Šepeľa, 2026.

## Funkcie

- Vyhľadávanie a filtrovanie umyvární podľa mesta, typu a vybavenia
- Interaktívna mapa (Leaflet.js + OpenStreetMap)
- Geolokácia – zoradenie podľa vzdialenosti
- Detail umyvárne: cenník, vybavenie, platby, mini mapa
- Waze-like stav vyťaženosti (Voľno / Čaká sa / Plno)
- Recenzie zákazníkov s hviezdičkovým hodnotením
- Hlásenie technických problémov
- Admin panel: pridávanie, mazanie, správa problémov, reset dát

## Technológie

| Vrstva    | Technológia                          |
|-----------|--------------------------------------|
| Frontend  | HTML5, CSS3, JavaScript ES6          |
| Mapa      | Leaflet.js 1.9.4 + OpenStreetMap     |
| Backend   | Node.js + Express                    |
| Databáza  | SQLite (better-sqlite3)              |

## Spustenie

```bash
npm install
node server.js
```

Otvor prehliadač na **http://localhost:3000**

> Stránky treba otvárať cez `http://localhost:3000`, nie cez `file://`.

## Štruktúra projektu

```
umyto/
├── index.html        # Hlavná stránka (zoznam + mapa)
├── detail.html       # Detail umyvárne
├── admin.html        # Admin panel
├── style.css         # Všetky štýly
├── app.js            # Logika hlavnej stránky
├── detail.js         # Logika detailu
├── admin.js          # Logika admin panelu
├── data.js           # Základné dáta (13 umyvární, SK + CZ)
├── server.js         # Node.js + Express backend + REST API
├── package.json      # Závislosti (express, better-sqlite3)
├── leaflet.js        # Leaflet mapa (lokálna kópia)
├── leaflet.css       # Leaflet štýly
├── images/           # Ikony pre mapu (Leaflet)
└── docs/             # Dokumentácia projektu (HTML)
    ├── SRS.html
    ├── SDD.html
    ├── PouzivatelskaPrivucka.html
    ├── AdministratorskaPrirucka.html
    └── ProduktovyList.html
```

## API endpointy

| Endpoint | Metóda | Popis |
|---|---|---|
| `/api/recenzie/:id` | GET / POST | Recenzie umyvárne |
| `/api/status/:id` | GET / POST | Waze stav vyťaženosti |
| `/api/problemy` | GET / POST | Nahlásené problémy |
| `/api/problemy/schvalene/:id` | GET | Schválené varovania pre detail |
| `/api/problemy/:id/viem` | PATCH | Admin: označiť ako známy |
| `/api/problemy/:id/opravit` | PATCH | Admin: označiť ako opravené |
| `/api/problemy/:id` | DELETE | Zamietnuť problém |
| `/api/umyvarne/pridane` | GET / POST | Admin-pridané umyvárne |
| `/api/umyvarne/skryte` | GET | IDs skrytých umyvární |
| `/api/umyvarne/:id` | DELETE | Zmazať umyváreň |
| `/api/reset` | POST | Reset všetkých dát |
