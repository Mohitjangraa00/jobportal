const Job = require("../models/Job");


// 📌 Create Job (Admin / Recruiter)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Update Job (Only creator/admin)
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Optional: check ownership
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Optional: check ownership
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 📌 Search Jobs (by keyword, location)
exports.searchJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query);

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};