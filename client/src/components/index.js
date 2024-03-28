const API_URL = "https://fakestoreapi.com";
const API_URL2 = "http://localhost:3000/api";

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSingleProduct() {
  try {
    const response = await fetch(`${API_URL}/products/14`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSingleProductPage(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchAllCategories() {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCategory(category) {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function register(username, password) {
  const response = await fetch(`${API_URL2}/register`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return result.token;
}

export async function login(username, password) {
  const response = await fetch(`${API_URL2}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return result.token;
}
