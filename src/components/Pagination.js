import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .pg-wrap { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 40px; flex-wrap: wrap; }
        .pg-btn { min-width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #e5e7eb; background: #fff; font-family:'Syne',sans-serif; font-size: 13px; font-weight: 700; color: #374151; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0 10px; transition: all .18s; }
        .pg-btn:hover:not(:disabled):not(.dots) { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,.05); }
        .pg-btn.active { background: #0f2027; border-color: #0f2027; color: #fff; }
        .pg-btn:disabled { opacity: .4; cursor: not-allowed; }
        .pg-btn.dots { cursor: default; border-color: transparent; background: transparent; }
        .pg-nav { padding: 0 14px; }
      `}</style>
      <div className="pg-wrap">
        <button className="pg-btn pg-nav" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>← Prev</button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={"dots-" + i} className="pg-btn dots">…</span>
          ) : (
            <button key={p} className={"pg-btn" + (currentPage === p ? " active" : "")} onClick={() => onPageChange(p)}>{p}</button>
          )
        )}
        <button className="pg-btn pg-nav" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
      </div>
    </>
  );
};

export default Pagination;