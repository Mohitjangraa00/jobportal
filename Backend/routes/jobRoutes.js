const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  searchJobs,
} = require("../controllers/jobController");

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");


// 📌 Create Job (Admin / Recruiter)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "recruiter"),
  createJob
);


// 📌 Get All Jobs (Public)
router.get("/", getAllJobs);


// 📌 Search Jobs
router.get("/search", searchJobs);


// 📌 Get Single Job
router.get("/:id", getJobById);


// 📌 Update Job (Only Admin / Recruiter)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "recruiter"),
  updateJob
);


// 📌 Delete Job (Only Admin / Recruiter)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "recruiter"),
  deleteJob
);


module.exports = router;