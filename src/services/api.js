// ─────────────────────────────────────────────────────────────
//  api.js  —  JobPortal API Client
//  Handles: auth headers, JSON + multipart, error normalization,
//           token refresh redirect, request logging (dev only)
// ─────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const IS_DEV = process.env.NODE_ENV === "development";

// ─── Token helpers ───────────────────────────────────────────
export const getToken  = ()        => localStorage.getItem("token");
export const setToken  = (token)   => localStorage.setItem("token", token);
export const clearAuth = ()        => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ─── Normalize errors ────────────────────────────────────────
const normalizeError = (data, status) => {
  const message =
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null) ||
    `Request failed (${status})`;

  const err = new Error(message);
  err.status  = status;
  err.data    = data;
  err.isApiError = true;
  return err;
};

// ─── Core request ────────────────────────────────────────────
/**
 * @param {string} url           - endpoint path e.g. "/jobs"
 * @param {string} method        - HTTP verb
 * @param {object|null} body     - JSON body or null
 * @param {object} options       - extra options
 * @param {boolean} options.isFormData  - send as multipart/form-data
 * @param {AbortSignal} options.signal  - AbortController signal
 */
const request = async (
  url,
  method = "GET",
  body = null,
  { isFormData = false, signal = null } = {}
) => {
  const token = getToken();

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const config = {
    method,
    headers,
    signal,
    ...(body
      ? { body: isFormData ? body : JSON.stringify(body) }
      : {}),
  };

  if (IS_DEV) {
    console.groupCollapsed(`[API] ${method} ${url}`);
    console.log("Body:", body);
    console.groupEnd();
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${url}`, config);
  } catch (networkErr) {
    // Network failure (offline, CORS, etc.)
    const err = new Error("Network error — please check your connection.");
    err.isNetworkError = true;
    if (IS_DEV) console.error("[API] Network error:", networkErr);
    throw err;
  }

  // Parse response (JSON or empty)
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try { data = await res.json(); } catch { data = null; }
  }

  if (IS_DEV) {
    console.groupCollapsed(`[API] ← ${res.status} ${url}`);
    console.log("Response:", data);
    console.groupEnd();
  }

  // 401 → clear auth and redirect to login
  if (res.status === 401) {
    clearAuth();
    window.location.href = "/login";
    throw normalizeError(data, 401);
  }

  if (!res.ok) throw normalizeError(data, res.status);

  return data;
};

// ─── Convenience wrappers ─────────────────────────────────────
const api = {
  get:    (url, opts)       => request(url, "GET",    null, opts),
  post:   (url, body, opts) => request(url, "POST",   body, opts),
  put:    (url, body, opts) => request(url, "PUT",    body, opts),
  patch:  (url, body, opts) => request(url, "PATCH",  body, opts),
  delete: (url, opts)       => request(url, "DELETE", null, opts),

  /** Upload files via FormData */
  upload: (url, formData, method = "POST") =>
    request(url, method, formData, { isFormData: true }),
};

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════

/**
 * Register → saves token + user to localStorage
 * Expects: { token, user: { _id, name, email, role } }
 */
export const registerUser = async (formData) => {
  const res = await api.post("/auth/register", formData);
  if (res?.token) setToken(res.token);
  if (res?.user)  localStorage.setItem("user", JSON.stringify(res.user));
  return res;
};

/**
 * Login → saves token + user to localStorage
 */
export const loginUser = async (formData) => {
  const res = await api.post("/auth/login", formData);
  if (res?.token) setToken(res.token);
  if (res?.user)  localStorage.setItem("user", JSON.stringify(res.user));
  return res;
};

/**
 * Logout → clears localStorage
 */
export const logoutUser = () => clearAuth();

/**
 * Get logged-in user profile from API
 */
export const getMe = () => api.get("/auth/me");

/**
 * Update user profile
 */
export const updateProfile = (data) => api.put("/auth/profile", data);

/**
 * Upload profile picture (multipart)
 */
export const uploadProfilePic = (formData) =>
  api.upload("/auth/profile/pic", formData);

// ═══════════════════════════════════════════════════════════════
//  JOBS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all jobs — supports query params
 * @param {object} params - e.g. { keyword, location, type, page }
 */
export const getJobs = (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  return api.get(`/jobs${query ? `?${query}` : ""}`);
};

export const getJobById      = (id)       => api.get(`/jobs/${id}`);
export const createJob       = (data)     => api.post("/jobs", data);
export const updateJob       = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob       = (id)       => api.delete(`/jobs/${id}`);
export const getEmployerJobs = ()         => api.get("/jobs/my");

// ═══════════════════════════════════════════════════════════════
//  APPLICATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Apply for a job
 * @param {string} jobId
 * @param {object} data  - { name, email, phone, coverLetter }
 */
export const applyJob = (jobId, data = {}) =>
  api.post(`/applications/apply/${jobId}`, data);

/**
 * Apply with resume file (multipart)
 */
export const applyJobWithResume = (jobId, formData) =>
  api.upload(`/applications/apply/${jobId}`, formData);

/** Candidate: get my applications */
export const getMyApplications = () => api.get("/applications/my");

/** Employer: get all applications for their jobs */
export const getAllApplications = (jobId) =>
  api.get(jobId ? `/applications?jobId=${jobId}` : "/applications");

/** Employer: update application status */
export const updateApplicationStatus = (appId, status) =>
  api.patch(`/applications/${appId}/status`, { status });

/** Withdraw application */
export const withdrawApplication = (appId) =>
  api.delete(`/applications/${appId}`);

// ═══════════════════════════════════════════════════════════════
//  RESUME
// ═══════════════════════════════════════════════════════════════

export const uploadResume  = (formData) => api.upload("/resume/upload", formData);
export const deleteResume  = ()         => api.delete("/resume");
export const getMyResume   = ()         => api.get("/resume/my");

// ═══════════════════════════════════════════════════════════════
//  UTILS — AbortController helper
// ═══════════════════════════════════════════════════════════════

/**
 * Create a cancellable request pair
 * Usage:
 *   const { signal, cancel } = createCancelToken();
 *   getJobs({ keyword }, { signal });
 *   cancel(); // cancels in-flight request
 */
export const createCancelToken = () => {
  const controller = new AbortController();
  return { signal: controller.signal, cancel: () => controller.abort() };
};

export { api };
export default api;