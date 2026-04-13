import React from "react";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) || { name: "Employer" }; } catch { return { name: "Employer" }; } })();

  const stats = [
    { label: "Total Jobs", value: 8, icon: "📋", color: "#6366f1", bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.2)" },
    { label: "Active Jobs", value: 5, icon: "✅", color: "#22c55e", bg: "rgba(34,197,94,.08)", border: "rgba(34,197,94,.2)" },
    { label: "Total Applicants", value: 42, icon: "👥", color: "#f59e0b", bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.2)" },
    { label: "Interviews", value: 7, icon: "🎯", color: "#3b82f6", bg: "rgba(59,130,246,.08)", border: "rgba(59,130,246,.2)" },
  ];

  const quickActions = [
    { to: "/employer/post-job", icon: "➕", title: "Post a Job", desc: "Create and publish new job listings to attract talent" },
    { to: "/employer/manage-jobs", icon: "🗂️", title: "Manage Jobs", desc: "Edit, pause, or delete your active postings" },
    { to: "/employer/applicants", icon: "👥", title: "Applicants", desc: "Review and manage incoming applications" },
    { to: "/profile", icon: "🏢", title: "Company Profile", desc: "Update your company details and branding" },
  ];

  const recentJobs = [
    { id: 1, title: "Frontend Developer", applicants: 14, status: "Active", posted: "Apr 1" },
    { id: 2, title: "Backend Engineer", applicants: 9, status: "Active", posted: "Mar 28" },
    { id: 3, title: "UI/UX Designer", applicants: 19, status: "Paused", posted: "Mar 20" },
  ];

  const recentApplicants = [
    { name: "Mohit Kumar", role: "Frontend Developer", status: "Under Review", color: "#f59e0b", bg: "rgba(245,158,11,.08)" },
    { name: "Priya Sharma", role: "Backend Engineer", status: "Shortlisted", color: "#22c55e", bg: "rgba(34,197,94,.08)" },
    { name: "Rahul Verma", role: "UI/UX Designer", status: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,.08)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ed-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .ed-wrap { max-width: 1060px; margin: 0 auto; }
        .ed-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }

        /* Banner */
        .ed-banner { background: #0f2027; border-radius: 20px; padding: 40px 44px; position: relative; overflow: hidden; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .ed-orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
        .ed-orb.o1 { width: 320px; height: 320px; background: rgba(99,102,241,.2); top: -100px; right: -80px; }
        .ed-orb.o2 { width: 200px; height: 200px; background: rgba(34,211,238,.1); bottom: -60px; left: 25%; }
        .ed-hello { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; color: #fff; margin-bottom: 6px; position: relative; z-index: 1; }
        .ed-hello-sub { font-size: 14px; color: rgba(255,255,255,.5); position: relative; z-index: 1; }
        .ed-banner-btn { padding: 12px 24px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 10px; color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; transition: background .2s; position: relative; z-index: 1; white-space: nowrap; }
        .ed-banner-btn:hover { background: rgba(255,255,255,.18); }

        /* Stats */
        .ed-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        @media (max-width: 700px) { .ed-stats { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 22px 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0f2027; line-height: 1; }
        .stat-lbl { font-size: 12px; color: #94a3b8; margin-top: 3px; }

        /* Grid */
        .ed-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        @media (max-width: 820px) { .ed-grid { grid-template-columns: 1fr; } }

        .card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; overflow: hidden; }
        .card-header { padding: 20px 24px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #0f2027; }
        .card-link { font-size: 13px; color: #6366f1; font-weight: 600; text-decoration: none; }
        .card-link:hover { text-decoration: underline; }

        /* Quick actions */
        .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .qa-item { padding: 22px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; text-decoration: none; display: block; transition: background .15s; }
        .qa-item:nth-child(2n) { border-right: none; }
        .qa-item:nth-last-child(-n+2) { border-bottom: none; }
        .qa-item:hover { background: #fafafa; }
        .qa-icon { font-size: 24px; margin-bottom: 10px; }
        .qa-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }
        .qa-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; }

        /* Recent jobs table */
        .rj-item { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 14px; }
        .rj-item:last-child { border-bottom: none; }
        .rj-logo { width: 36px; height: 36px; border-radius: 9px; background: #f1f5f9; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .rj-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .rj-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .rj-status { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; font-family: 'Syne', sans-serif; white-space: nowrap; }
        .rj-status.active { background: rgba(34,197,94,.08); color: #16a34a; border: 1px solid rgba(34,197,94,.2); }
        .rj-status.paused { background: rgba(245,158,11,.08); color: #d97706; border: 1px solid rgba(245,158,11,.2); }
        .rj-edit { font-size: 12px; color: #6366f1; font-weight: 600; text-decoration: none; white-space: nowrap; }
        .rj-edit:hover { text-decoration: underline; }

        /* Applicant sidebar items */
        .ap-item { padding: 14px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
        .ap-item:last-child { border-bottom: none; }
        .ap-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0f2027; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .ap-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .ap-role { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .ap-status { margin-left: auto; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; font-family: 'Syne', sans-serif; white-space: nowrap; }

        /* Post job CTA */
        .post-cta { padding: 24px; text-align: center; }
        .post-cta-icon { font-size: 36px; margin-bottom: 10px; }
        .post-cta-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .post-cta-sub { font-size: 13px; color: #94a3b8; margin-bottom: 18px; line-height: 1.5; }
        .post-cta-btn { display: block; padding: 12px; background: #0f2027; color: #fff; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; transition: background .18s; }
        .post-cta-btn:hover { background: #1e3a4a; }
      `}</style>

      <div className="ed-root">
        <div className="ed-wrap">
          <p className="ed-tag">Employer Portal</p>

          {/* Banner */}
          <div className="ed-banner">
            <div className="ed-orb o1" /><div className="ed-orb o2" />
            <div>
              <div className="ed-hello">Welcome, {user.name?.split(" ")[0]} 👨‍💼</div>
              <div className="ed-hello-sub">You have 14 new applicants and 5 active job listings.</div>
            </div>
            <Link to="/employer/post-job" className="ed-banner-btn">+ Post New Job</Link>
          </div>

          {/* Stats */}
          <div className="ed-stats">
            {stats.map(({ label, value, icon, color, bg, border }) => (
              <div className="stat-card" key={label}>
                <div className="stat-icon" style={{ background: bg, border: `1px solid ${border}` }}>{icon}</div>
                <div>
                  <div className="stat-val" style={{ color }}>{value}</div>
                  <div className="stat-lbl">{label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ed-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header"><span className="card-title">Quick Actions</span></div>
                <div className="qa-grid">
                  {quickActions.map(({ to, icon, title, desc }) => (
                    <Link to={to} className="qa-item" key={title}>
                      <div className="qa-icon">{icon}</div>
                      <div className="qa-title">{title}</div>
                      <div className="qa-desc">{desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Recent Job Postings</span>
                  <Link to="/employer/manage-jobs" className="card-link">Manage all →</Link>
                </div>
                {recentJobs.map((job) => (
                  <div className="rj-item" key={job.id}>
                    <div className="rj-logo">💼</div>
                    <div style={{ flex: 1 }}>
                      <div className="rj-title">{job.title}</div>
                      <div className="rj-meta">{job.applicants} applicants · Posted {job.posted}</div>
                    </div>
                    <span className={`rj-status ${job.status.toLowerCase()}`}>{job.status}</span>
                    <Link to={`/employer/edit-job/${job.id}`} className="rj-edit" style={{ marginLeft: 12 }}>Edit</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Post CTA */}
              <div className="card">
                <div className="post-cta">
                  <div className="post-cta-icon">🚀</div>
                  <div className="post-cta-title">Ready to hire?</div>
                  <p className="post-cta-sub">Post a job and reach thousands of qualified candidates instantly.</p>
                  <Link to="/employer/post-job" className="post-cta-btn">Post a Job →</Link>
                </div>
              </div>

              {/* Recent Applicants */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Recent Applicants</span>
                </div>
                {recentApplicants.map((a) => (
                  <div className="ap-item" key={a.name}>
                    <div className="ap-avatar">{a.name[0]}</div>
                    <div>
                      <div className="ap-name">{a.name}</div>
                      <div className="ap-role">{a.role}</div>
                    </div>
                    <div className="ap-status" style={{ background: a.bg, color: a.color }}>{a.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;