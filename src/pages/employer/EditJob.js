import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    salary: "₹18–28 LPA",
    type: "Full-Time",
    mode: "Hybrid",
    experience: "2–4 Years",
    description: "We are looking for a skilled Frontend Developer to join our growing product team. You will be responsible for building and maintaining high-quality web applications.",
    requirements: "Strong knowledge of React.js\nExperience with REST APIs\nGood communication skills",
    skills: "React, JavaScript, TypeScript, CSS",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setMessage({ text: "Job updated successfully!", type: "success" });
    setLoading(false);
    setTimeout(() => navigate("/employer/manage-jobs"), 1500);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "details", label: "Job Details", icon: "📝" },
    { id: "requirements", label: "Requirements", icon: "✅" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ej-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .ej-wrap { max-width: 820px; margin: 0 auto; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; font-size: 13px; color: #94a3b8; flex-wrap: wrap; }
        .breadcrumb a { color: #6366f1; text-decoration: none; font-weight: 500; }
        .breadcrumb a:hover { text-decoration: underline; }
        .breadcrumb-sep { color: #d1d5db; }

        .ej-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }
        .ej-title { font-family: 'Syne', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .ej-sub { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }

        /* Job badge summary */
        .job-summary { background: #0f2027; border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; position: relative; overflow: hidden; }
        .js-orb { position: absolute; border-radius: 50%; filter: blur(50px); pointer-events: none; width: 220px; height: 220px; background: rgba(99,102,241,.2); top: -60px; right: -40px; }
        .js-logo { width: 44px; height: 44px; border-radius: 10px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0; position: relative; z-index: 1; }
        .js-info { position: relative; z-index: 1; }
        .js-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #fff; }
        .js-meta { font-size: 12px; color: rgba(255,255,255,.5); margin-top: 3px; }
        .js-badge { margin-left: auto; background: rgba(99,102,241,.3); border: 1px solid rgba(99,102,241,.4); color: #a5b4fc; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; font-family: 'Syne', sans-serif; position: relative; z-index: 1; }

        /* Tabs */
        .tabs { display: flex; gap: 4px; background: #f8fafc; border-radius: 14px; padding: 4px; border: 1.5px solid #e5e7eb; margin-bottom: 20px; }
        .tab-btn { flex: 1; padding: 10px 8px; border: none; border-radius: 11px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; color: #94a3b8; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .tab-btn.active { background: #fff; color: #0f2027; font-weight: 600; box-shadow: 0 2px 8px rgba(15,32,39,.08); }

        /* Form card */
        .form-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 32px; }
        .fs-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .fs-sub { font-size: 13px; color: #94a3b8; margin-bottom: 26px; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 520px) { .field-row { grid-template-columns: 1fr; } }
        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 7px; }
        .field-label span { color: #ef4444; }
        .field-input, .field-select, .field-textarea { width: 100%; padding: 13px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
        .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .field-input::placeholder, .field-textarea::placeholder { color: #c4c9d4; }
        .field-textarea { resize: vertical; min-height: 120px; }
        .field-select { cursor: pointer; }

        .msg { padding: 12px 16px; border-radius: 10px; font-size: 13px; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .msg.success { background: rgba(34,197,94,.07); border: 1px solid rgba(34,197,94,.25); color: #16a34a; }
        .msg.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        .form-footer { display: flex; gap: 12px; margin-top: 8px; }
        .submit-btn { flex: 1; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .2s, transform .15s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .cancel-btn { padding: 15px 24px; background: #f8fafc; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #374151; cursor: pointer; transition: border-color .2s; }
        .cancel-btn:hover { border-color: #ef4444; color: #ef4444; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .hint { font-size: 11px; color: #94a3b8; margin-top: 5px; }
      `}</style>

      <div className="ej-root">
        <div className="ej-wrap">

          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/employer/dashboard">Dashboard</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/employer/manage-jobs">Manage Jobs</Link>
            <span className="breadcrumb-sep">›</span>
            <span>Edit Job #{id}</span>
          </div>

          <p className="ej-tag">Employer Tools</p>
          <h1 className="ej-title">Edit Job Posting</h1>
          <p className="ej-sub">Update your job listing details below</p>

          {/* Job summary strip */}
          <div className="job-summary">
            <div className="js-orb" />
            <div className="js-logo">{form.company[0]}</div>
            <div className="js-info">
              <div className="js-title">{form.title || "Job Title"}</div>
              <div className="js-meta">{form.company} · {form.location}</div>
            </div>
            <span className="js-badge">Editing</span>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((t) => (
              <button key={t.id} className={`tab-btn${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)} type="button">
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <div className="form-card">
            {message.text && (
              <div className={`msg ${message.type}`}>
                {message.type === "success" ? "✓" : "⚠️"} {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {activeTab === "basic" && (
                <>
                  <div className="fs-title">Basic Information</div>
                  <p className="fs-sub">Core details that appear on the job card</p>

                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Job Title <span>*</span></label>
                      <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Company <span>*</span></label>
                      <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google" className="field-input" />
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Location <span>*</span></label>
                      <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Salary Range</label>
                      <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹18–28 LPA" className="field-input" />
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Job Type</label>
                      <select name="type" value={form.type} onChange={handleChange} className="field-select">
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label className="field-label">Work Mode</label>
                      <select name="mode" value={form.mode} onChange={handleChange} className="field-select">
                        <option>Remote</option>
                        <option>Hybrid</option>
                        <option>On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Experience Required</label>
                    <input type="text" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 2–4 Years" className="field-input" />
                  </div>
                </>
              )}

              {activeTab === "details" && (
                <>
                  <div className="fs-title">Job Description</div>
                  <p className="fs-sub">Describe the role, responsibilities and day-to-day work</p>
                  <div className="field-group">
                    <label className="field-label">Description <span>*</span></label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role..." className="field-textarea" rows={8} />
                    <p className="hint">Tip: Be specific about responsibilities to attract relevant candidates.</p>
                  </div>
                </>
              )}

              {activeTab === "requirements" && (
                <>
                  <div className="fs-title">Requirements & Skills</div>
                  <p className="fs-sub">What qualifications and skills does the ideal candidate need?</p>
                  <div className="field-group">
                    <label className="field-label">Requirements</label>
                    <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="List each requirement on a new line..." className="field-textarea" rows={6} />
                    <p className="hint">Enter one requirement per line. These will appear as bullet points.</p>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Required Skills</label>
                    <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. React, Node.js, TypeScript" className="field-input" />
                    <p className="hint">Separate skills with commas.</p>
                  </div>
                </>
              )}

              <div className="form-footer">
                <button type="button" className="cancel-btn" onClick={() => navigate("/employer/manage-jobs")}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <><div className="spinner" /> Saving...</> : "Save Changes →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJob;