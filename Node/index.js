import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("Users", usersSchema);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

let users = [
  {
    id: 1,
    name: "Cauan",
    age: 20,
    email: "cauan@email.com",
  },
];

// retornar usuarios
app.get("/users", async (req, res) => {
  const bankUsers = await User.find();

  res.json(bankUsers);
});

// criar usuarios
app.post("/users", async (req, res) => {
  console.log(req.body);

  const crateUser = await User.create(req.body);

  users.push(req.body);

  res.json(crateUser);
});

// deletar usuario
app.delete("/users/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res.status(404).json({ message: "Usuario nao encontrado" });
  }

  res.status(204).end();
});

const port = process.env.PORT || 3333;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Configure a variável MONGODB_URI antes de iniciar a API.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado ao banco MongoDB");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
