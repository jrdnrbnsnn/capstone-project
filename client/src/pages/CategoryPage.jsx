import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategory } from "../components";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchCategory(categoryName);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      }
    }
    fetchData();
  }, [categoryName]);

  return (
    <div className="product-list">
      <h1>{categoryName}</h1>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.title}</h2>
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.title} />
              </Link>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>
                Rating: {product.rating.rate} out of {product.rating.count}{" "}
                reviews
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}
