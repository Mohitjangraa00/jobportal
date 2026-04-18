// ─────────────────────────────────────────────────────────────
//  services/authService.js
//  Frontend service — all auth API calls
// ─────────────────────────────────────────────────────────────

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── Core fetch wrapper ───────────────────────────────────────
const apiFetch = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res  = await fetch(`${BASE}${url}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // ✅ Throw error object that has a .message property
    // This fixes err?.response?.data?.message not working (that's axios syntax)
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }

  return data;
};

// ─── Register ─────────────────────────────────────────────────
export const registerUser = async (formData) => {
  const res = await apiFetch("/auth/register", "POST", formData);

  // Save to localStorage
  if (res?.token) localStorage.setItem("token", res.token);
  if (res?.user)  localStorage.setItem("user",  JSON.stringify(res.user));

  return res;
};

// ─── Login ────────────────────────────────────────────────────
export const loginUser = async (formData) => {
  const res = await apiFetch("/auth/login", "POST", formData);

  // Save to localStorage
  if (res?.token) localStorage.setItem("token", res.token);
  if (res?.user)  localStorage.setItem("user",  JSON.stringify(res.user));

  return res;
};

// ─── Logout ───────────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ─── Get current user from localStorage (no API call) ─────────
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
};

// ─── Get Me (from API) ────────────────────────────────────────
export const getMe = () => apiFetch("/auth/me");

// ─── Update profile ───────────────────────────────────────────
export const updateProfile = async (formData) => {
  const res = await apiFetch("/auth/profile", "PUT", formData);
  // Update stored user
  if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));
  return res;
};

// ─── Change password ──────────────────────────────────────────
export const changePassword = (data) => apiFetch("/auth/change-password", "PUT", data);

// ─── Forgot password ──────────────────────────────────────────
export const forgotPassword  = (email)                  => apiFetch("/auth/forgot-password", "POST", { email });
export const verifyOtp       = (email, otp)             => apiFetch("/auth/verify-otp",      "POST", { email, otp });
export const resetPassword   = (email, otp, newPassword) => apiFetch("/auth/reset-password",  "POST", { email, otp, newPassword });