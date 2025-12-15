const API_BASE = "http://localhost:5000";

export async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    throw new Error(`Failed to create order: ${res.statusText}`);
  }
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }
  return res.json();
}

export async function createReview(reviewData) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) {
    throw new Error(`Failed to create review: ${res.statusText}`);
  }
  return res.json();
}

export async function getReviews() {
  const res = await fetch(`${API_BASE}/api/reviews`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.statusText}`);
  }
  return res.json();
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }
  return res.json();
}

export async function loginUser(userData) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }
  return res.json();
}
