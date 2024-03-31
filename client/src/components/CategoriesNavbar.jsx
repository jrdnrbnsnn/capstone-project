import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllCategories } from ".";

export default function NavbarCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await fetchAllCategories();
        console.log(categories);
        setCategories(categories);
        console.log(categories);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="navbar-categories">
      <nav>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/categories/${category}`}>{category}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
