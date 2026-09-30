import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://users_app:!cMu3.ieq5wWLi-@cluster0.m9o6mof.mongodb.net/Users?appName=Cluster0",
  )
  .then(() => console.log("Conectado ao banco mongo"))
  .catch(() => console.log("Erro ao conectar ao banco mongo"));

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("Users", usersSchema);

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

  const creteUser = await User.create(req.body);

  users.push(req.body);

  res.json(creteUser);
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

app.listen(port, () => {
  console.log("Servidor Rodando agora");
});
