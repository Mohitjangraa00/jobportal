// ─────────────────────────────────────────────────────────────
//  api.js  —  JobPortal API Client
//  ✅ FIX: Uses REACT_APP_BACKEND_URL from .env correctly
// ─────────────────────────────────────────────────────────────

// ✅ FIXED: Was hardcoded to localhost — now reads from .env
// Your .env has REACT_APP_BACKEND_URL=https://jobportal-1-20u5.onrender.com
// We append /api to it
const BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") + "/api";

const IS_DEV = process.env.NODE_ENV === "development";

// ─── Token helpers ────────────────────────────────────────────
export const getToken  = ()      => localStorage.getItem("token");
export const setToken  = (t)     => localStorage.setItem("token", t);
export const clearAuth = ()      => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ─── Error normalizer ─────────────────────────────────────────
const normalizeError = (data, status) => {
  const message =
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null) ||
    `Request failed (${status})`;
  const err      = new Error(message);
  err.status     = status;
  err.data       = data;
  err.isApiError = true;
  return err;
};

// ─── Core fetch ───────────────────────────────────────────────
const request = async (
  url,
  method = "GET",
  body   = null,
  { isFormData = false, signal = null } = {}
) => {
  const token   = getToken();
  const headers = {};
  if (token)      headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const config = {
    method,
    headers,
    signal,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  };

  if (IS_DEV) {
    console.groupCollapsed(`[API] ${method} ${url}`);
    console.log("URL:", `${BASE_URL}${url}`);
    console.log("Body:", body);
    console.groupEnd();
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${url}`, config);
  } catch (networkErr) {
    if (IS_DEV) console.error("[API] Network error:", networkErr);
    throw new Error("Cannot connect to server. Please check your connection.");
  }

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  }

  if (IS_DEV) {
    console.groupCollapsed(`[API] ← ${res.status} ${url}`);
    console.log("Response:", data);
    console.groupEnd();
  }

  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw normalizeError(data, 401);
  }

  if (!res.ok) throw normalizeError(data, res.status);

  return data;
};

// ─── Wrappers ─────────────────────────────────────────────────
const api = {
  get:    (url, opts)       => request(url, "GET",    null, opts),
  post:   (url, body, opts) => request(url, "POST",   body, opts),
  put:    (url, body, opts) => request(url, "PUT",    body, opts),
  patch:  (url, body, opts) => request(url, "PATCH",  body, opts),
  delete: (url, opts)       => request(url, "DELETE", null, opts),
  upload: (url, fd, method = "POST") => request(url, method, fd, { isFormData: true }),
};

// ═══════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════
export const registerUser   = async (data) => {
  const res = await api.post("/auth/register", data);
  if (res?.token) setToken(res.token);
  if (res?.user)  localStorage.setItem("user", JSON.stringify(res.user));
  return res;
};

export const loginUser      = async (data) => {
  const res = await api.post("/auth/login", data);
  if (res?.token) setToken(res.token);
  if (res?.user)  localStorage.setItem("user", JSON.stringify(res.user));
  return res;
};

export const logoutUser     = () => clearAuth();
export const getMe          = () => api.get("/auth/me");
export const updateProfile  = (data) => api.put("/auth/profile", data);
export const uploadProfilePic = (fd) => api.upload("/auth/profile/pic", fd);

// Register OTP helpers (used by Register.js)
export const sendRegisterOtp   = (email, name) => api.post("/auth/send-register-otp",   { email, name });
export const verifyRegisterOtp = (email, otp)  => api.post("/auth/verify-register-otp", { email, otp });

// Forgot password helpers (used by ForgotPassword.js)
export const forgotPassword  = (email)                   => api.post("/auth/forgot-password", { email });
export const verifyOtp       = (email, otp)              => api.post("/auth/verify-otp",       { email, otp });
export const resetPassword   = (email, otp, newPassword) => api.post("/auth/reset-password",   { email, otp, newPassword });

// ═══════════════════════════════════════════════════════════
//  JOBS
// ═══════════════════════════════════════════════════════════
export const getJobs = (params = {}) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  return api.get(`/jobs${q ? `?${q}` : ""}`);
};

export const getJobById      = (id)       => api.get(`/jobs/${id}`);
export const createJob       = (data)     => api.post("/jobs", data);
export const updateJob       = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob       = (id)       => api.delete(`/jobs/${id}`);
export const getEmployerJobs = ()         => api.get("/jobs/my");

// ═══════════════════════════════════════════════════════════
//  APPLICATIONS
// ═══════════════════════════════════════════════════════════
export const applyJob                = (jobId, data = {}) => api.post(`/applications/apply/${jobId}`, data);
export const applyJobWithResume      = (jobId, fd)        => api.upload(`/applications/apply/${jobId}`, fd);
export const getMyApplications       = ()                  => api.get("/applications/my");
export const getAllApplications       = (jobId)            => api.get(jobId ? `/applications?jobId=${jobId}` : "/applications");
export const updateApplicationStatus = (appId, status)    => api.patch(`/applications/${appId}/status`, { status });
export const withdrawApplication     = (appId)            => api.delete(`/applications/${appId}`);

// ═══════════════════════════════════════════════════════════
//  RESUME
// ═══════════════════════════════════════════════════════════
export const uploadResume = (fd) => api.upload("/resume/upload", fd);
export const deleteResume = ()   => api.delete("/resume");
export const getMyResume  = ()   => api.get("/resume/my");

// ═══════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════
export const createCancelToken = () => {
  const c = new AbortController();
  return { signal: c.signal, cancel: () => c.abort() };
};

export { api };
export default api;