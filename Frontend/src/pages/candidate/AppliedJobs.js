import React, { useState } from "react";
import { Link } from "react-router-dom";

const AppliedJobs = () => {
  const [filter, setFilter] = useState("All");

  const [appliedJobs, setAppliedJobs] = useState([
    { id: 1, title: "Frontend Developer", company: "Google", location: "Bangalore", type: "Full-Time", status: "Under Review", date: "2026-04-01", salary: "₹18–28 LPA" },
    { id: 2, title: "Backend Developer", company: "Amazon", location: "Hyderabad", type: "Full-Time", status: "Shortlisted", date: "2026-03-28", salary: "₹22–35 LPA" },
    { id: 3, title: "UI/UX Designer", company: "Adobe", location: "Mumbai", type: "Internship", status: "Rejected", date: "2026-03-25", salary: "₹8–12 LPA" },
    { id: 4, title: "Full Stack Developer", company: "Microsoft", location: "Delhi", type: "Full-Time", status: "Interview Scheduled", date: "2026-03-20", salary: "₹20–32 LPA" },
  ]);

  const statusConfig = {
    "Under Review": { color: "#f59e0b", bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.2)", icon: "⏳" },
    "Shortlisted": { color: "#22c55e", bg: "rgba(34,197,94,.08)", border: "rgba(34,197,94,.2)", icon: "⭐" },
    "Rejected": { color: "#ef4444", bg: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.2)", icon: "✗" },
    "Interview Scheduled": { color: "#6366f1", bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.2)", icon: "🎯" },
  };

  const filters = ["All", "Under Review", "Shortlisted", "Interview Scheduled", "Rejected"];
  const filtered = filter === "All" ? appliedJobs : appliedJobs.filter((j) => j.status === filter);

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === "All" ? appliedJobs.length : appliedJobs.filter((j) => j.status === f).length;
    return acc;
  }, {});

  const withdraw = (id) => setAppliedJobs((prev) => prev.filter((j) => j.id !== id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .aj-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .aj-wrap { max-width: 860px; margin: 0 auto; }
        .aj-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }
        .aj-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #0f2027; margin-bottom: 28px; }

        /* Filter tabs */
        .filter-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 24px; scrollbar-width: none; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .ft-btn { padding: 8px 16px; border-radius: 99px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; white-space: nowrap; transition: all .18s; display: flex; align-items: center; gap: 6px; }
        .ft-btn:hover { border-color: #6366f1; color: #6366f1; }
        .ft-btn.active { background: #0f2027; border-color: #0f2027; color: #fff; }
        .ft-count { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; background: rgba(255,255,255,.2); border-radius: 99px; padding: 1px 7px; }
        .ft-btn:not(.active) .ft-count { background: #f1f5f9; color: #64748b; }

        /* Cards */
        .aj-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 18px; padding: 22px 24px; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 16px; transition: border-color .18s, box-shadow .18s; }
        .aj-card:hover { border-color: #6366f1; box-shadow: 0 4px 20px rgba(99,102,241,.09); }

        .aj-logo { width: 46px; height: 46px; border-radius: 12px; background: #f1f5f9; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f2027; flex-shrink: 0; }

        .aj-body { flex: 1; min-width: 0; }
        .aj-job-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #0f2027; margin-bottom: 3px; }
        .aj-company { font-size: 13px; color: #64748b; margin-bottom: 10px; }
        .aj-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
        .aj-meta-item { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }

        .aj-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
        .aj-status { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 99px; border: 1px solid; font-family: 'Syne', sans-serif; }
        .aj-actions { display: flex; gap: 8px; }
        .aj-btn { padding: 7px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; transition: all .15s; }
        .aj-btn.view { background: #0f2027; color: #fff; }
        .aj-btn.view:hover { background: #1e3a4a; }
        .aj-btn.withdraw { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; }
        .aj-btn.withdraw:hover { background: #fee2e2; }

        /* Empty */
        .empty { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 64px 24px; text-align: center; }
        .empty-icon { font-size: 48px; margin-bottom: 14px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .empty-sub { font-size: 14px; color: #94a3b8; margin-bottom: 20px; }
        .empty-btn { display: inline-block; padding: 12px 24px; background: #0f2027; color: #fff; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; }
      `}</style>

      <div className="aj-root">
        <div className="aj-wrap">
          <p className="aj-tag">My Applications</p>
          <h1 className="aj-title">Applied Jobs</h1>

          <div className="filter-scroll">
            {filters.map((f) => (
              <button key={f} className={`ft-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f} <span className="ft-count">{counts[f]}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No applications here</div>
              <p className="empty-sub">You haven't applied to any jobs yet. Start browsing!</p>
              <Link to="/jobs" className="empty-btn">Browse Jobs →</Link>
            </div>
          ) : (
            filtered.map((job) => {
              const sc = statusConfig[job.status] || statusConfig["Under Review"];
              return (
                <div className="aj-card" key={job.id}>
                  <div className="aj-logo">{job.company[0]}</div>
                  <div className="aj-body">
                    <div className="aj-job-title">{job.title}</div>
                    <div className="aj-company">{job.company}</div>
                    <div className="aj-meta">
                      <span className="aj-meta-item">📍 {job.location}</span>
                      <span className="aj-meta-item">💼 {job.type}</span>
                      <span className="aj-meta-item">💰 {job.salary}</span>
                      <span className="aj-meta-item">🗓️ Applied {job.date}</span>
                    </div>
                    <div className="aj-footer">
                      <div className="aj-status" style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}>
                        {sc.icon} {job.status}
                      </div>
                      <div className="aj-actions">
                        <Link to={`/jobs/${job.id}`} className="aj-btn view">View Job</Link>
                        <button className="aj-btn withdraw" onClick={() => withdraw(job.id)}>Withdraw</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AppliedJobs;