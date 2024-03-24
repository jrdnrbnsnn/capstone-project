import { Routes, Route } from "react-router-dom";
import Products from "../pages/Home";
import SingleProductPage from "../pages/SingleProductPage";
import CategoryPage from "../pages/CategoryPage";

export default function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}
