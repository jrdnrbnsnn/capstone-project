import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSingleProductPage } from "../components";

export default function SingleProductPage() {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const product = await fetchSingleProductPage(product_id);
      setProduct(product);
    }
    fetchData();
  }, [product_id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="single-product-container">
        <h2>{product.name}</h2>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <p>Category: {product.category}</p>
        <p>Description: {product.description}</p>
        <p>Price: ${product.price}</p>
      </div>
    </div>
  );
}
