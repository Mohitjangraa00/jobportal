import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      // Store token/user in localStorage so AuthContext can pick it up
      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.user) localStorage.setItem("user", JSON.stringify(res.user));

      // Role-based redirect — adjust field name to match your API response
      const role = res?.user?.role || res?.role;

      if (role === "employer") {
        navigate("/employer/dashboard");
      } else if (role === "candidate") {
        navigate("/candidate/dashboard");
      } else {
        // Fallback: go to home if role is unknown
        navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f0ede8;
          position: relative;
          overflow: hidden;
        }

        /* Left decorative panel */
        .login-panel {
          display: none;
          flex: 1;
          background: #0f2027;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) { .login-panel { display: flex; flex-direction: column; justify-content: center; padding: 60px; } }

        .panel-bg-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
        }
        .panel-bg-circle.c1 { width: 500px; height: 500px; background: #3b82f6; top: -100px; left: -100px; }
        .panel-bg-circle.c2 { width: 350px; height: 350px; background: #6366f1; bottom: -60px; right: -80px; }
        .panel-bg-circle.c3 { width: 180px; height: 180px; background: #22d3ee; top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.08; }

        .panel-tag {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 28px;
        }

        .panel-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3vw, 3rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .panel-headline span {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.35);
        }

        .panel-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 360px;
        }

        .panel-stats {
          display: flex;
          gap: 36px;
          margin-top: 52px;
        }

        .stat-item { }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }

        .panel-divider {
          width: 40px;
          height: 3px;
          background: #6366f1;
          margin: 36px 0;
          border-radius: 99px;
        }

        /* Right form side */
        .login-form-side {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        @media (min-width: 900px) { .login-form-side { flex: 0 0 480px; } }

        .login-card {
          width: 100%;
          max-width: 420px;
        }

        .card-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0f2027;
          margin-bottom: 44px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-logo-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; display: inline-block; }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #0f2027;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 36px;
        }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 13px;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #0f2027;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .field-input::placeholder { color: #c4c9d4; }

        .password-wrapper {
          position: relative;
        }
        .password-wrapper .field-input {
          padding-right: 52px;
        }
        .show-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.2s;
          padding: 4px;
        }
        .show-btn:hover { color: #6366f1; }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -12px;
          margin-bottom: 28px;
        }
        .forgot-link {
          font-size: 13px;
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #0f2027;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: background 0.2s, transform 0.15s;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          color: #d1d5db;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .register-row {
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
        .register-link {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
        }
        .register-link:hover { text-decoration: underline; }

        .social-hint {
          margin-top: 28px;
          background: #f8fafc;
          border: 1px dashed #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.6;
        }
      `}</style>

      <div className="login-root">

        {/* Left Panel */}
        <div className="login-panel">
          <div className="panel-bg-circle c1" />
          <div className="panel-bg-circle c2" />
          <div className="panel-bg-circle c3" />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="panel-tag">JobPortal — Career Platform</p>
            <h1 className="panel-headline">
              Your next big<br />opportunity <span>awaits</span><br />you here.
            </h1>
            <div className="panel-divider" />
            <p className="panel-sub">
              Thousands of companies are actively hiring. Whether you're a fresh graduate or a seasoned professional — your dream role is one application away.
            </p>
            <div className="panel-stats">
              <div className="stat-item">
                <div className="stat-num">12K+</div>
                <div className="stat-label">Live Jobs</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">3.4K</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="login-form-side">
          <div className="login-card">

            <div className="card-logo">
              <span className="card-logo-dot" />
              JobPortal
            </div>

            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">Sign in to continue your job search</p>

            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="field-input"
                  autoComplete="email"
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="field-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="show-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="forgot-row">
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><div className="spinner" /> Signing in...</>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="register-row">
              Don't have an account?{" "}
              <Link to="/register" className="register-link">Create one free</Link>
            </div>

            <div className="social-hint">
              🔒 Your data is encrypted and never shared with third parties.
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;