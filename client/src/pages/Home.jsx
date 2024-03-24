import { fetchProducts, fetchSingleProduct } from "../components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const products = await fetchProducts();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const product = await fetchSingleProduct();
        setProduct(product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="featured-product">
        <ul>
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              <img src={product.image} alt={product.title} />
            </Link>
            <p>See the Unreal. Click Image</p>
          </li>
        </ul>
      </div>
      <div className="product-list">
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
    </>
  );
}
