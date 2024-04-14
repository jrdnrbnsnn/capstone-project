const pg = require("pg");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/reachromeo"
);

// Add a product
async function addProduct(
  name,
  price,
  description,
  qtyAvailable,
  category,
  imageUrl
) {
  const SQL = `
      INSERT INTO products(product_id, name, price, description, qty_available, category, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
  //   console.log("***image url 2: ", imageUrl);
  const { rows } = await client.query(SQL, [
    uuid.v4(),
    name,
    price,
    description,
    qtyAvailable,
    category,
    imageUrl,
  ]);
  return rows[0];
}
// Create cart for a user
async function createCart(user_id) {
  const SQL = `
      INSERT INTO carts(cart_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
  const { rows } = await client.query(SQL, [uuid.v4(), user_id]);
  return rows[0];
}
// Function to delete a cart item with verification items belongs to user
async function deleteCartItem(cart_item_id, user_id) {
  const SQL = `
        DELETE FROM cart_items
        WHERE cart_item_id = $1
        AND cart_id IN (
          SELECT cart_id FROM carts WHERE user_id = $2
        )
        RETURNING *;
      `;
  const { rows } = await client.query(SQL, [cart_item_id, user_id]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

// Add an item to a cart
async function addItemToCart(cart_id, product_id, quantity) {
  const SQL = `
      INSERT INTO cart_items(cart_item_id, cart_id, product_id, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  const { rows } = await client.query(SQL, [
    uuid.v4(),
    cart_id,
    product_id,
    quantity,
  ]);
  return rows[0];
}

// Function to get all unique categories
async function getAllCategories() {
  const SQL = `
        SELECT DISTINCT category FROM products;
      `;
  const { rows } = await client.query(SQL);
  return rows;
}

// Function to get products by category
async function getProductsByCategory(category) {
  const SQL = `
        SELECT * FROM products WHERE category = $1;
      `;
  const { rows } = await client.query(SQL, [category]);
  return rows;
}

// Get cart items for a user
async function getCartItems(user_id) {
  const SQL = `
      SELECT cart_items.cart_item_id, cart_items.quantity, products.*
      FROM cart_items
      JOIN carts ON cart_items.cart_id = carts.cart_id
      JOIN products ON cart_items.product_id = products.product_id
      WHERE carts.user_id = $1;
    `;
  const { rows } = await client.query(SQL, [user_id]);
  return rows;
}

// Get a single product by its ID
async function getProductById(productId) {
  const SQL = `
        SELECT * FROM products WHERE product_id = $1;
      `;
  const { rows } = await client.query(SQL, [productId]);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

// Function to get all products
async function getAllProducts() {
  const SQL = `
      SELECT * FROM products;
    `;
  const { rows } = await client.query(SQL);
  return rows;
}

// Register
async function register(username, password) {
  const SQL = `
    INSERT INTO users(user_id, username, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await client.query(SQL, [uuid.v4(), username, hash]);
  const user = rows[0];
  return user;
}

// LOGIN
async function login(username, password) {
  const SQL = `
    SELECT * FROM users
    WHERE username = $1;
    `;
  const { rows } = await client.query(SQL, [username]);
  const user = rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const match = await bcrypt.compare(password, user.password);
  return user;
}

async function getAllUsers() {
  const SQL = `
    SELECT user_id, username FROM users;
    `;

  return client.query(SQL);
}

async function getCartByUserId(user_id) {
  const SQL = `
        SELECT * FROM carts
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
      `;
  const { rows } = await client.query(SQL, [user_id]);
  return rows.length ? rows[0] : null;
}

async function createTables() {
  const SQL = `
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
  
    CREATE TABLE users(
      user_id UUID PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE products(
      product_id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT NOT NULL,
      qty_available INT NOT NULL,
      category VARCHAR(255) NOT NULL,
      image_url TEXT NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE carts(
      cart_id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE cart_items(
      cart_item_id UUID PRIMARY KEY,
      cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(product_id),
      quantity INT NOT NULL,
      added_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;

  await client.query(SQL);
}

module.exports = {
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
  getCartByUserId,
  deleteCartItem,
};
