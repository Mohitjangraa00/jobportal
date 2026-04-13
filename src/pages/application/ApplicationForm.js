import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ApplicationForm = () => {
  const { id } = useParams(); // job id
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });

  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      setForm({ ...form, resume: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.phone || !form.resume) {
      setError("Please fill all required fields");
      return;
    }

    // 🔥 Dummy submit (replace with API)
    console.log("Application Submitted:", form);

    alert("Application submitted successfully 🚀");
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Apply for Job #{id}
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block mb-1 font-medium">
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white"
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block mb-1 font-medium">Cover Letter</label>
            <textarea
              name="coverLetter"
              placeholder="Write your cover letter..."
              value={form.coverLetter}
              onChange={handleChange}
              rows="4"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Application
          </button>
        </form>

      </div>
    </div>
  );
};

export default ApplicationForm;