import { Link } from "react-router-dom";

export default function Navbar({ token }) {
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
        </ul>
      </nav>
    </div>
  );
}
