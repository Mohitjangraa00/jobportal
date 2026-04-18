import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm]             = useState({ email: "", password: "" });
  const [showPassword, setShowPw]   = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      // authService saves token + user to localStorage already
      // ✅ FIXED: backend roles are "user" and "recruiter" — NOT "candidate"/"employer"
      const role = res?.user?.role;
      if (role === "recruiter") {
        navigate("/employer/dashboard", { replace: true });
      } else {
        navigate("/candidate/dashboard", { replace: true });
      }
    } catch (err) {
      // ✅ FIXED: err.message works for both fetch and axios errors
      setError(err?.message || "Invalid email or password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lr { min-height:100vh; display:flex; font-family:'DM Sans',sans-serif; background:#f0ede8; overflow:hidden; }
        .lp { display:none; flex:1; background:#0f2027; position:relative; overflow:hidden; }
        @media(min-width:900px){.lp{display:flex;flex-direction:column;justify-content:center;padding:60px;}}
        .pc{position:absolute;border-radius:50%;opacity:.12;}
        .pc.c1{width:500px;height:500px;background:#3b82f6;top:-100px;left:-100px;}
        .pc.c2{width:350px;height:350px;background:#6366f1;bottom:-60px;right:-80px;}
        .pc.c3{width:180px;height:180px;background:#22d3ee;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.08;}
        .pt{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6366f1;margin-bottom:28px;}
        .ph{font-family:'Syne',sans-serif;font-size:clamp(2rem,3vw,3rem);font-weight:800;color:#fff;line-height:1.15;margin-bottom:20px;}
        .ph span{color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.35);}
        .ps{font-size:15px;color:rgba(255,255,255,.5);line-height:1.7;max-width:360px;}
        .pst{display:flex;gap:36px;margin-top:52px;}
        .sn{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;}
        .sl{font-size:12px;color:rgba(255,255,255,.4);margin-top:2px;}
        .pd{width:40px;height:3px;background:#6366f1;margin:36px 0;border-radius:99px;}
        .lfs{flex:0 0 100%;display:flex;align-items:center;justify-content:center;padding:40px 24px;}
        @media(min-width:900px){.lfs{flex:0 0 480px;}}
        .lc{width:100%;max-width:420px;}
        .logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0f2027;margin-bottom:44px;display:flex;align-items:center;gap:8px;}
        .logo-dot{width:8px;height:8px;background:#6366f1;border-radius:50%;}
        .lt{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#0f2027;margin-bottom:8px;}
        .ls{font-size:14px;color:#94a3b8;margin-bottom:36px;}
        .eb{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:13px;padding:12px 16px;border-radius:10px;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
        .fg{margin-bottom:20px;}
        .fl{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:8px;}
        .fi{width:100%;padding:14px 16px;border:1.5px solid #e5e7eb;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#0f2027;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);}
        .fi::placeholder{color:#c4c9d4;}
        .pw{position:relative;}
        .pw .fi{padding-right:52px;}
        .sb{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;letter-spacing:.5px;text-transform:uppercase;transition:color .2s;padding:4px;}
        .sb:hover{color:#6366f1;}
        .fr{display:flex;justify-content:flex-end;margin-top:-12px;margin-bottom:28px;}
        .frl{font-size:13px;color:#6366f1;text-decoration:none;font-weight:500;}
        .frl:hover{text-decoration:underline;}
        .sub{width:100%;padding:15px;background:#0f2027;color:#fff;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:background .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:10px;}
        .sub:hover:not(:disabled){background:#1e3a4a;transform:translateY(-1px);}
        .sub:disabled{opacity:.7;cursor:not-allowed;}
        .sp{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .div{display:flex;align-items:center;gap:12px;margin:28px 0;color:#d1d5db;font-size:12px;}
        .div::before,.div::after{content:'';flex:1;height:1px;background:#e5e7eb;}
        .rr{text-align:center;font-size:14px;color:#64748b;}
        .rl{color:#6366f1;font-weight:600;text-decoration:none;}
        .rl:hover{text-decoration:underline;}
        .sh{margin-top:28px;background:#f8fafc;border:1px dashed #e2e8f0;border-radius:12px;padding:16px;text-align:center;font-size:12px;color:#94a3b8;line-height:1.6;}
      `}</style>

      <div className="lr">
        {/* Left Panel */}
        <div className="lp">
          <div className="pc c1" /><div className="pc c2" /><div className="pc c3" />
          <div style={{ position:"relative", zIndex:1 }}>
            <p className="pt">JobPortal — Career Platform</p>
            <h1 className="ph">Your next big<br />opportunity <span>awaits</span><br />you here.</h1>
            <div className="pd" />
            <p className="ps">Thousands of companies are actively hiring. Your dream role is one application away.</p>
            <div className="pst">
              <div><div className="sn">12K+</div><div className="sl">Live Jobs</div></div>
              <div><div className="sn">3.4K</div><div className="sl">Companies</div></div>
              <div><div className="sn">98%</div><div className="sl">Satisfaction</div></div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lfs">
          <div className="lc">
            <div className="logo"><span className="logo-dot" />JobPortal</div>
            <h2 className="lt">Welcome back</h2>
            <p className="ls">Sign in to continue your job search</p>

            {error && (
              <div className="eb">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="fg">
                <label className="fl" htmlFor="email">Email address</label>
                <input id="email" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  className="fi" autoComplete="email" />
              </div>

              <div className="fg">
                <label className="fl" htmlFor="password">Password</label>
                <div className="pw">
                  <input id="password" type={showPassword ? "text" : "password"}
                    name="password" value={form.password} onChange={handleChange}
                    placeholder="Enter your password" className="fi" autoComplete="current-password" />
                  <button type="button" className="sb" onClick={() => setShowPw(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="fr">
                <Link to="/forgot-password" className="frl">Forgot password?</Link>
              </div>

              <button type="submit" className="sub" disabled={loading}>
                {loading ? <><div className="sp" /> Signing in...</> : "Sign In →"}
              </button>
            </form>

            <div className="div">or</div>
            <div className="rr">Don't have an account? <Link to="/register" className="rl">Create one free</Link></div>
            <div className="sh">🔒 Your data is encrypted and never shared with third parties.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;