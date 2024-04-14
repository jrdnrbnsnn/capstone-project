import { useState } from "react";
import { login } from "../components";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSumbit(e) {
    e.preventDefault();
    const token = await login(username, password);
    if (token) {
      setToken(token);
      navigate("/");
    }
  }

  return (
    <>
      <div className="register-container">
        <h2>Login</h2>
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
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
}
