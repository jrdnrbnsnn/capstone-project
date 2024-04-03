import "./App.css";
import NavbarCategories from "./components/CategoriesNavbar";
import Navbar from "./components/Navbar";
import AppRoutes from "./Router/AppRoutes";
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <>
      <div className="main-container">
        <Navbar token={token} setToken={setToken} />
        <NavbarCategories token={token} />
        <AppRoutes token={token} setToken={setToken} />
      </div>
    </>
  );
}

export default App;
