import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Import providers at top
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* ✅ Wrap App correctly */}
    <AuthProvider>
      <JobProvider>
        <App />
      </JobProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();