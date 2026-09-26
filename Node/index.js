import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Conectado ao banco MongoDB"))
    .catch((error) =>
      console.error("Erro ao conectar ao MongoDB:", error.message),
    );
} else {
  console.error(
    "MONGODB_URI não definida. Configure a variável no arquivo .env.",
  );
}

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("Users", usersSchema);

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Banco indisponível. Verifique MONGODB_URI e a conexão com o MongoDB.",
    });
  }

  next();
}

// retornar usuarios
app.get("/users", requireDatabase, async (req, res) => {
  try {
    const bankUsers = await User.find();
    res.json(bankUsers);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.message);
    res.status(500).json({ message: "Não foi possível buscar os usuários." });
  }
});

// criar usuarios
app.post("/users", requireDatabase, async (req, res) => {
  try {
    const createdUser = await User.create(req.body);
    res.status(201).json(createdUser);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Este e-mail já está cadastrado." });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Dados de usuário inválidos." });
    }

    console.error("Erro ao criar usuário:", error.message);
    res.status(500).json({ message: "Não foi possível criar o usuário." });
  }
});

// deletar usuario
app.delete("/users/:id", requireDatabase, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(204).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }

    console.error("Erro ao excluir usuário:", error.message);
    res.status(500).json({ message: "Não foi possível excluir o usuário." });
  }
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log("Servidor Rodando agora");
});
