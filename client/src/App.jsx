import "./App.css";
import NavbarCategories from "./components/CategoriesNavbar";
import Navbar from "./components/Navbar";
import AppRoutes from "./Router/AppRoutes";

function App() {
  return (
    <>
      <div className="main-container">
        <Navbar />
        <NavbarCategories />
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
