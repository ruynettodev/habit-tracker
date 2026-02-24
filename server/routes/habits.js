const express = require("express");
const db = require("../db");

const router = express.Router();

// LISTAR hábitos
router.get("/", (req, res) => {
  try {
    const habits = db.prepare("SELECT * FROM habits ORDER BY id DESC").all();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRIAR hábito
router.post("/", (req, res) => {
  try {
    const { name, description = "", frequency = "daily" } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "name é obrigatório" });
    }

    const stmt = db.prepare(
      "INSERT INTO habits (name, description, frequency) VALUES (?, ?, ?)"
    );

    const info = stmt.run(String(name).trim(), String(description), String(frequency));

    const habit = db.prepare("SELECT * FROM habits WHERE id = ?").get(info.lastInsertRowid);

    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;