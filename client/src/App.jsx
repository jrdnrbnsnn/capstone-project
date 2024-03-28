import "./App.css";
import NavbarCategories from "./components/CategoriesNavbar";
import Navbar from "./components/Navbar";
import AppRoutes from "./Router/AppRoutes";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  return (
    <>
      <div className="main-container">
        <Navbar token={token} setToken={setToken} />
        <NavbarCategories />
        <AppRoutes token={token} setToken={setToken} />
      </div>
    </>
  );
}

export default App;
