import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ keyword: "", location: "" });

  const jobs = [
    { id: 1, title: "Frontend Developer", company: "Google", location: "Bangalore", type: "Full-time", salary: "₹18–28 LPA" },
    { id: 2, title: "Backend Developer", company: "Amazon", location: "Hyderabad", type: "Full-time", salary: "₹22–35 LPA" },
    { id: 3, title: "Full Stack Developer", company: "Microsoft", location: "Delhi", type: "Hybrid", salary: "₹20–32 LPA" },
  ];

  const categories = [
    { icon: "💻", label: "Technology", count: "4.2K jobs" },
    { icon: "📊", label: "Finance", count: "1.8K jobs" },
    { icon: "🎨", label: "Design", count: "980 jobs" },
    { icon: "📣", label: "Marketing", count: "1.3K jobs" },
    { icon: "⚕️", label: "Healthcare", count: "2.1K jobs" },
    { icon: "🏗️", label: "Engineering", count: "3.4K jobs" },
  ];

  const stats = [
    { num: "12K+", label: "Live Jobs" },
    { num: "3.4K", label: "Companies" },
    { num: "98%", label: "Satisfaction" },
    { num: "1.2M", label: "Job Seekers" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${search.keyword}&location=${search.location}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0ede8;
          min-height: 100vh;
          color: #0f2027;
        }

        /* ── HERO ── */
        .hero {
          background: #0f2027;
          position: relative;
          overflow: hidden;
          padding: 100px 24px 110px;
          text-align: center;
        }

        .hero-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .hero-orb.o1 { width: 500px; height: 500px; background: rgba(99,102,241,.25); top: -160px; left: -100px; }
        .hero-orb.o2 { width: 400px; height: 400px; background: rgba(34,211,238,.15); bottom: -120px; right: -80px; }
        .hero-orb.o3 { width: 200px; height: 200px; background: rgba(167,139,250,.2); top: 40%; left: 50%; transform: translateX(-50%); }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,.15); border: 1px solid rgba(99,102,241,.3);
          border-radius: 99px; padding: 6px 16px;
          font-size: 12px; font-weight: 600; color: #a5b4fc;
          letter-spacing: .5px; margin-bottom: 28px;
          font-family: 'Syne', sans-serif;
        }
        .hero-badge-dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 800; color: #fff;
          line-height: 1.1; margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .hero-title .accent {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(99,102,241,.8);
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          font-size: 17px; color: rgba(255,255,255,.5);
          max-width: 480px; margin: 0 auto 40px; line-height: 1.7;
          position: relative; z-index: 1;
        }

        .hero-cta-row {
          display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
          position: relative; z-index: 1;
        }

        .btn-primary {
          padding: 14px 28px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: transform .15s, box-shadow .2s;
          box-shadow: 0 8px 24px rgba(99,102,241,.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,.45); }

        .btn-ghost {
          padding: 14px 28px;
          background: rgba(255,255,255,.07); color: rgba(255,255,255,.85);
          border: 1px solid rgba(255,255,255,.15); border-radius: 12px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: background .2s, transform .15s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,.12); transform: translateY(-2px); }

        /* ── STATS STRIP ── */
        .stats-strip {
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
        }
        .stats-inner {
          max-width: 900px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 0;
        }
        @media (max-width: 600px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }
        .stat-cell {
          padding: 28px 20px; text-align: center;
          border-right: 1px solid #f1f5f9;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0f2027;
        }
        .stat-lbl { font-size: 13px; color: #94a3b8; margin-top: 2px; }

        /* ── SEARCH ── */
        .search-section { padding: 56px 24px 0; }
        .search-inner { max-width: 760px; margin: 0 auto; }
        .search-label {
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: #6366f1;
          margin-bottom: 16px; display: block;
        }
        .search-box {
          background: #fff; border-radius: 16px;
          box-shadow: 0 4px 24px rgba(15,32,39,.08);
          display: flex; gap: 0; overflow: hidden;
          border: 1.5px solid #e5e7eb;
        }
        .search-box:focus-within { border-color: #6366f1; box-shadow: 0 4px 24px rgba(99,102,241,.12); }

        .search-input {
          flex: 1; padding: 18px 20px;
          border: none; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027;
          background: transparent;
        }
        .search-input::placeholder { color: #c4c9d4; }
        .search-divider { width: 1px; background: #f1f5f9; align-self: stretch; margin: 12px 0; }
        .search-btn {
          padding: 0 28px;
          background: #0f2027; color: #fff; border: none;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background .2s; white-space: nowrap;
        }
        .search-btn:hover { background: #1e3a4a; }

        .trending-tags { margin-top: 14px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .trending-label { font-size: 12px; color: #94a3b8; }
        .tag-chip {
          padding: 5px 12px; background: #fff; border: 1px solid #e5e7eb;
          border-radius: 99px; font-size: 12px; color: #374151;
          cursor: pointer; text-decoration: none;
          transition: border-color .2s, color .2s;
        }
        .tag-chip:hover { border-color: #6366f1; color: #6366f1; }

        /* ── SECTIONS SHARED ── */
        .section { padding: 72px 24px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-tag {
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: #6366f1;
          margin-bottom: 10px;
        }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800; color: #0f2027; margin-bottom: 8px;
        }
        .section-sub { font-size: 15px; color: #94a3b8; margin-bottom: 44px; }
        .section-header-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; }
        .view-all {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          color: #6366f1; text-decoration: none;
          display: flex; align-items: center; gap: 4px;
        }
        .view-all:hover { text-decoration: underline; }

        /* ── CATEGORIES ── */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }
        .cat-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 24px 20px; text-align: center;
          cursor: pointer; text-decoration: none; display: block;
          transition: border-color .2s, transform .15s, box-shadow .2s;
        }
        .cat-card:hover { border-color: #6366f1; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(99,102,241,.1); }
        .cat-icon { font-size: 28px; margin-bottom: 10px; }
        .cat-label { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .cat-count { font-size: 12px; color: #94a3b8; margin-top: 4px; }

        /* ── JOB CARDS ── */
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

        .job-card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 24px; transition: border-color .2s, transform .15s, box-shadow .2s;
        }
        .job-card:hover { border-color: #6366f1; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(99,102,241,.1); }
        .job-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .job-company-logo {
          width: 44px; height: 44px; border-radius: 10px;
          background: #f1f5f9; display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f2027;
          border: 1px solid #e5e7eb;
        }
        .job-type-badge {
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 99px;
          background: rgba(99,102,241,.08); color: #6366f1;
          font-family: 'Syne', sans-serif;
        }
        .job-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }
        .job-company { font-size: 13px; color: #64748b; margin-bottom: 12px; }
        .job-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .job-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #94a3b8; }
        .job-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
        .job-salary { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; }
        .job-apply-btn {
          padding: 8px 18px; background: #0f2027; color: #fff;
          border: none; border-radius: 8px;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; text-decoration: none; display: inline-block;
          transition: background .2s;
        }
        .job-apply-btn:hover { background: #1e3a4a; }

        /* ── CTA BANNER ── */
        .cta-section { padding: 0 24px 72px; }
        .cta-inner { max-width: 1100px; margin: 0 auto; }
        .cta-banner {
          background: #0f2027; border-radius: 24px;
          padding: 64px 56px;
          display: grid; grid-template-columns: 1fr auto;
          align-items: center; gap: 40px;
          position: relative; overflow: hidden;
        }
        @media (max-width: 680px) { .cta-banner { grid-template-columns: 1fr; text-align: center; padding: 48px 32px; } }

        .cta-orb {
          position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none;
        }
        .cta-orb.co1 { width: 300px; height: 300px; background: rgba(99,102,241,.2); top: -80px; right: -60px; }
        .cta-orb.co2 { width: 200px; height: 200px; background: rgba(34,211,238,.1); bottom: -60px; left: 40%; }

        .cta-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 14px; }
        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #fff; margin-bottom: 12px; line-height: 1.2; }
        .cta-sub { font-size: 15px; color: rgba(255,255,255,.5); line-height: 1.7; max-width: 440px; }

        .cta-btn {
          padding: 16px 32px; border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff; border: none;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none; display: inline-block; white-space: nowrap;
          box-shadow: 0 8px 24px rgba(99,102,241,.4);
          transition: transform .15s, box-shadow .2s; position: relative; z-index: 1;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,.5); }
      `}</style>

      <div className="home-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-orb o1" /><div className="hero-orb o2" /><div className="hero-orb o3" />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Now hiring across 3,400+ companies
            </div>

            <h1 className="hero-title">
              Find your <span className="highlight">dream job</span><br />
              <span className="accent">before someone</span> else does.
            </h1>

            <p className="hero-sub">
              Browse thousands of curated opportunities and apply in one click. Your next career move starts here.
            </p>

            <div className="hero-cta-row">
              <Link to="/jobs" className="btn-primary">Browse All Jobs →</Link>
              <Link to="/register" className="btn-ghost">Create Free Profile</Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-strip">
          <div className="stats-inner">
            {stats.map(({ num, label }) => (
              <div className="stat-cell" key={label}>
                <div className="stat-num">{num}</div>
                <div className="stat-lbl">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEARCH ── */}
        <section className="search-section">
          <div className="search-inner">
            <span className="search-label">Search Jobs</span>
            <form onSubmit={handleSearch}>
              <div className="search-box">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Job title, keyword or company..."
                  value={search.keyword}
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                />
                <div className="search-divider" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="City or remote..."
                  value={search.location}
                  onChange={(e) => setSearch({ ...search, location: e.target.value })}
                />
                <button type="submit" className="search-btn">Search</button>
              </div>
            </form>
            <div className="trending-tags">
              <span className="trending-label">Trending:</span>
              {["React", "Python", "Product Manager", "Remote", "Data Science"].map((t) => (
                <Link key={t} to={`/jobs?keyword=${t}`} className="tag-chip">{t}</Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section">
          <div className="section-inner">
            <p className="section-tag">Explore by Field</p>
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Browse by Category</h2>
                <p className="section-sub">Find roles that match your expertise</p>
              </div>
              <Link to="/jobs" className="view-all">All categories →</Link>
            </div>
            <div className="cat-grid">
              {categories.map(({ icon, label, count }) => (
                <Link key={label} to={`/jobs?category=${label}`} className="cat-card">
                  <div className="cat-icon">{icon}</div>
                  <div className="cat-label">{label}</div>
                  <div className="cat-count">{count}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED JOBS ── */}
        <section className="section" style={{ background: "#fff", paddingTop: 72 }}>
          <div className="section-inner">
            <p className="section-tag">Hand-picked for you</p>
            <div className="section-header-row">
              <div>
                <h2 className="section-title">Featured Jobs</h2>
                <p className="section-sub">Top opportunities from leading companies</p>
              </div>
              <Link to="/jobs" className="view-all">View all →</Link>
            </div>

            <div className="jobs-grid">
              {jobs.map((job) => (
                <div className="job-card" key={job.id}>
                  <div className="job-card-top">
                    <div className="job-company-logo">{job.company[0]}</div>
                    <span className="job-type-badge">{job.type}</span>
                  </div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-company">{job.company}</div>
                  <div className="job-meta">
                    <span className="job-meta-item">📍 {job.location}</span>
                    <span className="job-meta-item">💼 Full-time</span>
                  </div>
                  <div className="job-footer">
                    <span className="job-salary">{job.salary}</span>
                    <Link to={`/jobs/${job.id}`} className="job-apply-btn">View & Apply</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EMPLOYER CTA ── */}
        <section className="cta-section" style={{ paddingTop: 72 }}>
          <div className="cta-inner">
            <div className="cta-banner">
              <div className="cta-orb co1" /><div className="cta-orb co2" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p className="cta-tag">For Employers</p>
                <h2 className="cta-title">Hire top talent,<br />faster than ever.</h2>
                <p className="cta-sub">Post a job in minutes and reach thousands of qualified candidates actively looking for their next role.</p>
              </div>
              <Link to="/employer/post-job" className="cta-btn">Post a Job →</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;