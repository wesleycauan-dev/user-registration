export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export type NewUser = Pick<User, "name" | "email" | "role">;
