import request from "./api";

// 📄 Apply for a job
export const applyForJob = (data) => {
  return request("/applications", "POST", data);
};

// 📋 Get all applications (candidate)
export const getMyApplications = () => {
  return request("/applications/my");
};

// 🏢 Get applicants for a job (employer)
export const getApplicantsByJob = (jobId) => {
  return request(`/applications/job/${jobId}`);
};

// 🔄 Update application status (Accept / Reject)
export const updateApplicationStatus = (id, status) => {
  return request(`/applications/${id}`, "PUT", { status });
};

// ❌ Delete application (optional)
export const deleteApplication = (id) => {
  return request(`/applications/${id}`, "DELETE");
};