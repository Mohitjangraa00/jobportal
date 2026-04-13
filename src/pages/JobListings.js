import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const JobListings = () => {
  const jobsData = [
    { id: 1, title: "Frontend Developer", company: "Google", location: "Bangalore", type: "Full-Time", salary: "₹18–28 LPA", mode: "Hybrid", experience: "2–4 yrs", posted: "1 day ago", skills: ["React", "CSS", "TypeScript"] },
    { id: 2, title: "Backend Developer", company: "Amazon", location: "Hyderabad", type: "Part-Time", salary: "₹22–35 LPA", mode: "Remote", experience: "3–5 yrs", posted: "2 days ago", skills: ["Node.js", "MongoDB", "AWS"] },
    { id: 3, title: "Full Stack Developer", company: "Microsoft", location: "Delhi", type: "Full-Time", salary: "₹20–32 LPA", mode: "On-site", experience: "2–4 yrs", posted: "3 days ago", skills: ["React", "Node.js", "SQL"] },
    { id: 4, title: "UI/UX Designer", company: "Adobe", location: "Mumbai", type: "Internship", salary: "₹8–12 LPA", mode: "Remote", experience: "0–1 yr", posted: "5 days ago", skills: ["Figma", "Sketch", "Prototyping"] },
    { id: 5, title: "Data Scientist", company: "Flipkart", location: "Bangalore", type: "Full-Time", salary: "₹25–40 LPA", mode: "Hybrid", experience: "3–6 yrs", posted: "1 day ago", skills: ["Python", "ML", "TensorFlow"] },
    { id: 6, title: "DevOps Engineer", company: "Infosys", location: "Pune", type: "Full-Time", salary: "₹15–24 LPA", mode: "On-site", experience: "2–5 yrs", posted: "Today", skills: ["Docker", "Kubernetes", "CI/CD"] },
    { id: 7, title: "Android Developer", company: "Swiggy", location: "Bangalore", type: "Full-Time", salary: "₹16–26 LPA", mode: "Hybrid", experience: "1–3 yrs", posted: "Today", skills: ["Kotlin", "Android SDK", "Jetpack"] },
    { id: 8, title: "Product Manager", company: "Razorpay", location: "Hyderabad", type: "Full-Time", salary: "₹30–50 LPA", mode: "Remote", experience: "4–7 yrs", posted: "2 days ago", skills: ["Strategy", "Roadmapping", "Analytics"] },
    { id: 9, title: "Cloud Architect", company: "TCS", location: "Chennai", type: "Full-Time", salary: "₹35–55 LPA", mode: "On-site", experience: "6+ yrs", posted: "4 days ago", skills: ["AWS", "Azure", "GCP"] },
  ];

  const [search, setSearch] = useState("");
  const [locationQ, setLocationQ] = useState("");
  const [typeFilter, setTypeFilter] = useState([]);
  const [modeFilter, setModeFilter] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [savedJobs, setSavedJobs] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const types = ["Full-Time", "Part-Time", "Internship", "Contract"];
  const modes = ["Remote", "Hybrid", "On-site"];

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const toggleSave = (id) =>
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);

  const filtered = useMemo(() => {
    let list = jobsData.filter((j) => {
      const matchTitle = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase());
      const matchLoc = j.location.toLowerCase().includes(locationQ.toLowerCase());
      const matchType = typeFilter.length === 0 || typeFilter.includes(j.type);
      const matchMode = modeFilter.length === 0 || modeFilter.includes(j.mode);
      return matchTitle && matchLoc && matchType && matchMode;
    });
    if (sortBy === "salary") list = [...list].sort((a, b) => parseInt(b.salary) - parseInt(a.salary));
    return list;
  }, [search, locationQ, typeFilter, modeFilter, sortBy]);

  const activeFilterCount = typeFilter.length + modeFilter.length;

  const clearAll = () => { setSearch(""); setLocationQ(""); setTypeFilter([]); setModeFilter([]); setSortBy("recent"); };

  const modeColor = { Remote: { bg: "rgba(34,197,94,.08)", border: "rgba(34,197,94,.22)", color: "#16a34a" }, Hybrid: { bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.22)", color: "#d97706" }, "On-site": { bg: "rgba(99,102,241,.08)", border: "rgba(99,102,241,.22)", color: "#6366f1" } };
  const typeColor = { "Full-Time": "#6366f1", "Part-Time": "#f59e0b", Internship: "#22c55e", Contract: "#ef4444" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .jl-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; color: #0f2027; }

        /* Header */
        .jl-header { max-width: 1100px; margin: 0 auto 28px; }
        .jl-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 8px; }
        .jl-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #0f2027; }
        .jl-sub { font-size: 14px; color: #94a3b8; margin-top: 4px; }

        /* Search bar */
        .search-wrap { max-width: 1100px; margin: 0 auto 24px; }
        .search-box { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; display: flex; overflow: hidden; box-shadow: 0 2px 12px rgba(15,32,39,.06); }
        .search-box:focus-within { border-color: #6366f1; box-shadow: 0 2px 12px rgba(99,102,241,.12); }
        .s-input { flex: 1; padding: 16px 20px; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027; background: transparent; }
        .s-input::placeholder { color: #c4c9d4; }
        .s-div { width: 1px; background: #f1f5f9; margin: 10px 0; }
        .s-btn { padding: 0 28px; background: #0f2027; color: #fff; border: none; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .18s; white-space: nowrap; }
        .s-btn:hover { background: #1e3a4a; }

        /* Layout */
        .jl-layout { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 800px) { .jl-layout { grid-template-columns: 1fr; } }

        /* Sidebar */
        .jl-sidebar { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; overflow: hidden; position: sticky; top: 88px; }
        .sidebar-header { padding: 20px 20px 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .sidebar-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; color: #0f2027; display: flex; align-items: center; gap: 8px; }
        .filter-badge { width: 20px; height: 20px; border-radius: 99px; background: #6366f1; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; }
        .clear-btn { font-size: 12px; color: #ef4444; font-weight: 600; background: none; border: none; cursor: pointer; padding: 0; }
        .clear-btn:hover { text-decoration: underline; }

        .filter-section { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .filter-section:last-child { border-bottom: none; }
        .filter-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px; }

        .filter-chip { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; margin-bottom: 6px; cursor: pointer; font-size: 13px; color: #374151; transition: background .15s; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; width: 100%; text-align: left; }
        .filter-chip:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,.04); }
        .filter-chip.checked { border-color: #6366f1; background: rgba(99,102,241,.06); color: #6366f1; font-weight: 600; }
        .chip-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; transition: all .15s; }
        .filter-chip.checked .chip-check { background: #6366f1; border-color: #6366f1; color: #fff; }

        /* Mobile filter toggle */
        .mob-filter-toggle { display: none; }
        @media (max-width: 800px) { .mob-filter-toggle { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; cursor: pointer; margin-bottom: 16px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; } }
        @media (max-width: 800px) { .jl-sidebar { display: none; } .jl-sidebar.mob-open { display: block; } }

        /* Results header */
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .results-count { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #0f2027; }
        .results-count span { color: #6366f1; }

        .sort-select { padding: 8px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #374151; outline: none; background: #fff; cursor: pointer; }
        .sort-select:focus { border-color: #6366f1; }

        /* Active filter chips row */
        .active-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .a-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; background: rgba(99,102,241,.08); border: 1px solid rgba(99,102,241,.2); border-radius: 99px; font-size: 12px; font-weight: 600; color: #6366f1; }
        .a-chip-x { cursor: pointer; font-size: 14px; color: #a5b4fc; line-height: 1; }
        .a-chip-x:hover { color: #6366f1; }

        /* Job grid */
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }

        /* Job card */
        .jc { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 18px; padding: 22px; transition: border-color .18s, transform .15s, box-shadow .18s; display: flex; flex-direction: column; }
        .jc:hover { border-color: #6366f1; transform: translateY(-3px); box-shadow: 0 8px 28px rgba(99,102,241,.1); }

        .jc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
        .jc-logo { width: 42px; height: 42px; border-radius: 10px; background: #f1f5f9; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f2027; flex-shrink: 0; }
        .jc-save { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 15px; transition: border-color .18s, background .18s; }
        .jc-save:hover, .jc-save.saved { border-color: #6366f1; background: rgba(99,102,241,.06); }

        .jc-company { font-size: 12px; color: #94a3b8; margin-bottom: 3px; margin-top: 10px; }
        .jc-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #0f2027; margin-bottom: 12px; line-height: 1.3; }

        .jc-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .jc-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px; border: 1px solid; font-family: 'Syne', sans-serif; }

        .jc-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
        .jc-skill { font-size: 11px; padding: 3px 9px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 99px; color: #64748b; }

        .jc-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f1f5f9; margin-top: auto; }
        .jc-salary { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #0f2027; }
        .jc-posted { font-size: 11px; color: #94a3b8; }

        .jc-actions { display: flex; gap: 8px; margin-top: 14px; }
        .jc-btn-primary { flex: 1; padding: 9px; background: #0f2027; color: #fff; border: none; border-radius: 9px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: none; text-align: center; transition: background .18s; }
        .jc-btn-primary:hover { background: #1e3a4a; }
        .jc-btn-ghost { padding: 9px 14px; background: #f8fafc; border: 1.5px solid #e5e7eb; border-radius: 9px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #374151; text-decoration: none; text-align: center; transition: border-color .18s; }
        .jc-btn-ghost:hover { border-color: #6366f1; color: #6366f1; }

        /* Empty state */
        .empty { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 64px 24px; text-align: center; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f2027; margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: #94a3b8; margin-bottom: 20px; }
        .empty-btn { display: inline-block; padding: 10px 22px; background: #0f2027; color: #fff; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
      `}</style>

      <div className="jl-root">

        {/* Header */}
        <div className="jl-header">
          <p className="jl-tag">Explore Opportunities</p>
          <h1 className="jl-title">Browse All Jobs</h1>
          <p className="jl-sub">{jobsData.length} curated positions from top companies</p>
        </div>

        {/* Search bar */}
        <div className="search-wrap">
          <div className="search-box">
            <input className="s-input" type="text" placeholder="Job title, keyword or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="s-div" />
            <input className="s-input" type="text" placeholder="City or remote..." value={locationQ} onChange={(e) => setLocationQ(e.target.value)} />
            <button className="s-btn">Search</button>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="mob-filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
          <span>🎛️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          <span>{filtersOpen ? "▲" : "▼"}</span>
        </div>

        <div className="jl-layout">

          {/* ── SIDEBAR ── */}
          <div className={`jl-sidebar${filtersOpen ? " mob-open" : ""}`}>
            <div className="sidebar-header">
              <div className="sidebar-title">
                Filters
                {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
              </div>
              {activeFilterCount > 0 && <button className="clear-btn" onClick={clearAll}>Clear all</button>}
            </div>

            <div className="filter-section">
              <div className="filter-label">Job Type</div>
              {types.map((t) => (
                <button key={t} className={`filter-chip${typeFilter.includes(t) ? " checked" : ""}`} onClick={() => toggleArr(typeFilter, setTypeFilter, t)}>
                  <span className="chip-check">{typeFilter.includes(t) ? "✓" : ""}</span>
                  {t}
                </button>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-label">Work Mode</div>
              {modes.map((m) => (
                <button key={m} className={`filter-chip${modeFilter.includes(m) ? " checked" : ""}`} onClick={() => toggleArr(modeFilter, setModeFilter, m)}>
                  <span className="chip-check">{modeFilter.includes(m) ? "✓" : ""}</span>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* ── MAIN ── */}
          <div>
            {/* Results header */}
            <div className="results-header">
              <div className="results-count"><span>{filtered.length}</span> jobs found</div>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>

            {/* Active filter chips */}
            {(typeFilter.length > 0 || modeFilter.length > 0) && (
              <div className="active-chips">
                {typeFilter.map((t) => (
                  <span key={t} className="a-chip">{t} <span className="a-chip-x" onClick={() => toggleArr(typeFilter, setTypeFilter, t)}>×</span></span>
                ))}
                {modeFilter.map((m) => (
                  <span key={m} className="a-chip">{m} <span className="a-chip-x" onClick={() => toggleArr(modeFilter, setModeFilter, m)}>×</span></span>
                ))}
              </div>
            )}

            {/* Jobs */}
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No jobs found</div>
                <p className="empty-sub">Try adjusting your search or filters</p>
                <button className="empty-btn" onClick={clearAll}>Clear filters</button>
              </div>
            ) : (
              <div className="jobs-grid">
                {filtered.map((job) => {
                  const mc = modeColor[job.mode] || modeColor["On-site"];
                  const tc = typeColor[job.type] || "#6366f1";
                  return (
                    <div className="jc" key={job.id}>
                      <div className="jc-top">
                        <div className="jc-logo">{job.company[0]}</div>
                        <div className={`jc-save${savedJobs.includes(job.id) ? " saved" : ""}`} onClick={() => toggleSave(job.id)} title="Save job">
                          {savedJobs.includes(job.id) ? "🔖" : "🤍"}
                        </div>
                      </div>

                      <div className="jc-company">{job.company} · {job.location}</div>
                      <div className="jc-title">{job.title}</div>

                      <div className="jc-badges">
                        <span className="jc-badge" style={{ background: `rgba(${tc === "#6366f1" ? "99,102,241" : tc === "#f59e0b" ? "245,158,11" : tc === "#22c55e" ? "34,197,94" : "239,68,68"},.08)`, borderColor: `${tc}44`, color: tc }}>{job.type}</span>
                        <span className="jc-badge" style={{ background: mc.bg, borderColor: mc.border, color: mc.color }}>{job.mode}</span>
                        <span className="jc-badge" style={{ background: "#f8fafc", borderColor: "#e5e7eb", color: "#64748b" }}>⏳ {job.experience}</span>
                      </div>

                      <div className="jc-skills">
                        {job.skills.map((s) => <span key={s} className="jc-skill">{s}</span>)}
                      </div>

                      <div className="jc-footer">
                        <span className="jc-salary">{job.salary}</span>
                        <span className="jc-posted">🕐 {job.posted}</span>
                      </div>

                      <div className="jc-actions">
                        <Link to={`/jobs/${job.id}`} className="jc-btn-primary">View & Apply</Link>
                        <Link to={`/jobs/${job.id}`} className="jc-btn-ghost">Details</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobListings;