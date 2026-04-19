// ─────────────────────────────────────────────────────────────
//  services/authService.js
//  ✅ FIXED: Reads REACT_APP_BACKEND_URL from .env
//  Your .env: REACT_APP_BACKEND_URL=https://jobportal-1-20u5.onrender.com
// ─────────────────────────────────────────────────────────────

// ✅ This reads from your frontend .env file
const BASE = (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") + "/api";

// ─── Core fetch wrapper ───────────────────────────────────────
const apiFetch = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${BASE}${url}`, config);
  } catch (networkErr) {
    throw new Error("Cannot connect to server. Please check your connection.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

// ─── Auth functions ───────────────────────────────────────────

export const registerUser = async (formData) => {
  const res = await apiFetch("/auth/register", "POST", formData);
  if (res?.token) localStorage.setItem("token", res.token);
  if (res?.user)  localStorage.setItem("user",  JSON.stringify(res.user));
  return res;
};

export const loginUser = async (formData) => {
  const res = await apiFetch("/auth/login", "POST", formData);
  if (res?.token) localStorage.setItem("token", res.token);
  if (res?.user)  localStorage.setItem("user",  JSON.stringify(res.user));
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getMe         = ()     => apiFetch("/auth/me");
export const updateProfile = (data) => apiFetch("/auth/profile", "PUT", data);
export const changePassword= (data) => apiFetch("/auth/change-password", "PUT", data);

// Register OTP flow
export const sendRegisterOtp   = (email, name) => apiFetch("/auth/send-register-otp",   "POST", { email, name });
export const verifyRegisterOtp = (email, otp)  => apiFetch("/auth/verify-register-otp", "POST", { email, otp });

// Forgot password flow
export const forgotPassword = (email)                    => apiFetch("/auth/forgot-password", "POST", { email });
export const verifyOtp      = (email, otp)               => apiFetch("/auth/verify-otp",       "POST", { email, otp });
export const resetPassword  = (email, otp, newPassword)  => apiFetch("/auth/reset-password",   "POST", { email, otp, newPassword });

export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
};
