import { addItemtoCartFE } from ".";

export default function AddtoCartButton({ product_id, token }) {
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
