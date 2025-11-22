import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import Navbar from "./components/Navbar";
import GuestDashboard from "./pages/GuestDashboard";
import GuestProjectView from './pages/GuestProjectView'
// import Footer from "./components/Footer";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // AUTO REDIRECT LOGIC — THIS IS THE KEY
  useEffect(() => {
    const publicPaths = ["/", "/signup"];

    if (!token && !publicPaths.includes(location.pathname)) {
      // Not logged in → force to login
      navigate("/", { replace: true });
    }
    else if (token && publicPaths.includes(location.pathname)) {
      // Logged in but on login/signup → go to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [token, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/guestDashboard" element={<GuestDashboard />} />
        <Route path="/guestView/:id" element={<GuestProjectView />} />

        <Route path="/project/:id" element={<ProjectPage />} />

        {/* CATCH ALL */}
        <Route path="*" element={<Login />} />
      </Routes>
        {/* <Footer/> */}

    </div>
  );
}

