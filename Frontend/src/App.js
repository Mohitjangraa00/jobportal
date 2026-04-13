import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import AppliedJobs from "./pages/candidate/AppliedJobs";
import Profile from "./pages/candidate/Profile";
import ResumeUpload from "./pages/candidate/ResumeUpload";

import ApplyJob from "./pages/application/ApplyJob";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJob from "./pages/employer/PostJob";
import ManageJobs from "./pages/employer/ManageJobs";
import EditJob from "./pages/employer/EditJob";

// ─── Helpers ────────────────────────────────────────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
};
const getToken = () => localStorage.getItem("token");

// ─── ProtectedRoute ─────────────────────────────────────
// allowedRole: "user" | "recruiter" | undefined (any logged-in user)
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    // ✅ Send each role to their own dashboard
    if (user.role === "recruiter") return <Navigate to="/employer/dashboard" replace />;
    if (user.role === "user") return <Navigate to="/candidate/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// ─── PublicOnlyRoute ─────────────────────────────────────
// Logged-in users can't access /login or /register
const PublicOnlyRoute = ({ children }) => {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    if (user.role === "recruiter") return <Navigate to="/employer/dashboard" replace />;
    return <Navigate to="/candidate/dashboard" replace />;
  }
  return children;
};

// ─── Smart Dashboard Redirect ────────────────────────────
const DashboardRedirect = () => {
  const user = getUser();
  if (user?.role === "recruiter") return <Navigate to="/employer/dashboard" replace />;
  return <Navigate to="/candidate/dashboard" replace />;
};

// ─── App ─────────────────────────────────────────────────
const App = () => (
  <Router>
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>

          {/* ── PUBLIC ── */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* ── /dashboard → smart redirect ── */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

          {/* ── CANDIDATE (role = "user") ── */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute allowedRole="user"><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/candidate/applied-jobs" element={
            <ProtectedRoute allowedRole="user"><AppliedJobs /></ProtectedRoute>
          } />
          <Route path="/candidate/resume" element={
            <ProtectedRoute allowedRole="user"><ResumeUpload /></ProtectedRoute>
          } />

          {/* Profile — both roles can access */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Apply — only job seekers */}
          <Route path="/apply/:id" element={
            <ProtectedRoute allowedRole="user"><ApplyJob /></ProtectedRoute>
          } />

          {/* ── EMPLOYER (role = "recruiter") ── */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRole="recruiter"><EmployerDashboard /></ProtectedRoute>
          } />
          <Route path="/employer/post-job" element={
            <ProtectedRoute allowedRole="recruiter"><PostJob /></ProtectedRoute>
          } />
          <Route path="/employer/manage-jobs" element={
            <ProtectedRoute allowedRole="recruiter"><ManageJobs /></ProtectedRoute>
          } />
          <Route path="/employer/edit-job/:id" element={
            <ProtectedRoute allowedRole="recruiter"><EditJob /></ProtectedRoute>
          } />

          {/* ── Legacy redirects ── */}
          <Route path="/applied-jobs" element={<Navigate to="/candidate/applied-jobs" replace />} />
          <Route path="/resume"       element={<Navigate to="/candidate/resume" replace />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
);

const NotFound = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
      .nf-root { font-family:'DM Sans',sans-serif; background:#f0ede8; min-height:80vh; display:flex; align-items:center; justify-content:center; padding:40px 24px; }
      .nf-card { background:#fff; border:1.5px solid #e5e7eb; border-radius:24px; padding:56px 48px; text-align:center; max-width:440px; width:100%; }
      .nf-code { font-family:'Syne',sans-serif; font-size:72px; font-weight:800; color:#0f2027; line-height:1; margin-bottom:4px; }
      .nf-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#374151; margin-bottom:8px; }
      .nf-sub { font-size:14px; color:#94a3b8; margin-bottom:28px; line-height:1.6; }
      .nf-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
      .nf-btn { padding:11px 22px; border-radius:10px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; text-decoration:none; }
      .nf-btn.dark { background:#0f2027; color:#fff; }
      .nf-btn.ghost { background:#f8fafc; color:#374151; border:1.5px solid #e5e7eb; }
    `}</style>
    <div className="nf-root">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <div className="nf-title">Page not found</div>
        <p className="nf-sub">The page you're looking for doesn't exist or has been moved.</p>
        <div className="nf-btns">
          <a href="/" className="nf-btn dark">← Go Home</a>
          <a href="/jobs" className="nf-btn ghost">Browse Jobs</a>
        </div>
      </div>
    </div>
  </>
);

export default App;