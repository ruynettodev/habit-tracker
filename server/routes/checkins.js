const express = require("express");
const db = require("../../server/db");

const router = express.Router();

function isValidDay(day) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day);
}

// marcar como feito
router.post("/", (req, res) => {
  const { habitId, day } = req.body;
  const hid = Number(habitId);

  if (!hid) return res.status(400).json({ error: "habitId inválido" });

  const chosenDay = day ? String(day) : new Date().toISOString().slice(0, 10);
  if (!isValidDay(chosenDay)) return res.status(400).json({ error: "day deve ser YYYY-MM-DD" });

  db.run(
    "INSERT OR IGNORE INTO checkins (habit_id, day) VALUES (?, ?)",
    [hid, chosenDay],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ habitId: hid, day: chosenDay, created: this.changes === 1 });
    }
  );
});

module.exports = router;