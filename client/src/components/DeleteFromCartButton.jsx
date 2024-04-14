import { deleteItemFromCart } from ".";

export default function DeleteFromCartButton({
  cart_item_id,
  token,
  onSuccess,
}) {
  const handleDeletefromCart = async (e) => {
    e.preventDefault();
    try {
      await deleteItemFromCart(cart_item_id, token);
      alert("Item deleted from cart!");
    } catch (error) {
      console.error("Failed to delete item from cart", error);
      alert("Failed to delete item from cart");
    }
  };
  return <button onClick={handleDeletefromCart}>Remove from cart</button>;
}
