
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = ({ setRole }) => {
  const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await api.post("/auth/login", form);
    const { token, user } = res.data;

    // THIS IS THE ONLY CHANGE YOU NEED
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role || "user");
    localStorage.setItem("userId", user.id);
    localStorage.setItem("name", user.name || user.email.split("@")[0]); // THIS LINE ADDED

    // Safe update (won't crash if undefined)
    if (setRole) setRole(user.role);

    setSuccess("Login successful! Redirecting...");

    setTimeout(() => {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/guestDashboard");
      }
    }, 1000);

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 px-4">
    <div className="min-h-[91.3vh] bg-gray-50 p-5 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600 px-4">


     
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 ">
          🔐 Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-4 text-center bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />

              <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 pr-10"
        required
      />

      {/* Eye Icon */}
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 focus:outline-none cursor-pointer"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>

          <button
            type="submit"
            className="w-full cursor-pointer  bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition "
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 cursor-pointer">
          Not registered?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;




