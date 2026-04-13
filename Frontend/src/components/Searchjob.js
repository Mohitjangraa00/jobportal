import React, { useState } from "react";

const SearchJob = ({ onSearch, initialKeyword = "", initialLocation = "" }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({ keyword, location });
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const trending = ["React", "Python", "Remote", "Data Science", "Product Manager"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
        .sj-wrap { font-family:'DM Sans',sans-serif; }
        .sj-box { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; display: flex; overflow: hidden; box-shadow: 0 2px 12px rgba(15,32,39,.06); transition: border-color .2s, box-shadow .2s; }
        .sj-box:focus-within { border-color: #6366f1; box-shadow: 0 2px 12px rgba(99,102,241,.12); }
        .sj-input { flex: 1; padding: 15px 20px; border: none; outline: none; font-family:'DM Sans',sans-serif; font-size: 15px; color: #0f2027; background: transparent; min-width: 0; }
        .sj-input::placeholder { color: #c4c9d4; }
        .sj-divider { width: 1px; background: #f1f5f9; margin: 10px 0; flex-shrink: 0; }
        .sj-btn { padding: 0 28px; background: #0f2027; color: #fff; border: none; font-family:'Syne',sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .18s; white-space: nowrap; flex-shrink: 0; }
        .sj-btn:hover { background: #1e3a4a; }
        .sj-trending { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .sj-trend-label { font-size: 12px; color: #94a3b8; white-space: nowrap; }
        .sj-chip { padding: 4px 12px; background: #fff; border: 1.5px solid #e5e7eb; border-radius: 99px; font-size: 12px; color: #374151; cursor: pointer; transition: border-color .18s, color .18s; font-family:'DM Sans',sans-serif; background: none; }
        .sj-chip:hover { border-color: #6366f1; color: #6366f1; }
        @media (max-width: 520px) { .sj-divider { display: none; } .sj-box { flex-wrap: wrap; } .sj-input { min-width: 100%; border-bottom: 1px solid #f1f5f9; } .sj-btn { width: 100%; padding: 14px; } }
      `}</style>
      <div className="sj-wrap">
        <div className="sj-box">
          <input className="sj-input" type="text" placeholder="Job title, keyword or company..." value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKey} />
          <div className="sj-divider" />
          <input className="sj-input" type="text" placeholder="City or remote..." value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={handleKey} />
          <button className="sj-btn" onClick={handleSearch}>Search</button>
        </div>
        <div className="sj-trending">
          <span className="sj-trend-label">Trending:</span>
          {trending.map((t) => (
            <button key={t} className="sj-chip" onClick={() => { setKeyword(t); onSearch({ keyword: t, location }); }}>{t}</button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchJob;