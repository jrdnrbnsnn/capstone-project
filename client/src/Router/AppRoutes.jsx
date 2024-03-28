import { Routes, Route } from "react-router-dom";
import Products from "../pages/Home";
import SingleProductPage from "../pages/SingleProductPage";
import CategoryPage from "../pages/CategoryPage";
import Register from "../pages/Register";
import Login from "../pages/Login";

export default function AppRoutes({ setToken }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}
