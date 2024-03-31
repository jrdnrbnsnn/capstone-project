import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setToken, token }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!token ? (
            <>
              <li>
                <Link to="/login">Sign in</Link>
              </li>
              <li>
                <Link to="/register">Join Us</Link>
              </li>
            </>
          ) : null}
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            {token ? (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </li>
        </ul>
      </nav>
    </div>
  );
}
