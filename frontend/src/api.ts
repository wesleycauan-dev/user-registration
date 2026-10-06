import type { NewUser, User } from "./types";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Algo deu errado. Tente novamente.");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const getUsers = (): Promise<User[]> =>
  fetch("/api/users").then((res) => handle<User[]>(res));

export const createUser = (data: NewUser): Promise<User> =>
  fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => handle<User>(res));

export const deleteUser = (id: string): Promise<void> =>
  fetch(`/api/users/${id}`, { method: "DELETE" }).then((res) => handle<void>(res));
