
// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, LogIn, UserPlus, Sparkles, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    navigate("/", { replace: true }); // ← This forces full redirect
    window.location.reload(); // ← Optional: full refresh to clear state
  };

  return (
    <nav className="backdrop-blur-2xl bg-gradient-to-r from-white/90 to-blue-50/90 shadow-2xl border-b border-white/40 sticky top-0 z-50">
      {/* Your beautiful animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
        {/* LOGO */}
        <Link to={token ? "/dashboard" : "/"} className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="text-white" size={20} />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">
              FareBuzzer
            </span>
            <span className="block text-xs font-medium text-gray-600 tracking-wider">ACCOUNTING</span>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="text-white" size={18} />
                </div>
                <div>
                  <span className="text-sm text-gray-600">Welcome</span>
                  <p className="font-bold text-gray-800">{name}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="cursor-pointer group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}