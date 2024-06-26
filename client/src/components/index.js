const BASE_URL = "https://two302-acc-capstone-fe-goh0.onrender.com/api";

export async function addProduct(productDetails) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productDetails),
    });
    if (!response.ok) throw new Error("Network response was not ok.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
}

export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSingleProduct() {
  try {
    const response = await fetch(`${BASE_URL}/products/14`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSingleProductPage(product_id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${product_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllCategories() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCategory(category) {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function register(username, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return result.token;
}

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return result.token;
}

export async function addItemtoCartFE({ product_id, quantity, token }) {
  try {
    const response = await fetch(`${BASE_URL}/carts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ product_id, quantity }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error adding the item to the cart", error);
  }
}

export async function getCartItemsFE(user_id, token) {
  try {
    const response = await fetch(`${BASE_URL}/carts/${user_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteItemFromCart(cart_item_id, token) {
  try {
    const response = await fetch(`${BASE_URL}/carts/delete/${cart_item_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Network response was not ok (status: ${response.status})`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error deleting the item", error);
    throw error;
  }
}
