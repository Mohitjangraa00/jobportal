import React, { useState } from "react";
import { Link } from "react-router-dom";

const ManageJobs = () => {
  // Dummy jobs (replace with API)
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Bangalore",
      type: "Full-Time",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Amazon",
      location: "Hyderabad",
      type: "Full-Time",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Adobe",
      location: "Mumbai",
      type: "Part-Time",
    },
  ]);

  // Delete job
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Jobs</h1>

          <Link
            to="/employer/post-job"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Post Job
          </Link>
        </div>

        {/* Job List */}
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet 😢</p>
        ) : (
          <div className="space-y-4">
            
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between"
              >
                
                {/* Job Info */}
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500">{job.location}</p>

                  <span className="inline-block mt-2 bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                    {job.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 md:mt-0 flex gap-3">
                  
                  <Link
                    to={`/employer/edit-job/${job.id}`}
                    className="bg-yellow-400 px-4 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;