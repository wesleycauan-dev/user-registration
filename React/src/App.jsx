import "./App.css";
import { useState, useEffect } from "react";

import axios from "axios";

import UserCard from "./components/UserCard.jsx";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

function App() {
  const [name, setName] = useState("Cauan");
  const [email, setEmail] = useState("cauan@email.com");
  const [age, setAge] = useState(20);
  const [users, setUsers] = useState([]);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    async function searchUsers() {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
        setApiError("");
      } catch (error) {
        setApiError(
          error.response?.data?.message ||
            "Não foi possível conectar à API. Confira se o backend está rodando.",
        );
      }
    }
    searchUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: name,
        email: email,
        age: age,
      });

      setUsers((currentUsers) => [...currentUsers, response.data]);
      setApiError("");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "Não foi possível cadastrar o usuário.",
      );
    }
  }

  async function handleDelete(userId) {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userId),
      );
      setApiError("");
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Não foi possível excluir o usuário.",
      );
    }
  }

  return (
    <div className="app">
      <h1>User Registration</h1>
      {apiError && <p role="alert">{apiError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(event) => setAge(event.target.value)}
        />

        <button type="submit">Register</button>
      </form>
      <div className="user-list">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onDelete={() => handleDelete(user._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
