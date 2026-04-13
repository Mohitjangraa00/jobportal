import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);

  // Dummy job data (replace with API later)
  const job = {
    id,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore, Karnataka",
    salary: "₹18 – 28 LPA",
    type: "Full-Time",
    mode: "Hybrid",
    experience: "2 – 4 Years",
    posted: "2 days ago",
    applicants: "142 applicants",
    description:
      "We are looking for a skilled Frontend Developer to join our growing product team. You will be responsible for building and maintaining high-quality web applications that serve millions of users worldwide. You'll collaborate with designers, backend engineers, and product managers to deliver exceptional user experiences.",
    responsibilities: [
      "Build and maintain responsive, high-performance web interfaces using React.js",
      "Collaborate with UX/UI designers to translate wireframes into pixel-perfect components",
      "Write clean, maintainable, and well-documented code",
      "Optimize application performance across devices and browsers",
      "Participate in code reviews and contribute to team best practices",
    ],
    requirements: [
      "Strong knowledge of HTML5, CSS3, and modern JavaScript (ES6+)",
      "2+ years of hands-on experience with React.js",
      "Familiarity with REST APIs and state management libraries (Redux/Zustand)",
      "Understanding of responsive design and cross-browser compatibility",
      "Good problem-solving skills and attention to detail",
    ],
    perks: ["Health Insurance", "Remote Flexibility", "Learning Budget", "Stock Options", "5-Day Week"],
    skills: ["React.js", "JavaScript", "TypeScript", "CSS3", "REST APIs", "Git"],
  };

  const similar = [
    { id: 2, title: "React Developer", company: "Flipkart", location: "Pune", salary: "₹15–22 LPA" },
    { id: 3, title: "UI Engineer", company: "Swiggy", location: "Bangalore", salary: "₹12–18 LPA" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .jd-root {
          font-family: 'DM Sans', sans-serif;
          background: #f0ede8;
          min-height: 100vh;
          padding: 40px 24px 72px;
          color: #0f2027;
        }

        .jd-container { max-width: 1060px; margin: 0 auto; display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        @media (max-width: 800px) { .jd-container { grid-template-columns: 1fr; } }

        /* ── Breadcrumb ── */
        .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; font-size: 13px; color: #94a3b8; }
        .breadcrumb a { color: #6366f1; text-decoration: none; font-weight: 500; }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb-sep { color: #d1d5db; }

        /* ── Main Card ── */
        .jd-main { display: flex; flex-direction: column; gap: 20px; }

        .card {
          background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; overflow: hidden;
        }

        /* Hero card */
        .jd-hero-card { padding: 36px; }
        .jd-hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
        .jd-logo-wrap { display: flex; align-items: center; gap: 18px; }
        .jd-logo {
          width: 60px; height: 60px; border-radius: 14px;
          background: #f1f5f9; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0f2027;
        }
        .jd-company { font-size: 14px; color: #64748b; margin-bottom: 4px; }
        .jd-title { font-family: 'Syne', sans-serif; font-size: clamp(1.4rem, 2.5vw, 1.9rem); font-weight: 800; color: #0f2027; line-height: 1.2; }

        .jd-action-row { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .save-btn {
          width: 42px; height: 42px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 18px; transition: border-color .2s, background .2s;
        }
        .save-btn:hover, .save-btn.saved { border-color: #6366f1; background: rgba(99,102,241,.06); }

        .jd-meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .meta-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 99px;
          font-size: 13px; font-weight: 500; border: 1px solid;
        }
        .meta-badge.blue { background: rgba(99,102,241,.07); border-color: rgba(99,102,241,.2); color: #6366f1; }
        .meta-badge.green { background: rgba(34,197,94,.07); border-color: rgba(34,197,94,.2); color: #16a34a; }
        .meta-badge.amber { background: rgba(245,158,11,.07); border-color: rgba(245,158,11,.2); color: #d97706; }
        .meta-badge.slate { background: #f8fafc; border-color: #e5e7eb; color: #64748b; }

        .jd-footer-row { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 12px; }
        .jd-posted { font-size: 13px; color: #94a3b8; }
        .jd-applicants { font-size: 13px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }

        /* Section card */
        .section-card { padding: 32px; }
        .section-card + .section-card { border-top: 1px solid #f1f5f9; }

        .s-tag { font-family: 'Syne', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 10px; }
        .s-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #0f2027; margin-bottom: 16px; }
        .s-body { font-size: 15px; color: #475569; line-height: 1.8; }

        .s-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .s-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: #475569; line-height: 1.6; }
        .s-list li::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1; margin-top: 8px; flex-shrink: 0;
        }

        /* Skills */
        .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-chip {
          padding: 6px 14px; background: #f8fafc; border: 1.5px solid #e5e7eb;
          border-radius: 99px; font-size: 13px; font-weight: 500; color: #374151;
          transition: border-color .2s, color .2s;
        }
        .skill-chip:hover { border-color: #6366f1; color: #6366f1; }

        /* Perks */
        .perks-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
        .perk-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; background: rgba(34,197,94,.06);
          border: 1px solid rgba(34,197,94,.2); border-radius: 99px;
          font-size: 13px; font-weight: 500; color: #16a34a;
        }

        /* ── Sidebar ── */
        .jd-sidebar { display: flex; flex-direction: column; gap: 20px; }

        .apply-card { padding: 28px; text-align: center; }
        .apply-btn {
          display: block; width: 100%; padding: 15px;
          background: #0f2027; color: #fff; border: none; border-radius: 12px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 16px rgba(15,32,39,.15);
          margin-bottom: 12px;
        }
        .apply-btn:hover { background: #1e3a4a; transform: translateY(-1px); }

        .apply-note { font-size: 12px; color: #94a3b8; line-height: 1.6; }

        .company-card { padding: 28px; }
        .company-logo-lg {
          width: 52px; height: 52px; border-radius: 12px;
          background: #f1f5f9; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0f2027;
          margin-bottom: 14px;
        }
        .company-name { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }
        .company-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 16px; }
        .company-link { font-size: 13px; color: #6366f1; font-weight: 600; text-decoration: none; }
        .company-link:hover { text-decoration: underline; }

        .similar-card { padding: 24px; }
        .similar-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 16px; }
        .similar-job { padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
        .similar-job:last-child { border-bottom: none; padding-bottom: 0; }
        .similar-job-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 3px; text-decoration: none; display: block; }
        .similar-job-title:hover { color: #6366f1; }
        .similar-job-meta { font-size: 12px; color: #94a3b8; }
        .similar-salary { font-size: 12px; color: #16a34a; font-weight: 600; margin-top: 4px; }
      `}</style>

      <div className="jd-root">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/jobs">Jobs</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{job.title}</span>
        </div>

        <div className="jd-container">

          {/* ── MAIN COLUMN ── */}
          <div className="jd-main">

            {/* Hero card */}
            <div className="card">
              <div className="jd-hero-card">
                <div className="jd-hero-top">
                  <div className="jd-logo-wrap">
                    <div className="jd-logo">{job.company[0]}</div>
                    <div>
                      <div className="jd-company">{job.company}</div>
                      <h1 className="jd-title">{job.title}</h1>
                    </div>
                  </div>
                  <div className="jd-action-row">
                    <button
                      className={`save-btn ${saved ? "saved" : ""}`}
                      onClick={() => setSaved(!saved)}
                      title={saved ? "Unsave job" : "Save job"}
                    >
                      {saved ? "🔖" : "🤍"}
                    </button>
                  </div>
                </div>

                <div className="jd-meta-row">
                  <span className="meta-badge slate">📍 {job.location}</span>
                  <span className="meta-badge blue">💼 {job.type}</span>
                  <span className="meta-badge amber">🏠 {job.mode}</span>
                  <span className="meta-badge green">💰 {job.salary}</span>
                  <span className="meta-badge slate">⏳ {job.experience}</span>
                </div>

                <div className="jd-footer-row">
                  <span className="jd-posted">🕐 Posted {job.posted}</span>
                  <span className="jd-applicants">👥 {job.applicants}</span>
                </div>
              </div>
            </div>

            {/* Description + Requirements + Skills + Perks */}
            <div className="card">
              <div className="section-card">
                <p className="s-tag">About the Role</p>
                <h2 className="s-title">Job Description</h2>
                <p className="s-body">{job.description}</p>
              </div>

              <div className="section-card">
                <p className="s-tag">What you'll do</p>
                <h2 className="s-title">Responsibilities</h2>
                <ul className="s-list">
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div className="section-card">
                <p className="s-tag">What we need</p>
                <h2 className="s-title">Requirements</h2>
                <ul className="s-list">
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div className="section-card">
                <p className="s-tag">Tech Stack</p>
                <h2 className="s-title">Skills Required</h2>
                <div className="skills-wrap">
                  {job.skills.map((s) => <span key={s} className="skill-chip">{s}</span>)}
                </div>
              </div>

              <div className="section-card">
                <p className="s-tag">Benefits</p>
                <h2 className="s-title">Perks & Benefits</h2>
                <div className="perks-wrap">
                  {job.perks.map((p) => (
                    <span key={p} className="perk-chip">✓ {p}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="jd-sidebar">

            {/* Apply card */}
            <div className="card">
              <div className="apply-card">
                <Link to={`/apply/${job.id}`} className="apply-btn">Apply Now →</Link>
                <p className="apply-note">⚡ Usually responds within 2–3 business days. Easy 1-click apply with your JobPortal profile.</p>
              </div>
            </div>

            {/* Company card */}
            <div className="card">
              <div className="company-card">
                <div className="company-logo-lg">{job.company[0]}</div>
                <div className="company-name">{job.company}</div>
                <p className="company-desc">One of the world's leading technology companies, building products used by billions every day.</p>
                <a href="#" className="company-link">View all jobs at {job.company} →</a>
              </div>
            </div>

            {/* Similar jobs */}
            <div className="card">
              <div className="similar-card">
                <div className="similar-title">Similar Jobs</div>
                {similar.map((s) => (
                  <div className="similar-job" key={s.id}>
                    <Link to={`/jobs/${s.id}`} className="similar-job-title">{s.title}</Link>
                    <div className="similar-job-meta">{s.company} · {s.location}</div>
                    <div className="similar-salary">{s.salary}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link to="/jobs" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", textDecoration: "none", paddingLeft: 4 }}>
              ← Back to all jobs
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;