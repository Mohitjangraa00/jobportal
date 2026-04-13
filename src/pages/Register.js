import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // ✅ FIXED: backend enum is "user" not "candidate"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "#e5e7eb" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
    if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
    if (score === 3) return { level: 3, label: "Good", color: "#6366f1" };
    return { level: 4, label: "Strong", color: "#22c55e" };
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Send role as "user" or "recruiter" — matches backend enum exactly
      const { confirmPassword, ...submitData } = form;
      await registerUser(submitData);

      // ✅ Redirect based on role after register
      if (form.role === "recruiter") {
        navigate("/employer/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; background: #f0ede8; overflow: hidden; }

        .reg-panel { display: none; flex: 1; background: #0f2027; position: relative; overflow: hidden; flex-direction: column; justify-content: center; padding: 60px; }
        @media (min-width: 900px) { .reg-panel { display: flex; } }

        .bp { position: absolute; border-radius: 50%; }
        .bp.b1 { width: 480px; height: 480px; background: #6366f1; opacity: .1; top: -120px; right: -100px; }
        .bp.b2 { width: 300px; height: 300px; background: #22d3ee; opacity: .08; bottom: -60px; left: -60px; }
        .bp.b3 { width: 160px; height: 160px; background: #a78bfa; opacity: .1; top: 55%; left: 40%; }

        .panel-tag { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #6366f1; margin-bottom: 28px; }
        .panel-headline { font-family: 'Syne', sans-serif; font-size: clamp(1.9rem, 2.8vw, 2.9rem); font-weight: 800; color: #fff; line-height: 1.15; margin-bottom: 18px; }
        .panel-headline span { color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,.32); }
        .panel-divider { width: 40px; height: 3px; background: #6366f1; margin: 28px 0; border-radius: 99px; }
        .panel-sub { font-size: 15px; color: rgba(255,255,255,.48); line-height: 1.75; max-width: 340px; }

        .steps { margin-top: 48px; display: flex; flex-direction: column; gap: 20px; }
        .step { display: flex; align-items: flex-start; gap: 16px; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; background: rgba(99,102,241,.2); border: 1px solid rgba(99,102,241,.4); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #a5b4fc; flex-shrink: 0; }
        .step-text { font-size: 14px; color: rgba(255,255,255,.55); padding-top: 6px; line-height: 1.5; }
        .step-text strong { color: rgba(255,255,255,.85); font-weight: 500; }

        .reg-form-side { flex: 0 0 100%; display: flex; align-items: center; justify-content: center; padding: 40px 24px; overflow-y: auto; }
        @media (min-width: 900px) { .reg-form-side { flex: 0 0 520px; } }

        .reg-card { width: 100%; max-width: 440px; }

        .card-logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0f2027; margin-bottom: 36px; display: flex; align-items: center; gap: 8px; }
        .card-logo-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; }

        .card-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .card-subtitle { font-size: 14px; color: #94a3b8; margin-bottom: 28px; }

        /* ✅ Role toggle — shows "Job Seeker" and "Recruiter" to match backend */
        .role-toggle { display: flex; gap: 0; margin-bottom: 28px; background: #f1f5f9; border-radius: 12px; padding: 4px; }
        .role-btn { flex: 1; padding: 10px; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: #94a3b8; }
        .role-btn.active { background: #0f2027; color: #fff; box-shadow: 0 2px 8px rgba(15,32,39,.2); }

        .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13px; padding: 12px 16px; border-radius: 10px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 7px; }
        .field-label span { color: #ef4444; }

        .field-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
        .field-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .field-input::placeholder { color: #c4c9d4; }
        .field-input.has-error { border-color: #fca5a5; }

        .pw-wrap { position: relative; }
        .pw-wrap .field-input { padding-right: 58px; }
        .show-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 11px; font-weight: 700; font-family: 'DM Sans', sans-serif; letter-spacing: .5px; text-transform: uppercase; transition: color 0.2s; padding: 4px; }
        .show-btn:hover { color: #6366f1; }

        .strength-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .strength-bars { display: flex; gap: 4px; flex: 1; }
        .strength-bar { flex: 1; height: 3px; border-radius: 99px; background: #e5e7eb; transition: background 0.3s; }
        .strength-label { font-size: 11px; font-weight: 600; min-width: 44px; text-align: right; }

        .match-hint { font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 5px; }

        .submit-btn { width: 100%; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: .5px; margin-top: 8px; transition: background 0.2s, transform 0.15s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }

        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; color: #d1d5db; font-size: 12px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }

        .login-row { text-align: center; font-size: 14px; color: #64748b; }
        .login-link { color: #6366f1; font-weight: 600; text-decoration: none; }
        .login-link:hover { text-decoration: underline; }

        .terms-note { margin-top: 20px; font-size: 11.5px; color: #94a3b8; text-align: center; line-height: 1.6; }
        .terms-note a { color: #6366f1; text-decoration: none; }

        /* Role info badge */
        .role-info { margin-bottom: 20px; padding: 10px 14px; border-radius: 10px; font-size: 12px; line-height: 1.5; }
        .role-info.user { background: rgba(99,102,241,.06); border: 1px solid rgba(99,102,241,.15); color: #6366f1; }
        .role-info.recruiter { background: rgba(15,32,39,.05); border: 1px solid rgba(15,32,39,.12); color: #374151; }
      `}</style>

      <div className="reg-root">

        {/* Left Panel */}
        <div className="reg-panel">
          <div className="bp b1" /><div className="bp b2" /><div className="bp b3" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="panel-tag">JobPortal — Career Platform</p>
            <h1 className="panel-headline">
              Start your journey<br />to <span>something</span><br />greater today.
            </h1>
            <div className="panel-divider" />
            <p className="panel-sub">Join thousands of professionals and top companies already using JobPortal to connect, hire, and grow.</p>
            <div className="steps">
              {[
                ["01", <><strong>Create your profile</strong> — Tell us who you are and what you're looking for.</>],
                ["02", <><strong>Browse or post jobs</strong> — Explore curated listings or attract top talent.</>],
                ["03", <><strong>Apply or hire</strong> — One click to apply; smart tools to shortlist candidates.</>],
              ].map(([num, text]) => (
                <div className="step" key={num}>
                  <div className="step-num">{num}</div>
                  <div className="step-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="reg-form-side">
          <div className="reg-card">

            <div className="card-logo"><span className="card-logo-dot" />JobPortal</div>
            <h2 className="card-title">Create your account</h2>
            <p className="card-subtitle">Free forever. No credit card required.</p>

            {/* ✅ Role toggle — "user" = Job Seeker, "recruiter" = Employer */}
            <div className="role-toggle">
              <button
                type="button"
                className={`role-btn ${form.role === "user" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "user" })}
              >
                🙋 Job Seeker
              </button>
              <button
                type="button"
                className={`role-btn ${form.role === "recruiter" ? "active" : ""}`}
                onClick={() => setForm({ ...form, role: "recruiter" })}
              >
                🏢 Recruiter
              </button>
            </div>

            {/* Role info hint */}
            <div className={`role-info ${form.role}`}>
              {form.role === "user"
                ? "🙋 As a Job Seeker you can browse jobs, apply, and track your applications."
                : "🏢 As a Recruiter you can post jobs, manage listings, and review applicants."}
            </div>

            {error && (
              <div className="error-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label" htmlFor="name">Full Name <span>*</span></label>
                <input id="name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="field-input" autoComplete="name" />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="email">Email Address <span>*</span></label>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="field-input" autoComplete="email" />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="password">Password <span>*</span></label>
                <div className="pw-wrap">
                  <input id="password" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="field-input" autoComplete="new-password" />
                  <button type="button" className="show-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
                </div>
                {form.password && (
                  <div className="strength-row">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="strength-bar" style={{ background: i <= strength.level ? strength.color : "#e5e7eb" }} />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="confirmPassword">Confirm Password <span>*</span></label>
                <div className="pw-wrap">
                  <input id="confirmPassword" type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className={`field-input ${form.confirmPassword && form.confirmPassword !== form.password ? "has-error" : ""}`} autoComplete="new-password" />
                  <button type="button" className="show-btn" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? "Hide" : "Show"}</button>
                </div>
                {form.confirmPassword && (
                  <div className="match-hint">
                    {form.confirmPassword === form.password
                      ? <><span style={{ color: "#22c55e" }}>✓</span><span style={{ color: "#22c55e", fontSize: 12 }}>Passwords match</span></>
                      : <><span style={{ color: "#ef4444" }}>✗</span><span style={{ color: "#ef4444", fontSize: 12 }}>Passwords don't match</span></>}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Creating account...</>
                  : `Create ${form.role === "recruiter" ? "Recruiter" : "Job Seeker"} Account →`}
              </button>
            </form>

            <div className="divider">or</div>
            <div className="login-row">Already have an account? <Link to="/login" className="login-link">Sign in</Link></div>
            <p className="terms-note">By registering, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;