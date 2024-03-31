import { useState } from "react";
import { register } from "../components";

export default function Register({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSumbit(e) {
    e.preventDefault();
    const token = await register(username, password);
    if (token) {
      setToken(token);
      console.log(token);
    }
  }

  return (
    <>
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSumbit}>
          <div>
            <input
              type="text"
              value={username}
              placeholder="email"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </>
  );
}
