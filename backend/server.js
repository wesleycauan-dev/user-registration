import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || 3001;
// Em produção você pode apontar para um disco persistente: DB_FILE=/data/users.json
const DB_FILE = process.env.DB_FILE || new URL("./users.json", import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "../frontend/dist");

const app = express();
app.use(cors());
app.use(express.json());

// "Banco de dados" 
async function loadUsers() {
  if (!existsSync(DB_FILE)) return [];
  return JSON.parse(await readFile(DB_FILE, "utf-8"));
}
async function saveUsers(users) {
  await writeFile(DB_FILE, JSON.stringify(users, null, 2));
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lista usuários
app.get("/api/users", async (_req, res) => {
  const users = await loadUsers();
  res.json(users);
});

// Cria usuário
app.post("/api/users", async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const role = String(req.body.role ?? "").trim();

  if (name.length < 2) {
    return res.status(400).json({ message: "Informe um nome com pelo menos 2 letras." });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Informe um e-mail válido." });
  }
  if (!role) {
    return res.status(400).json({ message: "Escolha uma área de atuação." });
  }

  const users = await loadUsers();
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: "Este e-mail já está cadastrado." });
  }

  const user = { id: randomUUID(), name, email, role, createdAt: new Date().toISOString() };
  users.unshift(user); // mais recente primeiro
  await saveUsers(users);
  res.status(201).json(user);
});

// Remove usuário
app.delete("/api/users/:id", async (req, res) => {
  const users = await loadUsers();
  const next = users.filter((u) => u.id !== req.params.id);
  if (next.length === users.length) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  await saveUsers(next);
  res.status(204).end();
});

// --- Serve o frontend já compilado (mesmo domínio, sem problemas de CORS) ---
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get("*", (_req, res) => res.sendFile(path.join(DIST, "index.html")));
}

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
