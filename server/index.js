const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

// middlewares (regras que rodam antes das rotas)
app.use(cors());           // libera chamadas de outros lugares (tipo o React)
app.use(express.json());   // permite ler JSON no body

// rota de teste

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Servidor rodando!" });
});

app.get("/db-test", (req, res) => {
  const row = db.prepare("SELECT datetime('now') as now").get();
  res.json({ ok: true, dbTime: row.now });
});

app.get("/habits", (req, res) => {
  const habits = db.prepare("SELECT * FROM habits ORDER BY id DESC").all();
  res.json(habits);
});

// porta do servidor
app.listen(3001, () => {
  console.log("API on http://localhost:3001");
});