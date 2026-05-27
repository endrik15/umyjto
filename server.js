const express  = require("express");
const Database = require("better-sqlite3");
const path     = require("path");

const app  = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = new Database("umyto.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS recenzie (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    umyvaren_id INTEGER NOT NULL,
    autor       TEXT    NOT NULL,
    text        TEXT    NOT NULL,
    hodnotenie  INTEGER NOT NULL,
    datum       TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS statusy (
    umyvaren_id INTEGER PRIMARY KEY,
    stav        TEXT    NOT NULL,
    cas         INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS problemy (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    umyvaren_id    INTEGER NOT NULL,
    umyvaren_nazov TEXT    NOT NULL,
    text           TEXT    NOT NULL,
    datum          TEXT    NOT NULL,
    stav           TEXT    NOT NULL DEFAULT 'novy'
  );

  CREATE TABLE IF NOT EXISTS umyvarne_pridane (
    id   INTEGER PRIMARY KEY,
    data TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS umyvarne_skryte (
    umyvaren_id INTEGER PRIMARY KEY
  );
`);

// recenzie
app.get("/api/recenzie/:id", function (req, res) {
  let recenzie = db.prepare("SELECT * FROM recenzie WHERE umyvaren_id = ? ORDER BY id DESC").all(parseInt(req.params.id));
  res.json(recenzie);
});

app.post("/api/recenzie/:id", function (req, res) {
  let { autor, text, hodnotenie } = req.body;
  if (!autor || !text || !hodnotenie) return res.status(400).json({ chyba: "Chýbajú polia." });

  db.prepare("INSERT INTO recenzie (umyvaren_id, autor, text, hodnotenie, datum) VALUES (?, ?, ?, ?, ?)")
    .run(parseInt(req.params.id), autor, text, hodnotenie, new Date().toLocaleDateString("sk-SK"));
  res.json({ ok: true });
});

// statusy
app.get("/api/status/:id", function (req, res) {
  let status = db.prepare("SELECT * FROM statusy WHERE umyvaren_id = ?").get(parseInt(req.params.id));
  res.json(status || null);
});

app.post("/api/status/:id", function (req, res) {
  let { stav } = req.body;
  if (!stav) return res.status(400).json({ chyba: "Chýba stav." });

  // INSERT OR REPLACE – jeden záznam na umyváreň
  db.prepare("INSERT OR REPLACE INTO statusy (umyvaren_id, stav, cas) VALUES (?, ?, ?)").run(parseInt(req.params.id), stav, Date.now());
  res.json({ ok: true });
});

// problémy – pozor: /schvalene/:id musí byť pred /:id
app.get("/api/problemy/schvalene/:id", function (req, res) {
  let problemy = db.prepare("SELECT * FROM problemy WHERE umyvaren_id = ? AND stav = 'viem' ORDER BY id DESC").all(parseInt(req.params.id));
  res.json(problemy);
});

app.get("/api/problemy", function (req, res) {
  res.json(db.prepare("SELECT * FROM problemy ORDER BY stav ASC, id DESC").all());
});

app.post("/api/problemy", function (req, res) {
  let { umyvaren_id, umyvaren_nazov, text } = req.body;
  if (!umyvaren_id || !text) return res.status(400).json({ chyba: "Chýbajú polia." });

  db.prepare("INSERT INTO problemy (umyvaren_id, umyvaren_nazov, text, datum, stav) VALUES (?, ?, ?, ?, 'novy')")
    .run(umyvaren_id, umyvaren_nazov || "Neznáma", text, new Date().toISOString());
  res.json({ ok: true });
});

app.patch("/api/problemy/:id/viem", function (req, res) {
  db.prepare("UPDATE problemy SET stav = 'viem' WHERE id = ?").run(parseInt(req.params.id));
  res.json({ ok: true });
});

app.patch("/api/problemy/:id/opravit", function (req, res) {
  db.prepare("DELETE FROM problemy WHERE id = ?").run(parseInt(req.params.id));
  res.json({ ok: true });
});

app.delete("/api/problemy/:id", function (req, res) {
  db.prepare("DELETE FROM problemy WHERE id = ?").run(parseInt(req.params.id));
  res.json({ ok: true });
});

// umyvárne
app.get("/api/umyvarne/pridane", function (req, res) {
  res.json(db.prepare("SELECT data FROM umyvarne_pridane").all().map(function (r) { return JSON.parse(r.data); }));
});

app.get("/api/umyvarne/skryte", function (req, res) {
  res.json(db.prepare("SELECT umyvaren_id FROM umyvarne_skryte").all().map(function (r) { return r.umyvaren_id; }));
});

app.post("/api/umyvarne", function (req, res) {
  let umyvaren = req.body;
  if (!umyvaren.nazov) return res.status(400).json({ chyba: "Chýba názov." });

  umyvaren.id = Date.now();
  db.prepare("INSERT INTO umyvarne_pridane (id, data) VALUES (?, ?)").run(umyvaren.id, JSON.stringify(umyvaren));
  res.json({ ok: true, id: umyvaren.id });
});

app.delete("/api/umyvarne/:id", function (req, res) {
  let id = parseInt(req.params.id);
  let pridana = db.prepare("SELECT id FROM umyvarne_pridane WHERE id = ?").get(id);

  if (pridana) {
    db.prepare("DELETE FROM umyvarne_pridane WHERE id = ?").run(id);
  } else {
    // základná umyváreň z data.js – len ju skryjeme
    db.prepare("INSERT OR IGNORE INTO umyvarne_skryte (umyvaren_id) VALUES (?)").run(id);
  }
  res.json({ ok: true });
});

// reset demo
app.post("/api/reset", function (req, res) {
  db.exec(`
    DELETE FROM recenzie;
    DELETE FROM statusy;
    DELETE FROM problemy;
    DELETE FROM umyvarne_pridane;
    DELETE FROM umyvarne_skryte;
  `);
  res.json({ ok: true });
});

app.listen(PORT, function () {
  console.log("Umyj.to beží na http://localhost:" + PORT);
});
