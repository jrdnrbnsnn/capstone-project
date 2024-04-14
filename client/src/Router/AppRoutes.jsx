import { Routes, Route } from "react-router-dom";
import Products from "../pages/Home";
import SingleProductPage from "../pages/SingleProductPage";
import CategoryPage from "../pages/CategoryPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AddProduct from "../pages/AddProduct";
import Account from "../pages/Account";

export default function AppRoutes({ token, setToken }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route
          path="/products/:product_id"
          element={<SingleProductPage token={token} />}
        />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/account" element={<Account token={token} />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}
