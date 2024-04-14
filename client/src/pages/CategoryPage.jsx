import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategory } from "../components";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const { categoryName } = useParams();
  console.log(categoryName);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchCategory(categoryName);
        setProducts(data);
        console.log(data);
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
              <h2>{product.name}</h2>
              <Link to={`/products/${product.product_id}`}>
                <img src={product.image_url} alt={product.title} />
              </Link>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}
