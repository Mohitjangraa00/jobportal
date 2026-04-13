import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("user")) || null); }
    catch { setUser(null); }
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ FIXED: "recruiter" → employer dashboard, "user" → candidate dashboard
  const dashboardPath = user?.role === "recruiter" ? "/employer/dashboard" : "/candidate/dashboard";
  const isRecruiter = user?.role === "recruiter";
  const isUser = user?.role === "user";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

        .nb-root { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1.5px solid #f1f5f9; transition: box-shadow .25s; font-family: 'DM Sans', sans-serif; }
        .nb-root.scrolled { box-shadow: 0 4px 24px rgba(15,32,39,.08); }

        .nb-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }

        .nb-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0f2027; text-decoration: none; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .nb-logo-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; }

        .nb-links { display: none; align-items: center; gap: 2px; }
        @media (min-width: 768px) { .nb-links { display: flex; } }

        .nb-link { padding: 7px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #64748b; text-decoration: none; transition: color .18s, background .18s; }
        .nb-link:hover { color: #0f2027; background: #f8fafc; }
        .nb-link.active { color: #6366f1; font-weight: 600; background: rgba(99,102,241,.06); }

        .nb-actions { display: none; align-items: center; gap: 10px; }
        @media (min-width: 768px) { .nb-actions { display: flex; } }

        .nb-btn-ghost { padding: 8px 18px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #374151; cursor: pointer; text-decoration: none; display: inline-block; transition: border-color .18s, color .18s; }
        .nb-btn-ghost:hover { border-color: #6366f1; color: #6366f1; }

        .nb-btn-solid { padding: 8px 20px; border-radius: 10px; background: #0f2027; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; text-decoration: none; display: inline-block; transition: background .18s, transform .12s; }
        .nb-btn-solid:hover { background: #1e3a4a; transform: translateY(-1px); }

        .nb-profile-wrap { position: relative; }
        .nb-avatar-btn { width: 38px; height: 38px; border-radius: 50%; background: #0f2027; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #fff; cursor: pointer; transition: border-color .18s, transform .12s; }
        .nb-avatar-btn:hover { border-color: #6366f1; transform: scale(1.06); }

        .nb-dropdown { position: absolute; top: calc(100% + 12px); right: 0; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; box-shadow: 0 8px 32px rgba(15,32,39,.12); min-width: 220px; overflow: hidden; animation: dropIn .18s ease; }
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

        .nb-dd-header { padding: 16px 18px; border-bottom: 1px solid #f1f5f9; }
        .nb-dd-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; }
        .nb-dd-email { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .nb-dd-role { display: inline-block; margin-top: 6px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; background: rgba(99,102,241,.08); color: #6366f1; font-family: 'Syne', sans-serif; text-transform: capitalize; }

        .nb-dd-item { display: flex; align-items: center; gap: 10px; padding: 11px 18px; font-size: 14px; color: #374151; text-decoration: none; transition: background .15s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif; }
        .nb-dd-item:hover { background: #f8fafc; color: #0f2027; }
        .nb-dd-item.danger { color: #ef4444; }
        .nb-dd-item.danger:hover { background: #fef2f2; }
        .nb-dd-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

        .nb-hamburger { display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 36px; height: 36px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; padding: 7px; transition: border-color .18s; }
        @media (min-width: 768px) { .nb-hamburger { display: none; } }
        .nb-hamburger:hover { border-color: #6366f1; }
        .nb-ham-bar { width: 100%; height: 2px; background: #374151; border-radius: 2px; transition: all .25s; }
        .nb-ham-bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nb-ham-bar.open:nth-child(2) { opacity: 0; }
        .nb-ham-bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .nb-drawer { display: block; position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: rgba(15,32,39,.35); backdrop-filter: blur(4px); z-index: 99; }
        @media (min-width: 768px) { .nb-drawer { display: none; } }

        .nb-drawer-panel { position: absolute; top: 0; left: 0; right: 0; background: #fff; border-bottom: 1.5px solid #e5e7eb; padding: 16px 20px 24px; animation: slideDown .22s ease; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

        .nb-mob-link { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; font-size: 15px; font-weight: 500; color: #374151; text-decoration: none; transition: background .15s; }
        .nb-mob-link:hover, .nb-mob-link.active { background: rgba(99,102,241,.06); color: #6366f1; }

        .nb-mob-divider { height: 1px; background: #f1f5f9; margin: 8px 0; }

        .nb-mob-user { display: flex; align-items: center; gap: 12px; padding: 14px; background: #f8fafc; border-radius: 12px; margin-bottom: 12px; }
        .nb-mob-avatar { width: 42px; height: 42px; border-radius: 50%; background: #0f2027; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .nb-mob-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; }
        .nb-mob-role { font-size: 12px; color: #94a3b8; margin-top: 1px; }

        .nb-mob-btn { display: block; width: 100%; padding: 13px; border-radius: 10px; text-align: center; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; margin-top: 8px; border: none; cursor: pointer; }
        .nb-mob-btn.solid { background: #0f2027; color: #fff; }
        .nb-mob-btn.ghost { background: #f8fafc; color: #374151; border: 1.5px solid #e5e7eb; }
        .nb-mob-btn.danger { background: #fef2f2; color: #ef4444; }
      `}</style>

      <nav className={`nb-root${scrolled ? " scrolled" : ""}`}>
        <div className="nb-inner">

          <Link to="/" className="nb-logo"><span className="nb-logo-dot" />JobPortal</Link>

          {/* Desktop links */}
          <div className="nb-links">
            <Link to="/" className={`nb-link${isActive("/") ? " active" : ""}`}>Home</Link>
            <Link to="/jobs" className={`nb-link${isActive("/jobs") ? " active" : ""}`}>Jobs</Link>
            {user && <Link to={dashboardPath} className={`nb-link${location.pathname.includes("dashboard") ? " active" : ""}`}>Dashboard</Link>}
            {/* ✅ Show "Post a Job" only for recruiters */}
            {isRecruiter && <Link to="/employer/post-job" className={`nb-link${isActive("/employer/post-job") ? " active" : ""}`}>Post a Job</Link>}
          </div>

          {/* Desktop actions */}
          <div className="nb-actions">
            {user ? (
              <div className="nb-profile-wrap" ref={dropdownRef}>
                <div className="nb-avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                {profileOpen && (
                  <div className="nb-dropdown">
                    <div className="nb-dd-header">
                      <div className="nb-dd-name">{user.name || "User"}</div>
                      <div className="nb-dd-email">{user.email}</div>
                      {/* ✅ Show friendly role label */}
                      <span className="nb-dd-role">
                        {user.role === "recruiter" ? "🏢 Recruiter" : user.role === "user" ? "🙋 Job Seeker" : user.role}
                      </span>
                    </div>
                    <Link to="/profile" className="nb-dd-item" onClick={() => setProfileOpen(false)}>👤 My Profile</Link>
                    <Link to={dashboardPath} className="nb-dd-item" onClick={() => setProfileOpen(false)}>📊 Dashboard</Link>
                    {/* ✅ FIXED: "user" role sees candidate links, "recruiter" sees employer links */}
                    {isUser && <Link to="/candidate/applied-jobs" className="nb-dd-item" onClick={() => setProfileOpen(false)}>📋 Applied Jobs</Link>}
                    {isUser && <Link to="/candidate/resume" className="nb-dd-item" onClick={() => setProfileOpen(false)}>📎 My Resume</Link>}
                    {isRecruiter && <Link to="/employer/manage-jobs" className="nb-dd-item" onClick={() => setProfileOpen(false)}>🗂️ Manage Jobs</Link>}
                    {isRecruiter && <Link to="/employer/post-job" className="nb-dd-item" onClick={() => setProfileOpen(false)}>➕ Post a Job</Link>}
                    <div className="nb-dd-divider" />
                    <button className="nb-dd-item danger" onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-btn-ghost">Login</Link>
                <Link to="/register" className="nb-btn-solid">Get Started →</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="nb-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`nb-ham-bar${menuOpen ? " open" : ""}`} />
            <div className={`nb-ham-bar${menuOpen ? " open" : ""}`} />
            <div className={`nb-ham-bar${menuOpen ? " open" : ""}`} />
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="nb-drawer" onClick={() => setMenuOpen(false)}>
            <div className="nb-drawer-panel" onClick={(e) => e.stopPropagation()}>
              {user && (
                <div className="nb-mob-user">
                  <div className="nb-mob-avatar">{user.name ? user.name[0].toUpperCase() : "U"}</div>
                  <div>
                    <div className="nb-mob-name">{user.name || "User"}</div>
                    <div className="nb-mob-role">{user.role === "recruiter" ? "🏢 Recruiter" : "🙋 Job Seeker"}</div>
                  </div>
                </div>
              )}
              <Link to="/" className={`nb-mob-link${isActive("/") ? " active" : ""}`}>🏠 Home</Link>
              <Link to="/jobs" className={`nb-mob-link${isActive("/jobs") ? " active" : ""}`}>💼 Browse Jobs</Link>
              {user && <>
                <div className="nb-mob-divider" />
                <Link to={dashboardPath} className="nb-mob-link">📊 Dashboard</Link>
                <Link to="/profile" className="nb-mob-link">👤 My Profile</Link>
                {isUser && <Link to="/candidate/applied-jobs" className="nb-mob-link">📋 Applied Jobs</Link>}
                {isUser && <Link to="/candidate/resume" className="nb-mob-link">📎 My Resume</Link>}
                {isRecruiter && <Link to="/employer/post-job" className="nb-mob-link">➕ Post a Job</Link>}
                {isRecruiter && <Link to="/employer/manage-jobs" className="nb-mob-link">🗂️ Manage Jobs</Link>}
              </>}
              <div className="nb-mob-divider" />
              {user
                ? <button className="nb-mob-btn danger" onClick={handleLogout}>🚪 Logout</button>
                : <>
                    <Link to="/login" className="nb-mob-btn ghost">Login</Link>
                    <Link to="/register" className="nb-mob-btn solid">Create Account →</Link>
                  </>
              }
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;