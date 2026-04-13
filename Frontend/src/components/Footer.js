import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    "For Job Seekers": [
      { label: "Browse Jobs", to: "/jobs" },
      { label: "Create Account", to: "/register" },
      { label: "My Dashboard", to: "/candidate/dashboard" },
      { label: "Applied Jobs", to: "/candidate/applied-jobs" },
      { label: "Upload Resume", to: "/candidate/resume" },
    ],
    "For Recruiters": [
      { label: "Post a Job", to: "/employer/post-job" },
      { label: "Manage Listings", to: "/employer/manage-jobs" },
      { label: "Employer Dashboard", to: "/employer/dashboard" },
      { label: "Sign Up as Recruiter", to: "/register" },
    ],
    "Company": [
      { label: "About Us", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Privacy Policy", to: "/" },
      { label: "Terms of Service", to: "/" },
    ],
  };

  const socials = [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
    { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
    { label: "GitHub", href: "https://github.com", icon: "gh" },
    { label: "Instagram", href: "https://instagram.com", icon: "ig" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

        .ft-root { background: #0f2027; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }

        .ft-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .ft-orb.o1 { width: 400px; height: 400px; background: rgba(99,102,241,.1); top: -120px; left: -100px; }
        .ft-orb.o2 { width: 300px; height: 300px; background: rgba(34,211,238,.06); bottom: -80px; right: -60px; }

        .ft-top { max-width: 1100px; margin: 0 auto; padding: 64px 24px 48px; display: grid; grid-template-columns: 280px 1fr; gap: 60px; position: relative; z-index: 1; }
        @media (max-width: 820px) { .ft-top { grid-template-columns: 1fr; gap: 40px; } }

        /* Brand col */
        .ft-brand { }
        .ft-logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; text-decoration: none; }
        .ft-logo-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; }
        .ft-tagline { font-size: 14px; color: rgba(255,255,255,.45); line-height: 1.75; margin-bottom: 24px; max-width: 240px; }

        .ft-socials { display: flex; gap: 10px; }
        .ft-social { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,.6); font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif; text-decoration: none; transition: background .2s, border-color .2s, color .2s; }
        .ft-social:hover { background: rgba(99,102,241,.25); border-color: rgba(99,102,241,.4); color: #a5b4fc; }

        /* Links grid */
        .ft-links-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @media (max-width: 600px) { .ft-links-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 360px) { .ft-links-grid { grid-template-columns: 1fr; } }

        .ft-col-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,.35); margin-bottom: 18px; }

        .ft-col-link { display: block; font-size: 14px; color: rgba(255,255,255,.5); text-decoration: none; margin-bottom: 12px; transition: color .18s; line-height: 1; }
        .ft-col-link:hover { color: #fff; }

        /* Divider */
        .ft-divider { border: none; border-top: 1px solid rgba(255,255,255,.08); margin: 0; }

        /* Bottom bar */
        .ft-bottom { max-width: 1100px; margin: 0 auto; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; position: relative; z-index: 1; }
        .ft-copy { font-size: 13px; color: rgba(255,255,255,.3); }
        .ft-copy span { color: rgba(255,255,255,.5); }

        .ft-bottom-links { display: flex; gap: 20px; }
        .ft-bottom-link { font-size: 13px; color: rgba(255,255,255,.3); text-decoration: none; transition: color .18s; }
        .ft-bottom-link:hover { color: rgba(255,255,255,.7); }

        /* Newsletter strip */
        .ft-newsletter { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.2); border-radius: 16px; padding: 24px 28px; margin-bottom: 48px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .ft-nl-text { }
        .ft-nl-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .ft-nl-sub { font-size: 13px; color: rgba(255,255,255,.45); }
        .ft-nl-form { display: flex; gap: 8px; flex-wrap: wrap; }
        .ft-nl-input { padding: 10px 16px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #fff; outline: none; width: 220px; transition: border-color .2s; }
        .ft-nl-input::placeholder { color: rgba(255,255,255,.3); }
        .ft-nl-input:focus { border-color: rgba(99,102,241,.5); }
        .ft-nl-btn { padding: 10px 20px; background: #6366f1; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; white-space: nowrap; transition: background .2s; }
        .ft-nl-btn:hover { background: #4f46e5; }
      `}</style>

      <footer className="ft-root">
        <div className="ft-orb o1" /><div className="ft-orb o2" />

        <div className="ft-top">
          {/* Brand */}
          <div className="ft-brand">
            <Link to="/" className="ft-logo"><span className="ft-logo-dot" />JobPortal</Link>
            <p className="ft-tagline">Find your dream job or hire the best talent — all in one place.</p>

            {/* Newsletter */}
            <div className="ft-newsletter">
              <div className="ft-nl-text">
                <div className="ft-nl-title">Stay in the loop</div>
                <div className="ft-nl-sub">Get new job alerts weekly</div>
              </div>
              <div className="ft-nl-form">
                <input className="ft-nl-input" type="email" placeholder="your@email.com" />
                <button className="ft-nl-btn">Subscribe</button>
              </div>
            </div>

            <div className="ft-socials">
              {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ft-social" title={label}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="ft-links-grid">
            {Object.entries(links).map(([col, items]) => (
              <div key={col}>
                <div className="ft-col-title">{col}</div>
                {items.map(({ label, to }) => (
                  <Link key={label} to={to} className="ft-col-link">{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <hr className="ft-divider" />

        <div className="ft-bottom">
          <p className="ft-copy">© {year} <span>JobPortal</span>. All rights reserved.</p>
          <div className="ft-bottom-links">
            <a href="/" className="ft-bottom-link">Privacy</a>
            <a href="/" className="ft-bottom-link">Terms</a>
            <a href="/" className="ft-bottom-link">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;