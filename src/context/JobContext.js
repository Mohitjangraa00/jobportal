import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const JobContext = createContext();

// Provider
export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Jobs (Dummy or API)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // 🔥 Replace with API later
        const data = [
          {
            id: 1,
            title: "Frontend Developer",
            company: "Google",
            location: "Bangalore",
            type: "Full-Time",
            salary: "₹8 LPA",
          },
          {
            id: 2,
            title: "Backend Developer",
            company: "Amazon",
            location: "Hyderabad",
            type: "Full-Time",
            salary: "₹10 LPA",
          },
        ];

        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ➕ Add Job
  const addJob = (job) => {
    setJobs((prev) => [...prev, job]);
  };

  // ✏️ Update Job
  const updateJob = (updatedJob) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
  };

  // ❌ Delete Job
  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <JobContext.Provider
      value={{ jobs, loading, addJob, updateJob, deleteJob }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Custom Hook
export const useJobs = () => {
  return useContext(JobContext);
};