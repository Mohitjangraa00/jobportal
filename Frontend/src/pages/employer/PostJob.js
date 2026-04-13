import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-Time",
    description: "",
  });

  const [message, setMessage] = useState("");

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.title ||
      !form.company ||
      !form.location ||
      !form.description
    ) {
      setMessage("Please fill all required fields");
      return;
    }

    // 🔥 Dummy submit (replace with API)
    console.log("Job Posted:", form);

    setMessage("Job posted successfully ✅");

    // Redirect after 1.5 sec
    setTimeout(() => {
      navigate("/employer/manage-jobs");
    }, 1500);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Post a New Job
        </h1>

        {/* Message */}
        {message && (
          <p className="text-green-600 text-center mb-4">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Job Title */}
          <div>
            <label className="block mb-1 font-medium">Job Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Enter job title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block mb-1 font-medium">Company *</label>
            <input
              type="text"
              name="company"
              placeholder="Company name"
              value={form.company}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium">Location *</label>
            <input
              type="text"
              name="location"
              placeholder="Job location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block mb-1 font-medium">Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="e.g. ₹5-10 LPA"
              value={form.salary}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block mb-1 font-medium">Job Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">
              Job Description *
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Write job details..."
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Post Job
            </button>

            <button
              type="button"
              onClick={() => navigate("/employer/dashboard")}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJob;