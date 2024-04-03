import { useParams } from "react-router-dom";
import { addItemtoCartFE } from ".";
import { jwtDecode } from "jwt-decode";

export default function AddtoCartButton({ product_id, token }) {
  console.log(token);
  console.log(product_id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const quantity = 1;
    try {
      await addItemtoCartFE({ product_id, quantity, token });
      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add item to cart", error);
      alert("Failed to add item to cart");
    }
  };

  return <button onClick={handleAddToCart}>Add to cart</button>;
}
