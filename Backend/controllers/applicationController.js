const Application = require("../models/Application");
const Job = require("../models/Job");

// 📌 Apply for a Job
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied" });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Get all applications (Admin / Recruiter)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")
      .populate("applicant", "name email");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Get applications for logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ applicant: userId })
      .populate("job");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status || application.status;
    await application.save();

    res.status(200).json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.deleteOne();

    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};