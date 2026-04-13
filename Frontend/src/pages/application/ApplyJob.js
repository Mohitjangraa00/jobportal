import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Dummy job lookup (replace with API)
const jobsData = {
  1: { title: "Frontend Developer", company: "Google", location: "Bangalore", type: "Full-Time", salary: "₹18–28 LPA", mode: "Hybrid" },
  2: { title: "Backend Developer", company: "Amazon", location: "Hyderabad", type: "Full-Time", salary: "₹22–35 LPA", mode: "Remote" },
  3: { title: "Full Stack Developer", company: "Microsoft", location: "Delhi", type: "Full-Time", salary: "₹20–32 LPA", mode: "On-site" },
};

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = jobsData[id] || { title: `Job #${id}`, company: "Company", location: "Location", type: "Full-Time", salary: "Competitive", mode: "Hybrid" };

  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "", resume: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
    if (error) setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".doc") || file.name.endsWith(".docx"))) {
      setForm((f) => ({ ...f, resume: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { setError("Please fill all required fields."); return; }
    if (!form.resume) { setError("Please upload your resume."); return; }
    setLoading(true); setError("");
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false); setSubmitted(true);
  };

  if (submitted) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .success-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
        .success-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 24px; padding: 56px 48px; text-align: center; max-width: 480px; width: 100%; }
        .success-icon { font-size: 56px; margin-bottom: 20px; }
        .success-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #0f2027; margin-bottom: 10px; }
        .success-sub { font-size: 14px; color: #94a3b8; line-height: 1.7; margin-bottom: 28px; }
        .success-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .s-btn { padding: 12px 22px; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; }
        .s-btn.dark { background: #0f2027; color: #fff; }
        .s-btn.ghost { background: #f8fafc; color: #374151; border: 1.5px solid #e5e7eb; }
      `}</style>
      <div className="success-root">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <div className="success-title">Application Submitted!</div>
          <p className="success-sub">Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been sent. They typically respond within 3–5 business days.</p>
          <div className="success-btns">
            <Link to="/candidate/applied-jobs" className="s-btn dark">View My Applications</Link>
            <Link to="/jobs" className="s-btn ghost">Browse More Jobs</Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ap-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .ap-wrap { max-width: 740px; margin: 0 auto; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; font-size: 13px; color: #94a3b8; }
        .breadcrumb a { color: #6366f1; text-decoration: none; font-weight: 500; }
        .breadcrumb a:hover { text-decoration: underline; }

        /* Job summary card */
        .job-summary { background: #0f2027; border-radius: 18px; padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; gap: 18px; position: relative; overflow: hidden; }
        .js-orb { position: absolute; border-radius: 50%; filter: blur(50px); pointer-events: none; }
        .js-orb.o1 { width: 200px; height: 200px; background: rgba(99,102,241,.2); top: -60px; right: -40px; }
        .js-logo { width: 50px; height: 50px; border-radius: 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; flex-shrink: 0; position: relative; z-index: 1; }
        .js-info { position: relative; z-index: 1; }
        .js-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .js-meta { font-size: 13px; color: rgba(255,255,255,.5); display: flex; gap: 14px; flex-wrap: wrap; }
        .js-badge { background: rgba(99,102,241,.25); border: 1px solid rgba(99,102,241,.3); color: #a5b4fc; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 99px; font-family: 'Syne', sans-serif; }

        /* Steps */
        .steps-row { display: flex; align-items: center; gap: 0; margin-bottom: 24px; }
        .step-item { display: flex; align-items: center; gap: 8px; flex: 1; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; flex-shrink: 0; transition: all .2s; }
        .step-circle.done { background: #22c55e; color: #fff; }
        .step-circle.active { background: #0f2027; color: #fff; }
        .step-circle.pending { background: #f1f5f9; color: #94a3b8; border: 1.5px solid #e5e7eb; }
        .step-label { font-size: 12px; font-weight: 500; color: #64748b; }
        .step-label.active { color: #0f2027; font-weight: 600; }
        .step-line { flex: 1; height: 2px; background: #e5e7eb; margin: 0 8px; }
        .step-line.done { background: #22c55e; }

        /* Form card */
        .form-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; padding: 32px; }
        .fc-section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .fc-section-sub { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 520px) { .field-row { grid-template-columns: 1fr; } }
        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 7px; }
        .field-label span { color: #ef4444; }
        .field-input, .field-textarea { width: 100%; padding: 13px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
        .field-input:focus, .field-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .field-input::placeholder, .field-textarea::placeholder { color: #c4c9d4; }
        .field-textarea { resize: vertical; min-height: 120px; }

        /* Drop zone */
        .drop-zone { border: 2px dashed #d1d5db; border-radius: 14px; padding: 32px 24px; text-align: center; cursor: pointer; transition: all .2s; background: #fafafa; }
        .drop-zone:hover, .drop-zone.over { border-color: #6366f1; background: rgba(99,102,241,.04); }
        .drop-icon { font-size: 32px; margin-bottom: 10px; }
        .drop-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }
        .drop-sub { font-size: 12px; color: #94a3b8; }
        .drop-browse { color: #6366f1; text-decoration: underline; cursor: pointer; }
        .file-preview { display: flex; align-items: center; gap: 12px; background: rgba(34,197,94,.06); border: 1px solid rgba(34,197,94,.2); border-radius: 12px; padding: 14px 16px; margin-top: 10px; }
        .file-icon { font-size: 24px; }
        .file-name { font-size: 13px; font-weight: 600; color: #0f2027; flex: 1; word-break: break-all; }
        .file-remove { font-size: 12px; color: #ef4444; font-weight: 600; cursor: pointer; background: none; border: none; white-space: nowrap; }

        .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13px; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }

        .form-footer { display: flex; gap: 12px; margin-top: 8px; }
        .submit-btn { flex: 1; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: background .2s, transform .15s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .back-btn { padding: 15px 20px; background: #f8fafc; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #374151; cursor: pointer; transition: border-color .2s; }
        .back-btn:hover { border-color: #6366f1; color: #6366f1; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ap-root">
        <div className="ap-wrap">

          <div className="breadcrumb">
            <Link to="/">Home</Link> › <Link to="/jobs">Jobs</Link> › <Link to={`/jobs/${id}`}>{job.title}</Link> › <span>Apply</span>
          </div>

          {/* Job summary */}
          <div className="job-summary">
            <div className="js-orb o1" />
            <div className="js-logo">{job.company[0]}</div>
            <div className="js-info">
              <div className="js-title">{job.title}</div>
              <div className="js-meta">
                <span>{job.company}</span>
                <span>📍 {job.location}</span>
                <span>💰 {job.salary}</span>
              </div>
            </div>
            <div style={{ marginLeft: "auto", position: "relative", zIndex: 1 }}>
              <span className="js-badge">{job.type}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="steps-row">
            {[["1", "Your Info"], ["2", "Resume"], ["3", "Review"]].map(([num, label], i) => (
              <React.Fragment key={num}>
                <div className="step-item">
                  <div className={`step-circle ${step > i + 1 ? "done" : step === i + 1 ? "active" : "pending"}`}>
                    {step > i + 1 ? "✓" : num}
                  </div>
                  <span className={`step-label ${step === i + 1 ? "active" : ""}`}>{label}</span>
                </div>
                {i < 2 && <div className={`step-line ${step > i + 1 ? "done" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <div className="form-card">
            {error && (
              <div className="error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="fc-section-title">Personal Information</div>
                  <p className="fc-section-sub">Tell the employer about yourself</p>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label" htmlFor="name">Full Name <span>*</span></label>
                      <input id="name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="field-input" />
                    </div>
                    <div className="field-group">
                      <label className="field-label" htmlFor="email">Email <span>*</span></label>
                      <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="field-input" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="phone">Phone Number <span>*</span></label>
                    <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="field-input" />
                  </div>
                  <div className="form-footer">
                    <button type="button" className="back-btn" onClick={() => navigate(`/jobs/${id}`)}>← Back</button>
                    <button type="button" className="submit-btn" onClick={() => { if (!form.name || !form.email || !form.phone) { setError("Please fill all required fields."); return; } setError(""); setStep(2); }}>
                      Next: Resume →
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="fc-section-title">Resume & Cover Letter</div>
                  <p className="fc-section-sub">Upload your resume and write a short cover letter</p>
                  <div className="field-group">
                    <label className="field-label">Resume <span>*</span></label>
                    <div className={`drop-zone${dragOver ? " over" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("resume-input").click()}
                    >
                      <div className="drop-icon">📄</div>
                      <div className="drop-title">Drag & drop your resume here</div>
                      <p className="drop-sub">or <span className="drop-browse">browse files</span> — PDF, DOC, DOCX</p>
                    </div>
                    <input id="resume-input" type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} style={{ display: "none" }} />
                    {form.resume && (
                      <div className="file-preview">
                        <span className="file-icon">📎</span>
                        <span className="file-name">{form.resume.name}</span>
                        <button type="button" className="file-remove" onClick={() => setForm((f) => ({ ...f, resume: null }))}>Remove</button>
                      </div>
                    )}
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="coverLetter">Cover Letter <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
                    <textarea id="coverLetter" name="coverLetter" value={form.coverLetter} onChange={handleChange} placeholder="Briefly describe why you're a great fit for this role..." className="field-textarea" rows={5} />
                  </div>
                  <div className="form-footer">
                    <button type="button" className="back-btn" onClick={() => setStep(1)}>← Back</button>
                    <button type="button" className="submit-btn" onClick={() => { if (!form.resume) { setError("Please upload your resume."); return; } setError(""); setStep(3); }}>
                      Review Application →
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="fc-section-title">Review & Submit</div>
                  <p className="fc-section-sub">Confirm your details before submitting</p>
                  {[["Name", form.name], ["Email", form.email], ["Phone", form.phone], ["Resume", form.resume?.name], ["Cover Letter", form.coverLetter || "Not provided"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ fontSize: 13, color: "#94a3b8", width: 100, flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: 14, color: "#0f2027", fontWeight: 500, wordBreak: "break-all" }}>{v}</span>
                    </div>
                  ))}
                  <div className="form-footer" style={{ marginTop: 20 }}>
                    <button type="button" className="back-btn" onClick={() => setStep(2)}>← Edit</button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? <><div className="spinner" /> Submitting...</> : "Submit Application 🚀"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyJob;