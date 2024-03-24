const API_URL = "https://fakestoreapi.com";

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
