import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ✅ Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ───────────────────────────────────────────────

/**
 * Login user
 * Expects API to return: { token, user: { _id, name, email, role } }
 */
export const loginUser = async (formData) => {
  const res = await API.post("/auth/login", formData);

  // ✅ Save token + user to localStorage so ProtectedRoute can read them
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  if (res.data?.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

/**
 * Register user
 * Expects API to return: { token, user: { _id, name, email, role } }
 */
export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);

  // Auto-login after register (optional — remove if you want manual login)
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  if (res.data?.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

/**
 * Logout — clears localStorage and reloads
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Get current user from localStorage (no API call)
 */
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};