import { useState } from "react";
import { addProduct } from "../components";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    qtyAvailable: "",
    category: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addProduct(product);
      alert("Product added successfully!");
      //   console.log(data);
      setProduct({
        name: "",
        price: "",
        description: "",
        qtyAvailable: "",
        category: "",
        imageUrl: "",
      });
    } catch (error) {
      alert("Failed to add product. Error: " + error.message);
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="number"
          name="qtyAvailable"
          value={product.qtyAvailable}
          onChange={handleChange}
          placeholder="Quantity Available"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          type="text"
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
