const express = require("express");
const db = require("../db");

const router = express.Router();

function isValidDay(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day);
}

// marcar como feito (check-in)
router.post("/", (req, res) => {
  try {
    const { habitId, date } = req.body;
    const hid = Number(habitId);

    if (!Number.isFinite(hid) || hid <= 0) {
      return res.status(400).json({ error: "habitId inválido" });
    }

    const chosenDate = date ? String(date) : new Date().toISOString().slice(0, 10);
    if (!isValidDay(chosenDate)) {
      return res.status(400).json({ error: "date deve ser YYYY-MM-DD" });
    }

    // opcional: verifica se o hábito existe
    const habit = db.prepare("SELECT id FROM habits WHERE id = ?").get(hid);
    if (!habit) return res.status(404).json({ error: "Hábito não encontrado" });

    // INSERT OR IGNORE evita duplicar no mesmo dia
    const info = db
      .prepare("INSERT OR IGNORE INTO checkins (habit_id, date) VALUES (?, ?)")
      .run(hid, chosenDate);

    res.status(201).json({
      habitId: hid,
      date: chosenDate,
      created: info.changes === 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;