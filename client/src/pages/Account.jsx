import { useState } from "react";
import { useEffect } from "react";
import { getCartItemsFE } from "../components";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DeleteFromCartButton from "../components/DeleteFromCartButton";

export default function Account({ token }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/register");
      return;
    }
  }, [navigate, token]);
  useEffect(() => {
    async function fetchData() {
      try {
        const decoded = jwtDecode(token);
        const user_id = decoded.user_id;
        if (!user_id) {
          throw new Error("User ID not found in token");
        }
        const items = await getCartItemsFE(user_id, token);
        setItems(items);
        console.log(items);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    }
    fetchData();
  }, [token]);

  return (
    <>
      <div>
        <h2>Account</h2>
        {error && <p>Error: {error}</p>}
        <ul>
          {items &&
            items.map((item) => (
              <li key={item.cart_item_id}>
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Category: {item.category}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <DeleteFromCartButton
                  token={token}
                  cart_item_id={item.cart_item_id}
                />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
