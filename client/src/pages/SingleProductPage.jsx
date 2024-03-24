import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSingleProductPage } from "../components";

export default function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const product = await fetchSingleProductPage(id);
      setProduct(product);
    }
    fetchData();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-wrapper">
      <div className="single-product-container">
        <h2>{product.title}</h2>
        <img
          src={product.image}
          alt={product.title}
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <p>Category: {product.category}</p>
        <p>Description: {product.description}</p>
        <p>Price: ${product.price}</p>
        <div>
          Rating: {product.rating.rate} ({product.rating.count} reviews)
        </div>
      </div>
    </div>
  );
}
