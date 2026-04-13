import request from "./api";

// 📋 Get all jobs
export const getAllJobs = () => {
  return request("/jobs");
};

// 🔍 Get single job by ID
export const getJobById = (id) => {
  return request(`/jobs/${id}`);
};

// ➕ Create new job (Employer)
export const createJob = (data) => {
  return request("/jobs", "POST", data);
};

// ✏️ Update job
export const updateJob = (id, data) => {
  return request(`/jobs/${id}`, "PUT", data);
};

// ❌ Delete job
export const deleteJob = (id) => {
  return request(`/jobs/${id}`, "DELETE");
};

// 🔎 Search jobs (optional)
export const searchJobs = (query) => {
  return request(`/jobs/search?q=${query}`);
};