// Login Page for Farmers and Admin (Demo Mode)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ShieldCheck, Mail, Lock } from "lucide-react";
import asser from "../image/asser";

const farmerBg = `url(${asser.farm})`;
const adminBg = `url(${asser.farrr})`;

export default function Login({ onLogin }) {

  const [loginRole, setLoginRole] = useState("farmer");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const currentBg = loginRole === "farmer" ? farmerBg : adminBg;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // DEMO LOGIN (No backend required)
  const handleSubmit = (e) => {
    e.preventDefault();

    const demoUser = {
      username: loginRole === "admin" ? "Demo Admin" : "Demo Farmer",
      role: loginRole,
    };

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("role", demoUser.role);
    localStorage.setItem("username", demoUser.username);
    localStorage.setItem("user", JSON.stringify(demoUser));

    if (onLogin) onLogin(demoUser);

    if (loginRole === "admin") navigate("/admin-dashboard");
    else navigate("/farmer");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 transition-all duration-700"
      style={{ backgroundImage: currentBg }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-green-500/30">

        <h2 className="text-5xl font-black text-white text-center mb-1 flex justify-center items-center gap-2">
          <Leaf className="text-green-400 w-8 h-8" />
          AgroBot
        </h2>

        <p className="text-green-300 text-center mb-8 text-sm tracking-widest">
          Autonomous Farming System Login
        </p>

        {/* DEMO MODE NOTICE */}
        <div className="bg-yellow-500 text-black text-center text-sm p-2 rounded-lg mb-4 font-semibold">
          Demo Mode Enabled (Backend Disabled)
        </div>

        {/* Farmer/Admin Toggle */}
        <div className="flex bg-white/10 p-1 rounded-xl mb-6">

          <button
            onClick={() => setLoginRole("farmer")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition 
            ${loginRole === "farmer"
                ? "bg-green-600 text-white"
                : "text-gray-300"}`}
          >
            👨‍🌾 Farmer
          </button>

          <button
            onClick={() => setLoginRole("admin")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition 
            ${loginRole === "admin"
                ? "bg-blue-600 text-white"
                : "text-gray-300"}`}
          >
            <ShieldCheck className="inline w-4 h-4 mr-1" />
            Admin
          </button>

        </div>

        {error && (
          <div className="bg-red-600 text-white text-sm p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-green-200 text-sm flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="demo@agro.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-green-200 text-sm flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4" /> Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="demo123"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-bold rounded-xl shadow-xl text-white transition
            ${loginRole === "farmer"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Login as {loginRole === "farmer" ? "Farmer" : "Admin"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          New here?{" "}
          <Link
            to="/register"
            className="text-green-400 font-semibold hover:underline"
          >
            Create Farmer Account
          </Link>
        </div>

      </div>
    </div>
  );
}
