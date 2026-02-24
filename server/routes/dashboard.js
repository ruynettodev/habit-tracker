const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/today", (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const query = `
      SELECT 
        h.id,
        h.name,
        h.description,
        CASE 
          WHEN c.id IS NOT NULL THEN 1
          ELSE 0
        END as doneToday
      FROM habits h
      LEFT JOIN checkins c
        ON h.id = c.habit_id AND c.day = ?
      WHERE h.is_active = 1
      ORDER BY h.created_at DESC
    `;

    // better-sqlite3: prepare() + all()
    const rows = db.prepare(query).all(today);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;