import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createUser, deleteUser, getUsers } from "./api";
import type { NewUser, User } from "./types";

const ROLES = ["Frontend", "Backend", "Full Stack", "UX/UI", "Dados", "QA"];
const EMPTY: NewUser = { name: "", email: "", role: "" };

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<NewUser>(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const update =
    (field: keyof NewUser) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const created = await createUser(form);
      setUsers((prev) => [created, ...prev]); // aparece na tela na hora
      setForm(EMPTY);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="layout">
      <section className="panel">
        <h1>Cadastre-se</h1>
        <p className="lead">Preencha os dados e seu nome entra na lista ao lado.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Nome
            <input value={form.name} onChange={update("name")} placeholder="Wesley Cauan" />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="wesleycauan@email.com"
            />
          </label>
          <label>
            Área de atuação
            <select value={form.role} onChange={update("role")}>
              <option value="">Selecione</option>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={sending}>
            {sending ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </section>

      <section className="list">
        <h2>
          Cadastrados <span className="count">{users.length}</span>
        </h2>

        {loading ? (
          <p className="empty">Carregando...</p>
        ) : users.length === 0 ? (
          <p className="empty">
            Ninguém cadastrado ainda. Use o formulário para adicionar o primeiro.
          </p>
        ) : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                <span className="avatar">{initials(u.name)}</span>
                <div className="info">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </div>
                <span className="role">{u.role}</span>
                <button
                  className="remove"
                  onClick={() => handleDelete(u.id)}
                  aria-label={`Remover ${u.name}`}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
