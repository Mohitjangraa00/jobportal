import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// ✅ FIX: Import from api.js — uses REACT_APP_BACKEND_URL, not localhost
import { sendRegisterOtp, verifyRegisterOtp, registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirmPassword:"", role:"user" });
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setRT]  = useState(0);

  // OTP refs — must be at top level
  const r0=useRef(null),r1=useRef(null),r2=useRef(null),r3=useRef(null),r4=useRef(null),r5=useRef(null);
  const otpRefs = [r0,r1,r2,r3,r4,r5];

  const getStrength = (pwd) => {
    if (!pwd) return { level:0, label:"", color:"#e5e7eb" };
    let s=0;
    if (pwd.length>=8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (s<=1) return {level:1,label:"Weak",color:"#ef4444"};
    if (s===2) return {level:2,label:"Fair",color:"#f59e0b"};
    if (s===3) return {level:3,label:"Good",color:"#6366f1"};
    return {level:4,label:"Strong",color:"#22c55e"};
  };
  const strength = getStrength(form.password);

  const handleChange = (e) => { setForm({...form,[e.target.name]:e.target.value}); if(error) setError(""); };

  const startTimer = () => {
    setRT(60);
    const iv = setInterval(()=>setRT(t=>{if(t<=1){clearInterval(iv);return 0;}return t-1;}),1000);
  };

  // ── Step 1: Validate → send OTP via api.js ───────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.password||!form.confirmPassword) { setError("Please fill in all fields."); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError("Please enter a valid email address."); return; }
    if (form.password.length<6) { setError("Password must be at least 6 characters."); return; }
    if (form.password!==form.confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true); setError("");
    try {
      // ✅ Uses api.js → calls REACT_APP_BACKEND_URL/api/auth/send-register-otp
      await sendRegisterOtp(form.email, form.name);
      setStep(2);
      startTimer();
    } catch(err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally { setLoading(false); }
  };

  // OTP input handlers
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next=[...otp]; next[i]=val.slice(-1); setOtp(next); setError("");
    if (val && i<5) otpRefs[i+1].current?.focus();
  };
  const handleOtpKey = (i, e) => { if(e.key==="Backspace"&&!otp[i]&&i>0) otpRefs[i-1].current?.focus(); };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const next=[...otp];
    pasted.split("").forEach((ch,i)=>{ if(i<6) next[i]=ch; });
    setOtp(next);
    if (pasted.length>0) otpRefs[Math.min(pasted.length-1,5)].current?.focus();
  };

  // ── Step 2: Verify OTP → create account ──────────────────────
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length<6) { setError("Please enter the complete 6-digit code."); return; }

    setLoading(true); setError("");
    try {
      // ✅ Step A: verify OTP
      await verifyRegisterOtp(form.email, otpStr);

      // ✅ Step B: create account
      const { confirmPassword, ...submitData } = form;
      const res = await registerUser(submitData);
      // registerUser already saves token + user to localStorage

      setStep(3);
      setTimeout(()=>navigate(
        form.role==="recruiter" ? "/employer/dashboard" : "/candidate/dashboard",
        { replace: true }
      ), 2000);
    } catch(err) {
      setError(err.message || "Verification failed. Please try again.");
      setOtp(["","","","","",""]);
      otpRefs[0].current?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer>0) return;
    setLoading(true); setError("");
    try {
      await sendRegisterOtp(form.email, form.name);
      setOtp(["","","","","",""]);
      otpRefs[0].current?.focus();
      startTimer();
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const checks = form.password ? [
    [form.password.length>=6,           "At least 6 characters"],
    [/[A-Z]/.test(form.password),       "One uppercase letter"],
    [/[0-9]/.test(form.password),       "One number"],
    [/[^A-Za-z0-9]/.test(form.password),"One special character"],
  ] : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .rg{min-height:100vh;display:flex;font-family:'DM Sans',sans-serif;background:#f0ede8;overflow:hidden;}
        .rgp{display:none;flex:1;background:#0f2027;position:relative;overflow:hidden;flex-direction:column;justify-content:center;padding:60px;}
        @media(min-width:900px){.rgp{display:flex;}}
        .bp{position:absolute;border-radius:50%;}
        .bp.b1{width:480px;height:480px;background:#6366f1;opacity:.1;top:-120px;right:-100px;}
        .bp.b2{width:300px;height:300px;background:#22d3ee;opacity:.08;bottom:-60px;left:-60px;}
        .bp.b3{width:160px;height:160px;background:#a78bfa;opacity:.1;top:55%;left:40%;}
        .ptag{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6366f1;margin-bottom:28px;}
        .phed{font-family:'Syne',sans-serif;font-size:clamp(1.9rem,2.8vw,2.9rem);font-weight:800;color:#fff;line-height:1.15;margin-bottom:18px;}
        .phed span{color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.32);}
        .pdiv{width:40px;height:3px;background:#6366f1;margin:28px 0;border-radius:99px;}
        .psub{font-size:15px;color:rgba(255,255,255,.48);line-height:1.75;max-width:340px;}
        .pst{margin-top:48px;display:flex;flex-direction:column;gap:20px;}
        .psti{display:flex;align-items:flex-start;gap:16px;}
        .pstn{width:32px;height:32px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#a5b4fc;flex-shrink:0;}
        .pstt{font-size:14px;color:rgba(255,255,255,.55);padding-top:6px;line-height:1.5;}
        .pstt strong{color:rgba(255,255,255,.85);font-weight:500;}
        .rgs{flex:0 0 100%;display:flex;align-items:center;justify-content:center;padding:40px 24px;overflow-y:auto;}
        @media(min-width:900px){.rgs{flex:0 0 520px;}}
        .rgc{width:100%;max-width:440px;}
        .logo{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0f2027;margin-bottom:28px;display:flex;align-items:center;gap:8px;}
        .lgd{width:8px;height:8px;background:#6366f1;border-radius:50%;}
        /* progress */
        .pr{display:flex;align-items:center;margin-bottom:24px;}
        .prd{display:flex;flex-direction:column;align-items:center;gap:5px;}
        .prdt{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;transition:all .3s;}
        .prdt.done{background:#22c55e;color:#fff;}
        .prdt.active{background:#0f2027;color:#fff;}
        .prdt.pend{background:#f1f5f9;color:#94a3b8;border:1.5px solid #e5e7eb;}
        .prl{font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;white-space:nowrap;font-family:'Syne',sans-serif;}
        .prl.active{color:#0f2027;}
        .prln{flex:1;height:2px;background:#e5e7eb;margin:0 6px 14px;transition:background .3s;}
        .prln.done{background:#22c55e;}
        .ct{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#0f2027;margin-bottom:6px;}
        .cs{font-size:14px;color:#94a3b8;margin-bottom:20px;}
        /* role */
        .rtog{display:flex;margin-bottom:16px;background:#f1f5f9;border-radius:12px;padding:4px;}
        .rbtn{flex:1;padding:10px;border:none;border-radius:10px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:#94a3b8;}
        .rbtn.on{background:#0f2027;color:#fff;box-shadow:0 2px 8px rgba(15,32,39,.2);}
        .rinfo{margin-bottom:16px;padding:10px 14px;border-radius:10px;font-size:12px;line-height:1.5;}
        .rinfo.user{background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);color:#6366f1;}
        .rinfo.recruiter{background:rgba(15,32,39,.05);border:1px solid rgba(15,32,39,.12);color:#374151;}
        .ebox{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:13px;padding:12px 16px;border-radius:10px;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
        .fg{margin-bottom:14px;}
        .fl{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px;}
        .fl span{color:#ef4444;}
        .fi{width:100%;padding:13px 16px;border:1.5px solid #e5e7eb;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#0f2027;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;}
        .fi:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);}
        .fi::placeholder{color:#c4c9d4;}
        .fi.err{border-color:#fca5a5;}
        .pw{position:relative;}.pw .fi{padding-right:58px;}
        .shb{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;letter-spacing:.5px;text-transform:uppercase;}
        .shb:hover{color:#6366f1;}
        .sr{display:flex;align-items:center;gap:8px;margin-top:8px;}
        .sb2{display:flex;gap:4px;flex:1;}
        .sbar{flex:1;height:3px;border-radius:99px;background:#e5e7eb;transition:background .3s;}
        .slbl{font-size:11px;font-weight:600;min-width:44px;text-align:right;}
        .mh{font-size:12px;margin-top:6px;display:flex;align-items:center;gap:5px;}
        .cklist{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;background:#f8fafc;border:1px solid #f1f5f9;border-radius:10px;padding:12px 14px;}
        .ck{display:flex;align-items:center;gap:8px;font-size:12px;color:#94a3b8;}
        .ck.ok{color:#22c55e;}
        .ckd{width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;background:#e5e7eb;color:#94a3b8;}
        .ck.ok .ckd{background:rgba(34,197,94,.2);color:#22c55e;}
        .orow{display:flex;gap:10px;justify-content:center;margin:4px 0 16px;}
        .obox{width:48px;height:54px;border:1.5px solid #e5e7eb;border-radius:12px;font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0f2027;text-align:center;outline:none;background:#fff;transition:border-color .2s,box-shadow .2s;}
        .obox:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);}
        .obox.f{border-color:#6366f1;background:rgba(99,102,241,.04);}
        @media(max-width:400px){.obox{width:40px;height:46px;font-size:18px;}.orow{gap:6px;}}
        .rsrow{text-align:center;margin-top:8px;font-size:13px;color:#94a3b8;}
        .rsbtn{background:none;border:none;color:#6366f1;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;}
        .rsbtn:disabled{color:#94a3b8;cursor:not-allowed;}
        .emhl{color:#6366f1;font-weight:600;word-break:break-all;}
        .subbtn{width:100%;padding:15px;background:#0f2027;color:#fff;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;margin-top:6px;transition:background .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:10px;}
        .subbtn:hover:not(:disabled){background:#1e3a4a;transform:translateY(-1px);}
        .subbtn:disabled{opacity:.7;cursor:not-allowed;}
        .spin{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite;}
        @keyframes sp{to{transform:rotate(360deg);}}
        .divr{display:flex;align-items:center;gap:12px;margin:18px 0;color:#d1d5db;font-size:12px;}
        .divr::before,.divr::after{content:'';flex:1;height:1px;background:#e5e7eb;}
        .sinr{text-align:center;font-size:14px;color:#64748b;}
        .sinl{color:#6366f1;font-weight:600;text-decoration:none;}
        .sinl:hover{text-decoration:underline;}
        .trm{margin-top:14px;font-size:11.5px;color:#94a3b8;text-align:center;line-height:1.6;}
        .trm a{color:#6366f1;text-decoration:none;}
        .sucw{text-align:center;padding:24px 0;}
        .suci{font-size:60px;margin-bottom:16px;}
        .suct{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#0f2027;margin-bottom:8px;}
        .subs{font-size:14px;color:#94a3b8;line-height:1.7;margin-bottom:8px;}
        .rdn{font-size:12px;color:#6366f1;margin-top:10px;}
      `}</style>

      <div className="rg">
        {/* Left panel */}
        <div className="rgp">
          <div className="bp b1"/><div className="bp b2"/><div className="bp b3"/>
          <div style={{position:"relative",zIndex:1}}>
            <p className="ptag">JobPortal — Career Platform</p>
            <h1 className="phed">Start your journey<br/>to <span>something</span><br/>greater today.</h1>
            <div className="pdiv"/>
            <p className="psub">Join thousands of professionals and top companies already using JobPortal to connect, hire, and grow.</p>
            <div className="pst">
              {[["01","Create & verify your account — Secure signup with email verification."],["02","Browse or post jobs — Explore curated listings or attract top talent."],["03","Apply or hire — One click to apply; smart tools to shortlist candidates."]].map(([n,t])=>(
                <div className="psti" key={n}><div className="pstn">{n}</div><div className="pstt">{t}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="rgs">
          <div className="rgc">
            <div className="logo"><span className="lgd"/>JobPortal</div>

            {/* Progress */}
            {step<3&&(
              <div className="pr">
                {[["1","Details"],["2","Verify Email"],["3","Done"]].map(([num,lbl],i)=>{
                  const n=i+1,st=step>n?"done":step===n?"active":"pend";
                  return(
                    <React.Fragment key={num}>
                      <div className="prd">
                        <div className={`prdt ${st}`}>{st==="done"?"✓":num}</div>
                        <span className={`prl${step===n?" active":""}`}>{lbl}</span>
                      </div>
                      {i<2&&<div className={`prln${step>n?" done":""}`}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step===1&&(
              <>
                <h2 className="ct">Create your account</h2>
                <p className="cs">Free forever. No credit card required.</p>
                <div className="rtog">
                  <button type="button" className={`rbtn${form.role==="user"?" on":""}`} onClick={()=>setForm({...form,role:"user"})}>🙋 Job Seeker</button>
                  <button type="button" className={`rbtn${form.role==="recruiter"?" on":""}`} onClick={()=>setForm({...form,role:"recruiter"})}>🏢 Recruiter</button>
                </div>
                <div className={`rinfo ${form.role}`}>
                  {form.role==="user"?"🙋 Browse jobs, apply, and track your applications.":"🏢 Post jobs, manage listings, and review applicants."}
                </div>
                {error&&<div className="ebox">⚠️ {error}</div>}
                <form onSubmit={handleFormSubmit}>
                  <div className="fg"><label className="fl">Full Name <span>*</span></label><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="fi" autoComplete="name"/></div>
                  <div className="fg"><label className="fl">Email Address <span>*</span></label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="fi" autoComplete="email"/></div>
                  <div className="fg">
                    <label className="fl">Password <span>*</span></label>
                    <div className="pw"><input type={showPw?"text":"password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="fi" autoComplete="new-password"/><button type="button" className="shb" onClick={()=>setShowPw(!showPw)}>{showPw?"Hide":"Show"}</button></div>
                    {form.password&&(<div className="sr"><div className="sb2">{[1,2,3,4].map(i=><div key={i} className="sbar" style={{background:i<=strength.level?strength.color:"#e5e7eb"}}/>)}</div><span className="slbl" style={{color:strength.color}}>{strength.label}</span></div>)}
                  </div>
                  <div className="fg">
                    <label className="fl">Confirm Password <span>*</span></label>
                    <div className="pw"><input type={showCPw?"text":"password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className={`fi${form.confirmPassword&&form.confirmPassword!==form.password?" err":""}`} autoComplete="new-password"/><button type="button" className="shb" onClick={()=>setShowCPw(!showCPw)}>{showCPw?"Hide":"Show"}</button></div>
                    {form.confirmPassword&&(<div className="mh">{form.confirmPassword===form.password?<><span style={{color:"#22c55e"}}>✓</span><span style={{color:"#22c55e",fontSize:12}}>Passwords match</span></>:<><span style={{color:"#ef4444"}}>✗</span><span style={{color:"#ef4444",fontSize:12}}>Passwords don't match</span></>}</div>)}
                  </div>
                  {checks.length>0&&(<div className="cklist">{checks.map(([ok,txt])=><div key={txt} className={`ck${ok?" ok":""}`}><div className="ckd">{ok?"✓":"○"}</div>{txt}</div>)}</div>)}
                  <button type="submit" className="subbtn" disabled={loading}>{loading?<><div className="spin"/>Sending OTP...</>:"Continue — Verify Email →"}</button>
                </form>
                <div className="divr">or</div>
                <div className="sinr">Already have an account? <Link to="/login" className="sinl">Sign in</Link></div>
                <p className="trm">By registering you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step===2&&(
              <>
                <h2 className="ct">Verify your email</h2>
                <p className="cs" style={{marginBottom:18}}>We sent a 6-digit code to <span className="emhl">{form.email}</span>. Enter it below to complete signup.</p>
                {error&&<div className="ebox">⚠️ {error}</div>}
                <form onSubmit={handleVerifyAndRegister}>
                  <div className="orow" onPaste={handleOtpPaste}>
                    {otp.map((digit,i)=>(<input key={i} ref={otpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e=>handleOtpChange(i,e.target.value)} onKeyDown={e=>handleOtpKey(i,e)} className={`obox${digit?" f":""}`} autoFocus={i===0}/>))}
                  </div>
                  <button type="submit" className="subbtn" disabled={loading||otp.join("").length<6}>{loading?<><div className="spin"/>Verifying & creating account...</>:"Verify & Create Account →"}</button>
                </form>
                <div className="rsrow" style={{marginTop:14}}>Didn't get it? <button className="rsbtn" onClick={handleResend} disabled={resendTimer>0||loading}>{resendTimer>0?`Resend in ${resendTimer}s`:"Resend Code"}</button></div>
                <div style={{textAlign:"center",marginTop:10}}><button style={{background:"none",border:"none",color:"#94a3b8",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{setStep(1);setOtp(["","","","","",""]);setError("");}}>← Edit my details</button></div>
              </>
            )}

            {/* ── STEP 3 ── */}
            {step===3&&(
              <div className="sucw">
                <div className="suci">🎉</div>
                <h2 className="suct">Account created!</h2>
                <p className="subs">Welcome to JobPortal, <strong>{form.name.split(" ")[0]}</strong>! Your email has been verified and your account is ready.</p>
                <p className="rdn">⚡ Redirecting you to your dashboard...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;