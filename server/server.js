const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {
  client,
  createTables,
  getAllUsers,
  login,
  register,
  addProduct,
  createCart,
  addItemToCart,
  getCartItems,
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
} = require("./db");
const app = express();

app.use(express.json());
app.use(cors());

// LOGIN ROUTE
app.post("/api/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

// REGISTER ROUTE
app.post("/api/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await register(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

function requireToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// GET ALL USERS ROUTE - PROTECTED
app.get("/api/users", requireToken, async (req, res, next) => {
  const users = await getAllUsers();
  res.send(users.rows);
});

// Route to get all unique product categories
app.get("/api/categories", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json(categories.map((category) => category.category)); // Simplify the response to an array of strings
  } catch (error) {
    next(error);
  }
});

// Route to get products by category
app.get("/api/products/category/:categoryName", async (req, res, next) => {
  const { categoryName } = req.params;
  try {
    const products = await getProductsByCategory(categoryName);
    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found in this category" });
    }
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Route to add a product - need to add amdin functionality
app.post("/api/products", async (req, res, next) => {
  const { name, price, description, qtyAvailable, category, imageUrl } =
    req.body;
  try {
    const product = await addProduct(
      name,
      price,
      description,
      qtyAvailable,
      category,
      imageUrl
    );
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Route to add an item to a cart
app.post("/api/carts/add", async (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Check if the user already has a cart, if not, create one
    let userCart = await getCartByUserId(userId);
    if (!userCart) {
      userCart = await createCart(userId);
    }
    const cartItem = await addItemToCart(userCart.cart_id, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Route to view cart items
app.get("/api/carts/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const items = await getCartItems(userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Route to get all products
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

async function init() {
  client.connect();
  createTables();

  app.listen(3000, () => {
    console.log("The server is listening on port 3000!");
  });
}

init();
