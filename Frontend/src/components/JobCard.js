import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);
  if (!job) return null;

  const jobId = job._id || job.id;

  const modeColor = {
    Remote:   { bg: "rgba(34,197,94,.08)",  border: "rgba(34,197,94,.22)",  color: "#16a34a" },
    Hybrid:   { bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.22)", color: "#d97706" },
    "On-site":{ bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.22)", color: "#6366f1" },
  };

  const typeColor = {
    "Full-Time":  { bg: "rgba(99,102,241,.08)",  border: "rgba(99,102,241,.2)",  color: "#6366f1" },
    "Part-Time":  { bg: "rgba(245,158,11,.08)",  border: "rgba(245,158,11,.2)",  color: "#d97706" },
    "Internship": { bg: "rgba(34,197,94,.08)",   border: "rgba(34,197,94,.2)",   color: "#16a34a" },
    "Contract":   { bg: "rgba(239,68,68,.08)",   border: "rgba(239,68,68,.2)",   color: "#ef4444" },
  };

  const tc = typeColor[job.type] || typeColor["Full-Time"];
  const mc = modeColor[job.mode] || modeColor["On-site"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

        .jc-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 18px; padding: 22px; display: flex; flex-direction: column; font-family:'DM Sans',sans-serif; transition: border-color .18s, transform .15s, box-shadow .18s; }
        .jc-card:hover { border-color: #6366f1; transform: translateY(-3px); box-shadow: 0 8px 28px rgba(99,102,241,.1); }

        .jc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .jc-logo { width: 44px; height: 44px; border-radius: 11px; background: #f1f5f9; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family:'Syne',sans-serif; font-size: 17px; font-weight: 800; color: #0f2027; flex-shrink: 0; }
        .jc-save { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; transition: border-color .18s, background .18s; flex-shrink: 0; }
        .jc-save:hover, .jc-save.saved { border-color: #6366f1; background: rgba(99,102,241,.06); }

        .jc-company { font-size: 12px; color: #94a3b8; margin-bottom: 3px; margin-top: 10px; }
        .jc-title { font-family:'Syne',sans-serif; font-size: 15px; font-weight: 700; color: #0f2027; margin-bottom: 12px; line-height: 1.3; }

        .jc-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .jc-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; border: 1px solid; font-family:'Syne',sans-serif; }

        .jc-loc { font-size: 12px; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 4px; }

        .jc-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
        .jc-skill { font-size: 11px; padding: 3px 8px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 99px; color: #64748b; }

        .jc-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f1f5f9; margin-top: auto; }
        .jc-salary { font-family:'Syne',sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .jc-posted { font-size: 11px; color: #94a3b8; }

        .jc-actions { display: flex; gap: 8px; margin-top: 14px; }
        .jc-btn-primary { flex: 1; padding: 9px; background: #0f2027; color: #fff; border: none; border-radius: 9px; font-family:'Syne',sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: none; text-align: center; transition: background .18s; display: block; }
        .jc-btn-primary:hover { background: #1e3a4a; }
        .jc-btn-ghost { padding: 9px 14px; background: #f8fafc; border: 1.5px solid #e5e7eb; border-radius: 9px; font-family:'Syne',sans-serif; font-size: 12px; font-weight: 700; color: #374151; text-decoration: none; text-align: center; transition: border-color .18s; display: block; }
        .jc-btn-ghost:hover { border-color: #6366f1; color: #6366f1; }
      `}</style>

      <div className="jc-card">
        <div className="jc-top">
          <div className="jc-logo">{(job.company || "?")[0].toUpperCase()}</div>
          <button className={`jc-save${saved ? " saved" : ""}`} onClick={() => setSaved(!saved)} title={saved ? "Unsave" : "Save job"}>
            {saved ? "🔖" : "🤍"}
          </button>
        </div>

        <div className="jc-company">{job.company || "Company"}</div>
        <div className="jc-title">{job.title || "Job Title"}</div>

        <div className="jc-badges">
          {job.type && <span className="jc-badge" style={{ background: tc.bg, borderColor: tc.border, color: tc.color }}>{job.type}</span>}
          {job.mode && <span className="jc-badge" style={{ background: mc.bg, borderColor: mc.border, color: mc.color }}>{job.mode}</span>}
        </div>

        {job.location && <div className="jc-loc">📍 {job.location}</div>}

        {job.skills?.length > 0 && (
          <div className="jc-skills">
            {job.skills.slice(0, 3).map((s) => <span key={s} className="jc-skill">{s}</span>)}
            {job.skills.length > 3 && <span className="jc-skill">+{job.skills.length - 3}</span>}
          </div>
        )}

        <div className="jc-footer">
          <span className="jc-salary">{job.salary || "Competitive"}</span>
          {job.posted && <span className="jc-posted">🕐 {job.posted}</span>}
        </div>

        <div className="jc-actions">
          <Link to={`/jobs/${jobId}`} className="jc-btn-primary">View & Apply</Link>
          <Link to={`/jobs/${jobId}`} className="jc-btn-ghost">Details</Link>
        </div>
      </div>
    </>
  );
};

export default JobCard;