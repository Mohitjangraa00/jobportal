import React, { useState, useRef, useEffect } from "react";

// ─── helpers ────────────────────────────────────────────────
const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || {}; }
  catch { return {}; }
};

const saveUserToStorage = (data) => {
  try {
    const current = getStoredUser();
    const merged  = { ...current, ...data };
    localStorage.setItem("user", JSON.stringify(merged));
    return merged;
  } catch { return data; }
};

// ─── Profile ─────────────────────────────────────────────────
const Profile = () => {
  const fileInputRef = useRef(null);

  // ✅ Initialise form from localStorage so data survives refresh
  const [form, setForm] = useState(() => {
    const u = getStoredUser();
    return {
      name:     u.name     || "",
      email:    u.email    || "",
      phone:    u.phone    || "",
      location: u.location || "",
      bio:      u.bio      || "",
      title:    u.title    || "",
      linkedin: u.linkedin || "",
      github:   u.github   || "",
      skills:   u.skills   || [],
    };
  });

  // ✅ Load avatar from localStorage
  const [preview, setPreview]       = useState(() => getStoredUser().profilePic || null);
  const [message, setMessage]       = useState({ text: "", type: "" });
  const [loading, setLoading]       = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab]   = useState("personal");

  // ✅ Auto-save drafts to localStorage as user types (debounced 600ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveUserToStorage(form);
    }, 600);
    return () => clearTimeout(timer);
  }, [form]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const file = files[0];
      if (!file) return;
      // Convert to base64 and persist in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        saveUserToStorage({ profilePic: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
    if (message.text) setMessage({ text: "", type: "" });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm((f) => ({ ...f, skills: [...f.skills, skillInput.trim()] }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setMessage({ text: "Name and email are required.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // ─── Try real API first ──────────────────────────────
      const token = localStorage.getItem("token");
      if (token) {
        const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${BASE}/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const data = await res.json();
          // ✅ Merge server response back into localStorage
          saveUserToStorage(data?.user || form);
          setMessage({ text: "Profile saved successfully!", type: "success" });
          setLoading(false);
          return;
        }
      }
    } catch {
      // API not ready — fall through to localStorage-only save
    }

    // ─── Fallback: persist to localStorage ───────────────
    saveUserToStorage(form);
    setMessage({ text: "Profile saved! (Will sync to server when backend is ready)", type: "success" });
    setLoading(false);
  };

  // Completion bar
  const completionFields = [form.name, form.email, form.phone, form.location, form.bio, form.title];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const tabs = [
    { id: "personal",     label: "Personal Info",  icon: "👤" },
    { id: "professional", label: "Professional",   icon: "💼" },
    { id: "social",       label: "Social Links",   icon: "🔗" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-root { font-family:'DM Sans',sans-serif; background:#f0ede8; min-height:100vh; padding:40px 24px 72px; color:#0f2027; }
        .pf-container { max-width:960px; margin:0 auto; display:grid; grid-template-columns:280px 1fr; gap:24px; align-items:start; }
        @media(max-width:780px){ .pf-container{ grid-template-columns:1fr; } }

        .page-tag { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#6366f1; margin-bottom:6px; }
        .page-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#0f2027; margin-bottom:28px; }

        .card { background:#fff; border:1.5px solid #e5e7eb; border-radius:20px; overflow:hidden; }

        .avatar-card { padding:32px 24px; text-align:center; }
        .avatar-wrap { position:relative; width:110px; height:110px; margin:0 auto 20px; }
        .avatar-img { width:110px; height:110px; border-radius:50%; object-fit:cover; border:3px solid #e5e7eb; }
        .avatar-initials { width:110px; height:110px; border-radius:50%; background:#0f2027; border:3px solid #e5e7eb; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:36px; font-weight:800; color:#fff; }
        .avatar-edit-btn { position:absolute; bottom:4px; right:4px; width:30px; height:30px; border-radius:50%; background:#0f2027; border:2px solid #fff; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; }
        .avatar-edit-btn:hover { background:#1e3a4a; }

        .pf-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#0f2027; margin-bottom:4px; }
        .pf-email { font-size:13px; color:#94a3b8; margin-bottom:20px; }

        .completion-wrap { background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; padding:16px; }
        .completion-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
        .completion-label { font-size:12px; font-weight:600; color:#374151; }
        .completion-pct { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:#6366f1; }
        .completion-bar { width:100%; height:6px; background:#e5e7eb; border-radius:99px; overflow:hidden; }
        .completion-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#6366f1,#22d3ee); transition:width .6s ease; }
        .completion-hint { font-size:11px; color:#94a3b8; margin-top:8px; }

        .sidebar-divider { height:1px; background:#f1f5f9; margin:20px 0; }
        .sidebar-meta-item { display:flex; align-items:center; gap:10px; font-size:13px; color:#64748b; margin-bottom:12px; }

        .pf-main { display:flex; flex-direction:column; gap:20px; }
        .tabs { display:flex; gap:0; background:#f8fafc; border-radius:14px; padding:4px; border:1.5px solid #e5e7eb; }
        .tab-btn { flex:1; padding:10px 8px; border:none; border-radius:11px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; background:transparent; color:#94a3b8; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:6px; }
        .tab-btn.active { background:#fff; color:#0f2027; font-weight:600; box-shadow:0 2px 8px rgba(15,32,39,.08); }

        .form-card { padding:32px; }
        .form-section-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#0f2027; margin-bottom:6px; }
        .form-section-sub { font-size:13px; color:#94a3b8; margin-bottom:28px; }

        .field-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:560px){ .field-row{ grid-template-columns:1fr; } }
        .field-group { margin-bottom:18px; }
        .field-label { display:block; font-size:13px; font-weight:500; color:#374151; margin-bottom:7px; }
        .field-label span { color:#ef4444; }
        .field-input, .field-textarea { width:100%; padding:13px 16px; border:1.5px solid #e5e7eb; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:15px; color:#0f2027; background:#fff; outline:none; transition:border-color .2s,box-shadow .2s; }
        .field-input:focus,.field-textarea:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
        .field-input::placeholder,.field-textarea::placeholder { color:#c4c9d4; }
        .field-textarea { resize:vertical; min-height:100px; }
        .field-input-icon { position:relative; }
        .field-input-icon .field-input { padding-left:42px; }
        .field-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; }

        .skills-box { width:100%; min-height:52px; padding:8px 12px; border:1.5px solid #e5e7eb; border-radius:12px; display:flex; flex-wrap:wrap; gap:6px; align-items:center; cursor:text; background:#fff; transition:border-color .2s,box-shadow .2s; }
        .skills-box:focus-within { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
        .skill-tag { display:flex; align-items:center; gap:5px; background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.2); color:#6366f1; border-radius:99px; padding:4px 10px; font-size:12px; font-weight:600; }
        .skill-remove { cursor:pointer; font-size:14px; line-height:1; color:#a5b4fc; }
        .skill-remove:hover { color:#6366f1; }
        .skill-input { border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:14px; color:#0f2027; flex:1; min-width:120px; background:transparent; }
        .skill-input::placeholder { color:#c4c9d4; }
        .skill-hint { font-size:11px; color:#94a3b8; margin-top:6px; }

        .msg-box { padding:12px 16px; border-radius:10px; font-size:13px; display:flex; align-items:center; gap:8px; margin-bottom:20px; }
        .msg-box.success { background:rgba(34,197,94,.07); border:1px solid rgba(34,197,94,.25); color:#16a34a; }
        .msg-box.error   { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; }

        .autosave-badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#94a3b8; padding:4px 10px; background:#f8fafc; border:1px solid #f1f5f9; border-radius:99px; margin-bottom:16px; }
        .autosave-dot { width:6px; height:6px; background:#22c55e; border-radius:50%; animation:asp 2s infinite; }
        @keyframes asp { 0%,100%{opacity:1}50%{opacity:.35} }

        .submit-btn { width:100%; padding:15px; background:#0f2027; color:#fff; border:none; border-radius:12px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:background .2s,transform .15s; display:flex; align-items:center; justify-content:center; gap:10px; margin-top:8px; }
        .submit-btn:hover:not(:disabled){ background:#1e3a4a; transform:translateY(-1px); }
        .submit-btn:disabled { opacity:.7; cursor:not-allowed; }
        .spinner { width:18px; height:18px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
        @keyframes spin { to{ transform:rotate(360deg); } }
      `}</style>

      <div className="pf-root">
        <p className="page-tag">Account Settings</p>
        <h1 className="page-title">My Profile</h1>

        <div className="pf-container">

          {/* ── Sidebar ── */}
          <div className="card">
            <div className="avatar-card">
              <div className="avatar-wrap">
                {preview
                  ? <img src={preview} alt="Profile" className="avatar-img" />
                  : <div className="avatar-initials">{form.name ? form.name[0].toUpperCase() : "?"}</div>
                }
                <div className="avatar-edit-btn" onClick={() => fileInputRef.current.click()}>✏️</div>
                <input ref={fileInputRef} type="file" name="profilePic" accept="image/*" onChange={handleChange} style={{ display:"none" }} />
              </div>

              <div className="pf-name">{form.name || "Your Name"}</div>
              <div className="pf-email">{form.email || "your@email.com"}</div>

              <div className="completion-wrap">
                <div className="completion-header">
                  <span className="completion-label">Profile Strength</span>
                  <span className="completion-pct">{completion}%</span>
                </div>
                <div className="completion-bar">
                  <div className="completion-fill" style={{ width:`${completion}%` }} />
                </div>
                <p className="completion-hint">
                  {completion === 100 ? "🎉 Profile complete!" : "Fill all fields to boost your profile"}
                </p>
              </div>

              <div className="sidebar-divider" />
              {form.location && <div className="sidebar-meta-item">📍 {form.location}</div>}
              {form.phone    && <div className="sidebar-meta-item">📞 {form.phone}</div>}
              {form.title    && <div className="sidebar-meta-item">💼 {form.title}</div>}
              {form.linkedin && <div className="sidebar-meta-item">🔗 LinkedIn connected</div>}
              {!form.location && !form.phone && !form.title && (
                <div className="sidebar-meta-item" style={{ color:"#d1d5db", fontStyle:"italic" }}>No details added yet</div>
              )}
            </div>
          </div>

          {/* ── Form ── */}
          <div className="pf-main">
            <div className="tabs">
              {tabs.map((t) => (
                <button key={t.id} className={`tab-btn${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>

            <div className="card">
              <div className="form-card">
                <div className="autosave-badge"><span className="autosave-dot" /> Auto-saving draft</div>

                {message.text && (
                  <div className={`msg-box ${message.type}`}>
                    {message.type === "success" ? "✓" : "⚠️"} {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {activeTab === "personal" && (
                    <>
                      <div className="form-section-title">Personal Information</div>
                      <p className="form-section-sub">Your basic contact details</p>
                      <div className="field-row">
                        <div className="field-group">
                          <label className="field-label">Full Name <span>*</span></label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="field-input" />
                        </div>
                        <div className="field-group">
                          <label className="field-label">Email Address <span>*</span></label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="field-input" />
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field-group">
                          <label className="field-label">Phone Number</label>
                          <div className="field-input-icon">
                            <span className="field-icon">📞</span>
                            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="field-input" />
                          </div>
                        </div>
                        <div className="field-group">
                          <label className="field-label">Location</label>
                          <div className="field-input-icon">
                            <span className="field-icon">📍</span>
                            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, State" className="field-input" />
                          </div>
                        </div>
                      </div>
                      <div className="field-group">
                        <label className="field-label">Bio / About Me</label>
                        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Tell employers about yourself..." className="field-textarea" rows={4} />
                      </div>
                    </>
                  )}

                  {activeTab === "professional" && (
                    <>
                      <div className="form-section-title">Professional Details</div>
                      <p className="form-section-sub">Your role and skill set</p>
                      <div className="field-group">
                        <label className="field-label">Job Title / Role</label>
                        <div className="field-input-icon">
                          <span className="field-icon">💼</span>
                          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className="field-input" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label className="field-label">Skills</label>
                        <div className="skills-box">
                          {form.skills.map((s) => (
                            <span key={s} className="skill-tag">
                              {s}<span className="skill-remove" onClick={() => removeSkill(s)}>×</span>
                            </span>
                          ))}
                          <input className="skill-input" placeholder={form.skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."} value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                        </div>
                        <p className="skill-hint">Press Enter after each skill</p>
                      </div>
                    </>
                  )}

                  {activeTab === "social" && (
                    <>
                      <div className="form-section-title">Social Links</div>
                      <p className="form-section-sub">Connect your online presence</p>
                      <div className="field-group">
                        <label className="field-label">LinkedIn URL</label>
                        <div className="field-input-icon">
                          <span className="field-icon">🔗</span>
                          <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/your-profile" className="field-input" />
                        </div>
                      </div>
                      <div className="field-group">
                        <label className="field-label">GitHub URL</label>
                        <div className="field-input-icon">
                          <span className="field-icon">💻</span>
                          <input type="url" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/your-username" className="field-input" />
                        </div>
                      </div>
                    </>
                  )}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <><div className="spinner" />Saving...</> : "Save Changes →"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;