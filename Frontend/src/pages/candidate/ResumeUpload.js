import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const ResumeUpload = () => {
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploaded, setUploaded] = useState(null); // simulates already-uploaded resume

  const acceptedTypes = [".pdf", ".doc", ".docx"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateAndSet = (file) => {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!acceptedTypes.includes(ext)) { setMessage({ text: "Only PDF, DOC, or DOCX files are accepted.", type: "error" }); return; }
    if (file.size > maxSize) { setMessage({ text: "File size must be under 5MB.", type: "error" }); return; }
    setResume(file);
    setMessage({ text: "", type: "" });
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setMessage({ text: "Please select a resume to upload.", type: "error" }); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUploaded({ name: resume.name, size: (resume.size / 1024).toFixed(0) + " KB", date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) });
    setResume(null);
    setMessage({ text: "Resume uploaded successfully!", type: "success" });
    setLoading(false);
  };

  const handleRemoveUploaded = () => { setUploaded(null); setMessage({ text: "Resume removed.", type: "info" }); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ru-root { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 40px 24px 72px; }
        .ru-wrap { max-width: 640px; margin: 0 auto; }
        .ru-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 6px; }
        .ru-title { font-family: 'Syne', sans-serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .ru-sub { font-size: 14px; color: #94a3b8; margin-bottom: 28px; }

        .card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 20px; overflow: hidden; margin-bottom: 20px; }
        .card-body { padding: 28px; }
        .card-section-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; margin-bottom: 16px; }

        /* Current resume card */
        .cur-resume { display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 16px 18px; }
        .cur-icon { font-size: 28px; }
        .cur-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f2027; }
        .cur-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .cur-actions { margin-left: auto; display: flex; gap: 8px; }
        .cur-btn { padding: 7px 14px; border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; border: none; }
        .cur-btn.view { background: rgba(99,102,241,.08); color: #6366f1; }
        .cur-btn.remove { background: #fef2f2; color: #ef4444; }

        .no-resume { text-align: center; padding: 28px 16px; color: #94a3b8; font-size: 14px; }
        .no-resume-icon { font-size: 36px; margin-bottom: 8px; }

        /* Drop zone */
        .drop-zone { border: 2px dashed #d1d5db; border-radius: 16px; padding: 40px 24px; text-align: center; cursor: pointer; transition: all .2s; background: #fafafa; }
        .drop-zone:hover, .drop-zone.over { border-color: #6366f1; background: rgba(99,102,241,.04); }
        .dz-icon { font-size: 40px; margin-bottom: 14px; }
        .dz-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #0f2027; margin-bottom: 6px; }
        .dz-sub { font-size: 13px; color: #94a3b8; }
        .dz-browse { color: #6366f1; font-weight: 600; text-decoration: underline; cursor: pointer; }
        .dz-types { margin-top: 14px; display: flex; justify-content: center; gap: 8px; }
        .dz-type-chip { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px; background: #f1f5f9; border: 1px solid #e5e7eb; color: #64748b; font-family: 'Syne', sans-serif; }

        /* Selected file */
        .selected-file { display: flex; align-items: center; gap: 12px; background: rgba(99,102,241,.06); border: 1.5px solid rgba(99,102,241,.2); border-radius: 12px; padding: 14px 16px; margin-top: 14px; }
        .sf-icon { font-size: 24px; }
        .sf-name { font-size: 13px; font-weight: 600; color: #0f2027; flex: 1; word-break: break-all; }
        .sf-size { font-size: 11px; color: #94a3b8; }
        .sf-remove { font-size: 12px; color: #ef4444; font-weight: 700; background: none; border: none; cursor: pointer; white-space: nowrap; }

        /* Messages */
        .msg { padding: 12px 16px; border-radius: 10px; font-size: 13px; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .msg.success { background: rgba(34,197,94,.07); border: 1px solid rgba(34,197,94,.25); color: #16a34a; }
        .msg.error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
        .msg.info { background: #f8fafc; border: 1px solid #e5e7eb; color: #64748b; }

        .submit-btn { width: 100%; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background .2s, transform .15s; margin-top: 8px; }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .tips-grid { grid-template-columns: 1fr; } }
        .tip-item { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px 16px; font-size: 13px; color: #475569; line-height: 1.5; }
        .tip-icon { font-size: 18px; margin-bottom: 6px; }
        .tip-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #0f2027; margin-bottom: 4px; }

        .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #94a3b8; text-decoration: none; margin-top: 16px; }
        .back-link:hover { color: #6366f1; }
      `}</style>

      <div className="ru-root">
        <div className="ru-wrap">
          <p className="ru-tag">My Documents</p>
          <h1 className="ru-title">Resume Upload</h1>
          <p className="ru-sub">Upload your latest resume to apply to jobs faster</p>

          {message.text && (
            <div className={`msg ${message.type}`}>
              {message.type === "success" ? "✓" : message.type === "error" ? "⚠️" : "ℹ️"} {message.text}
            </div>
          )}

          {/* Current Resume */}
          <div className="card">
            <div className="card-body">
              <div className="card-section-title">Current Resume</div>
              {uploaded ? (
                <div className="cur-resume">
                  <span className="cur-icon">📄</span>
                  <div>
                    <div className="cur-name">{uploaded.name}</div>
                    <div className="cur-meta">{uploaded.size} · Uploaded {uploaded.date}</div>
                  </div>
                  <div className="cur-actions">
                    <button className="cur-btn view">Preview</button>
                    <button className="cur-btn remove" onClick={handleRemoveUploaded}>Remove</button>
                  </div>
                </div>
              ) : (
                <div className="no-resume">
                  <div className="no-resume-icon">📭</div>
                  No resume uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Upload form */}
          <div className="card">
            <div className="card-body">
              <div className="card-section-title">{uploaded ? "Replace Resume" : "Upload Resume"}</div>
              <form onSubmit={handleSubmit}>
                <div className={`drop-zone${dragOver ? " over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="dz-icon">☁️</div>
                  <div className="dz-title">Drag & drop your resume</div>
                  <p className="dz-sub">or <span className="dz-browse">click to browse</span> from your device</p>
                  <div className="dz-types">
                    {["PDF", "DOC", "DOCX"].map((t) => <span key={t} className="dz-type-chip">{t}</span>)}
                    <span className="dz-type-chip">Max 5MB</span>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => validateAndSet(e.target.files[0])} style={{ display: "none" }} />

                {resume && (
                  <div className="selected-file">
                    <span className="sf-icon">📎</span>
                    <div>
                      <div className="sf-name">{resume.name}</div>
                      <div className="sf-size">{(resume.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button type="button" className="sf-remove" onClick={() => { setResume(null); }}>Remove</button>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading || !resume}>
                  {loading ? <><div className="spinner" /> Uploading...</> : "Upload Resume →"}
                </button>
              </form>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <div className="card-body">
              <div className="card-section-title">Resume Tips</div>
              <div className="tips-grid">
                {[
                  ["📏", "Keep it concise", "1–2 pages max. Recruiters spend ~6 seconds on a resume."],
                  ["🔑", "Use keywords", "Match job description terms to pass ATS filters."],
                  ["📊", "Show impact", "Use numbers: 'Increased sales by 40%' beats 'Improved sales'."],
                  ["🎨", "Stay clean", "Use a simple, readable format — avoid heavy graphics."],
                ].map(([icon, title, desc]) => (
                  <div className="tip-item" key={title}>
                    <div className="tip-icon">{icon}</div>
                    <div className="tip-title">{title}</div>
                    {desc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link to="/candidate/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
};

export default ResumeUpload;