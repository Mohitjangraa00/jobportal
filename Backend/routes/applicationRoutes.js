const express = require("express");
const router = express.Router();

const {
  applyJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");


// 📌 Apply for a job (User)
router.post("/apply/:jobId", authMiddleware, applyJob);


// 📌 Get logged-in user's applications
router.get("/my", authMiddleware, getMyApplications);


// 📌 Get all applications (Admin / Recruiter)
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "recruiter"),
  getAllApplications
);


// 📌 Update application status (Admin / Recruiter)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "recruiter"),
  updateApplicationStatus
);


// 📌 Delete application (User or Admin)
router.delete("/:id", authMiddleware, deleteApplication);


module.exports = router;