import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
      .ld-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; gap: 16px; }
      .ld-ring { width: 44px; height: 44px; border-radius: 50%; border: 3px solid #e5e7eb; border-top-color: #6366f1; animation: ld-spin .7s linear infinite; }
      @keyframes ld-spin { to { transform: rotate(360deg); } }
      .ld-text { font-family:'Syne',sans-serif; font-size: 13px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; }
    `}</style>
    <div className="ld-wrap">
      <div className="ld-ring" />
      <span className="ld-text">{text}</span>
    </div>
  </>
);

export default Loader;