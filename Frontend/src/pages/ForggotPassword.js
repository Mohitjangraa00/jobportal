import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1); // 1=email, 2=otp, 3=new password, 4=success
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ── OTP input refs ───────────────────────────────────────
  const otpRefs = Array(6).fill(null).map(() => React.createRef());

  // ── Step 1: Send reset email ─────────────────────────────
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true); setError("");
    try {
      const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res  = await fetch(`${BASE}/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email");
      setStep(2);
      startResendTimer();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    // Auto-focus next
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs[index - 1].current?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((ch, i) => { if (i < 6) newOtp[i] = ch; });
    setOtp(newOtp);
    if (pasted.length === 6) otpRefs[5].current?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    setLoading(true); setError("");
    try {
      const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res  = await fetch(`${BASE}/auth/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setStep(3);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setLoading(true); setError("");
    try {
      const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res  = await fetch(`${BASE}/auth/reset-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, otp: otp.join(""), newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP timer ─────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true); setError("");
    try {
      const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      await fetch(`${BASE}/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      setOtp(["", "", "", "", "", ""]);
      otpRefs[0].current?.focus();
      startResendTimer();
    } catch { setError("Failed to resend. Try again."); }
    finally { setLoading(false); }
  };

  // ── Password strength ────────────────────────────────────
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "#e5e7eb" };
    let s = 0;
    if (pwd.length >= 8)         s++;
    if (/[A-Z]/.test(pwd))       s++;
    if (/[0-9]/.test(pwd))       s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (s <= 1) return { level: 1, label: "Weak",   color: "#ef4444" };
    if (s === 2) return { level: 2, label: "Fair",   color: "#f59e0b" };
    if (s === 3) return { level: 3, label: "Good",   color: "#6366f1" };
    return       { level: 4, label: "Strong", color: "#22c55e" };
  };
  const strength = getStrength(passwords.newPassword);

  const stepLabels = ["Email", "Verify Code", "New Password"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-root { min-height: 100vh; background: #f0ede8; display: flex; align-items: center; justify-content: center; padding: 40px 24px; font-family: 'DM Sans', sans-serif; }

        .fp-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 24px; width: 100%; max-width: 460px; padding: 40px; }

        /* Back link */
        .fp-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #94a3b8; text-decoration: none; margin-bottom: 28px; transition: color .18s; }
        .fp-back:hover { color: #6366f1; }

        /* Progress steps */
        .steps-row { display: flex; align-items: center; margin-bottom: 32px; }
        .step-dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; transition: all .3s; }
        .step-dot.done   { background: #22c55e; color: #fff; }
        .step-dot.active { background: #0f2027; color: #fff; }
        .step-dot.pending{ background: #f1f5f9; color: #94a3b8; border: 1.5px solid #e5e7eb; }
        .step-dot-label  { font-size: 10px; font-weight: 600; color: #94a3b8; white-space: nowrap; font-family: 'Syne', sans-serif; letter-spacing: .5px; text-transform: uppercase; }
        .step-dot-label.active { color: #0f2027; }
        .step-line { flex: 1; height: 2px; background: #e5e7eb; margin: 0 6px; margin-bottom: 18px; transition: background .3s; }
        .step-line.done { background: #22c55e; }

        /* Logo */
        .fp-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0f2027; display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .fp-logo-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; }

        /* Headings */
        .fp-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0f2027; margin-bottom: 6px; }
        .fp-sub { font-size: 14px; color: #94a3b8; margin-bottom: 28px; line-height: 1.6; }
        .fp-email-highlight { color: #6366f1; font-weight: 600; }

        /* Error */
        .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 13px; padding: 12px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }

        /* Field */
        .field-group { margin-bottom: 18px; }
        .field-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 7px; }
        .field-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #0f2027; background: #fff; outline: none; transition: border-color .2s, box-shadow .2s; }
        .field-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .field-input::placeholder { color: #c4c9d4; }

        .pw-wrap { position: relative; }
        .pw-wrap .field-input { padding-right: 54px; }
        .show-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; font-family: 'DM Sans', sans-serif; }
        .show-btn:hover { color: #6366f1; }

        /* Strength bar */
        .strength-row { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .strength-bars { display: flex; gap: 4px; flex: 1; }
        .strength-bar { flex: 1; height: 3px; border-radius: 99px; background: #e5e7eb; transition: background .3s; }
        .strength-lbl { font-size: 11px; font-weight: 600; min-width: 44px; text-align: right; }

        /* Match hint */
        .match-hint { font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 5px; }

        /* OTP inputs */
        .otp-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; }
        .otp-input { width: 48px; height: 54px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0f2027; text-align: center; outline: none; background: #fff; transition: border-color .2s, box-shadow .2s; }
        .otp-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .otp-input.filled { border-color: #6366f1; background: rgba(99,102,241,.04); }
        @media (max-width: 400px) { .otp-input { width: 40px; height: 46px; font-size: 18px; } .otp-row { gap: 6px; } }

        /* Resend */
        .resend-row { text-align: center; margin-top: 4px; font-size: 13px; color: #94a3b8; }
        .resend-btn { background: none; border: none; color: #6366f1; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; }
        .resend-btn:disabled { color: #94a3b8; cursor: not-allowed; }

        /* Submit */
        .submit-btn { width: 100%; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background .2s, transform .15s; margin-top: 8px; }
        .submit-btn:hover:not(:disabled) { background: #1e3a4a; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .7; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success */
        .success-icon { font-size: 56px; margin-bottom: 16px; }
        .success-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #0f2027; margin-bottom: 8px; }
        .success-sub { font-size: 14px; color: #94a3b8; line-height: 1.7; margin-bottom: 28px; }
        .login-btn { display: block; width: 100%; padding: 15px; background: #0f2027; color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; text-align: center; text-decoration: none; transition: background .2s; }
        .login-btn:hover { background: #1e3a4a; }

        .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0; color: #d1d5db; font-size: 12px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
        .login-row { text-align: center; font-size: 14px; color: #64748b; }
        .login-link { color: #6366f1; font-weight: 600; text-decoration: none; }
        .login-link:hover { text-decoration: underline; }
      `}</style>

      <div className="fp-root">
        <div className="fp-card">

          <Link to="/login" className="fp-back">← Back to Login</Link>

          <div className="fp-logo"><span className="fp-logo-dot" />JobPortal</div>

          {/* Progress steps (only show for steps 1-3) */}
          {step <= 3 && (
            <div className="steps-row">
              {stepLabels.map((label, i) => {
                const num    = i + 1;
                const status = step > num ? "done" : step === num ? "active" : "pending";
                return (
                  <React.Fragment key={label}>
                    <div className="step-dot-wrap">
                      <div className={`step-dot ${status}`}>{status === "done" ? "✓" : num}</div>
                      <span className={`step-dot-label ${status === "active" ? "active" : ""}`}>{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`step-line ${step > num ? "done" : ""}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <>
              <h1 className="fp-title">Forgot password?</h1>
              <p className="fp-sub">Enter your registered email and we'll send you a 6-digit reset code.</p>

              {error && <div className="error-box">⚠️ {error}</div>}

              <form onSubmit={handleSendEmail}>
                <div className="field-group">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="field-input" autoFocus
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <><div className="spinner" /> Sending code...</> : "Send Reset Code →"}
                </button>
              </form>

              <div className="divider">or</div>
              <div className="login-row">Remember your password? <Link to="/login" className="login-link">Sign in</Link></div>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <>
              <h1 className="fp-title">Enter reset code</h1>
              <p className="fp-sub">We sent a 6-digit code to <span className="fp-email-highlight">{email}</span>. Check your inbox.</p>

              {error && <div className="error-box">⚠️ {error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="otp-row" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`otp-input${digit ? " filled" : ""}`}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button type="submit" className="submit-btn" disabled={loading || otp.join("").length < 6}>
                  {loading ? <><div className="spinner" /> Verifying...</> : "Verify Code →"}
                </button>
              </form>

              <div className="resend-row" style={{ marginTop: 16 }}>
                Didn't get it?{" "}
                <button className="resend-btn" onClick={handleResend} disabled={resendTimer > 0 || loading}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button
                  style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); }}
                >
                  ← Change email address
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <>
              <h1 className="fp-title">Set new password</h1>
              <p className="fp-sub">Choose a strong password for your account.</p>

              {error && <div className="error-box">⚠️ {error}</div>}

              <form onSubmit={handleResetPassword}>
                <div className="field-group">
                  <label className="field-label">New Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) => { setPasswords((p) => ({ ...p, newPassword: e.target.value })); setError(""); }}
                      placeholder="Min. 6 characters"
                      className="field-input" autoFocus
                    />
                    <button type="button" className="show-btn" onClick={() => setShowPw(!showPw)}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {passwords.newPassword && (
                    <div className="strength-row">
                      <div className="strength-bars">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="strength-bar" style={{ background: i <= strength.level ? strength.color : "#e5e7eb" }} />
                        ))}
                      </div>
                      <span className="strength-lbl" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label className="field-label">Confirm Password</label>
                  <div className="pw-wrap">
                    <input
                      type={showCPw ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) => { setPasswords((p) => ({ ...p, confirmPassword: e.target.value })); setError(""); }}
                      placeholder="Re-enter new password"
                      className={`field-input${passwords.confirmPassword && passwords.confirmPassword !== passwords.newPassword ? " has-error" : ""}`}
                    />
                    <button type="button" className="show-btn" onClick={() => setShowCPw(!showCPw)}>
                      {showCPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {passwords.confirmPassword && (
                    <div className="match-hint">
                      {passwords.confirmPassword === passwords.newPassword
                        ? <><span style={{ color:"#22c55e" }}>✓</span><span style={{ color:"#22c55e", fontSize:12 }}>Passwords match</span></>
                        : <><span style={{ color:"#ef4444" }}>✗</span><span style={{ color:"#ef4444", fontSize:12 }}>Passwords don't match</span></>}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <><div className="spinner" /> Resetting...</> : "Reset Password →"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div style={{ textAlign: "center" }}>
              <div className="success-icon">🎉</div>
              <h1 className="success-title">Password reset!</h1>
              <p className="success-sub">Your password has been reset successfully. You can now log in with your new password.</p>
              <Link to="/login" className="login-btn">Go to Login →</Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ForgotPassword;