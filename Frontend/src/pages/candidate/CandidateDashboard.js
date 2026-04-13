import React from "react";
import { Link } from "react-router-dom";

const CandidateDashboard = () => {
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")) || { name: "Mohit" }; } catch { return { name: "Mohit" }; } })();

  const stats = [
    { label: "Applied", value: 12, icon: "📄", color: "#6366f1", bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.2)" },
    { label: "Shortlisted", value: 4, icon: "⭐", color: "#22c55e", bg: "rgba(34,197,94,.08)", border: "rgba(34,197,94,.2)" },
    { label: "Interviews", value: 2, icon: "🎯", color: "#f59e0b", bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.2)" },
    { label: "Rejected", value: 3, icon: "✗", color: "#ef4444", bg: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.2)" },
  ];

  const quickActions = [
    { to: "/candidate/applied-jobs", icon: "📋", title: "Applied Jobs", desc: "Track all your applications and their status", badge: "12" },
    { to: "/profile", icon: "👤", title: "My Profile", desc: "Update personal info and skills", badge: null },
    { to: "/candidate/resume", icon: "📎", title: "Resume", desc: "Upload or update your resume", badge: null },
    { to: "/jobs", icon: "🔍", title: "Browse Jobs", desc: "Explore new opportunities", badge: null },
  ];

  const recentActivity = [
    { title: "Frontend Developer", company: "Google", status: "Under Review", date: "Apr 1", color: "#f59e0b", bg: "rgba(245,158,11,.08)" },
    { title: "Backend Developer", company: "Amazon", status: "Shortlisted", date: "Mar 28", color: "#22c55e", bg: "rgba(34,197,94,.08)" },
    { title: "UI/UX Designer", company: "Adobe", status: "Rejected", date: "Mar 25", color: "#ef4444", bg: "rgba(239,68,68,.08)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cd-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .cd-wrap { max-width: 1060px; margin: 0 auto; }
        .cd-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }

        /* Welcome banner */
        .cd-banner { background: #0f2027; border-radius: 20px; padding: 40px 44px; position: relative; overflow: hidden; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .cd-orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
        .cd-orb.o1 { width: 300px; height: 300px; background: rgba(99,102,241,.2); top: -80px; right: -60px; }
        .cd-orb.o2 { width: 180px; height: 180px; background: rgba(34,211,238,.1); bottom: -40px; left: 30%; }
        .cd-hello { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; color: #fff; margin-bottom: 6px; position: relative; z-index: 1; }
        .cd-hello-sub { font-size: 14px; color: rgba(255,255,255,.5); position: relative; z-index: 1; }
        .cd-banner-btn { padding: 12px 24px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); border-radius: 10px; color: #fff; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; transition: background .2s; position: relative; z-index: 1; white-space: nowrap; }
        .cd-banner-btn:hover { background: rgba(255,255,255,.18); }

        /* Stats */
        .cd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        @media (max-width: 700px) { .cd-stats { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 22px 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .stat-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0f2027; line-height: 1; }
        .stat-lbl { font-size: 12px; color: #94a3b8; margin-top: 3px; }

        /* Grid layout */
        .cd-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        @media (max-width: 820px) { .cd-grid { grid-template-columns: 1fr; } }

        .card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; overflow: hidden; }
        .card-header { padding: 22px 24px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #0f2027; }
        .card-link { font-size: 13px; color: #6366f1; font-weight: 600; text-decoration: none; }
        .card-link:hover { text-decoration: underline; }

        /* Quick actions */
        .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .qa-item { padding: 22px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; text-decoration: none; display: block; transition: background .15s; position: relative; }
        .qa-item:nth-child(2n) { border-right: none; }
        .qa-item:nth-last-child(-n+2) { border-bottom: none; }
        .qa-item:hover { background: #fafafa; }
        .qa-icon { font-size: 24px; margin-bottom: 10px; }
        .qa-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }
        .qa-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .qa-badge { position: absolute; top: 18px; right: 18px; background: #6366f1; color: #fff; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; width: 22px; height: 22px; border-radius: 99px; display: flex; align-items: center; justify-content: center; }

        /* Recent activity */
        .ra-item { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .ra-item:last-child { border-bottom: none; }
        .ra-logo { width: 36px; height: 36px; border-radius: 9px; background: #f1f5f9; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #0f2027; flex-shrink: 0; }
        .ra-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .ra-company { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .ra-status { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; font-family: 'Syne', sans-serif; white-space: nowrap; }
        .ra-date { font-size: 11px; color: #94a3b8; margin-top: 2px; text-align: right; }

        /* Profile card */
        .pf-card { padding: 24px; text-align: center; }
        .pf-avatar { width: 64px; height: 64px; border-radius: 50%; background: #0f2027; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin: 0 auto 14px; }
        .pf-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f2027; margin-bottom: 4px; }
        .pf-role { font-size: 12px; color: #94a3b8; margin-bottom: 16px; }
        .pf-bar-wrap { background: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 16px; text-align: left; }
        .pf-bar-label { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px; }
        .pf-bar-lbl { font-weight: 500; color: #374151; }
        .pf-bar-pct { font-weight: 700; color: #6366f1; font-family: 'Syne', sans-serif; }
        .pf-bar { width: 100%; height: 5px; background: #e5e7eb; border-radius: 99px; }
        .pf-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #6366f1, #22d3ee); }
        .pf-edit-btn { display: block; width: 100%; padding: 11px; background: #0f2027; color: #fff; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; transition: background .18s; }
        .pf-edit-btn:hover { background: #1e3a4a; }
      `}</style>

      <div className="cd-root">
        <div className="cd-wrap">
          <p className="cd-tag">Candidate Portal</p>

          {/* Welcome Banner */}
          <div className="cd-banner">
            <div className="cd-orb o1" /><div className="cd-orb o2" />
            <div>
              <div className="cd-hello">Welcome back, {user.name?.split(" ")[0]} 👋</div>
              <div className="cd-hello-sub">You have 2 interview invites and 4 shortlists this week.</div>
            </div>
            <Link to="/jobs" className="cd-banner-btn">Browse New Jobs →</Link>
          </div>

          {/* Stats */}
          <div className="cd-stats">
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

          <div className="cd-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Quick Actions</span>
                </div>
                <div className="qa-grid">
                  {quickActions.map(({ to, icon, title, desc, badge }) => (
                    <Link to={to} className="qa-item" key={title}>
                      <div className="qa-icon">{icon}</div>
                      <div className="qa-title">{title}</div>
                      <div className="qa-desc">{desc}</div>
                      {badge && <span className="qa-badge">{badge}</span>}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Recent Applications</span>
                  <Link to="/candidate/applied-jobs" className="card-link">View all →</Link>
                </div>
                {recentActivity.map((a) => (
                  <div className="ra-item" key={a.title}>
                    <div className="ra-logo">{a.company[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div className="ra-title">{a.title}</div>
                      <div className="ra-company">{a.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="ra-status" style={{ background: a.bg, color: a.color }}>{a.status}</div>
                      <div className="ra-date">{a.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="card">
                <div className="pf-card">
                  <div className="pf-avatar">{user.name ? user.name[0].toUpperCase() : "M"}</div>
                  <div className="pf-name">{user.name || "Mohit"}</div>
                  <div className="pf-role">{user.email || "candidate@email.com"}</div>
                  <div className="pf-bar-wrap">
                    <div className="pf-bar-label">
                      <span className="pf-bar-lbl">Profile Strength</span>
                      <span className="pf-bar-pct">60%</span>
                    </div>
                    <div className="pf-bar"><div className="pf-bar-fill" style={{ width: "60%" }} /></div>
                  </div>
                  <Link to="/profile" className="pf-edit-btn">Edit Profile →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDashboard;