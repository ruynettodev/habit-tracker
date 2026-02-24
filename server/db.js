const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// cria/abre o arquivo do banco dentro de /server
const dbPath = path.join(__dirname, "database.sqlite");

// isso aqui TEM que ser um objeto Database do sqlite3
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro abrindo o banco:", err.message);
  } else {
    console.log("Banco SQLite conectado em:", dbPath);
  }
});

// cria tabelas (se não existirem)
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      frequency TEXT NOT NULL DEFAULT 'daily',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      day TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(habit_id, day),
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    )
  `);
});

// MUITO IMPORTANTE: exportar o db direto (não {db}, não função)
module.exports = db;