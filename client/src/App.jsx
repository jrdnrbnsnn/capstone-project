import "./App.css";
import NavbarCategories from "./components/CategoriesNavbar";
import Navbar from "./components/Navbar";
import AppRoutes from "./Router/AppRoutes";
import { useEffect, useState } from "react";
// MUI Imports
import { Container } from "@mui/material";

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
    <Container maxWidth="lg">
      <Navbar token={token} setToken={setToken} />
      <NavbarCategories token={token} />
      <AppRoutes token={token} setToken={setToken} />
    </Container>
  );
}

export default App;
