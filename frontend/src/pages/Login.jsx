//Login Pages for register
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, ShieldCheck, Mail, Lock } from "lucide-react"; 
// Assuming this path is correct and it exports { farm, farrr }
import asser from "../image/asser"; 


const farmerBg = `url(${asser.farm})`;
const adminBg = `url(${asser.farrr})`;

// --------------------------------------
//Login Page

export default function Login({ onLogin }) {
    const [loginRole, setLoginRole] = useState("farmer");
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Current background image based on selected roles
    const currentBg = loginRole === 'farmer' ? farmerBg : adminBg;

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // API call remains the same
            const res = await axios.post("http://localhost:5000/api/auth/login", form);
            const actualRole = res.data.user.role;

            if (loginRole !== actualRole) {
                setError(`Error: You are trying to login as ${loginRole}, but this account is for ${actualRole}.`);
                return;
            }

            // LocalStorages updates
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", actualRole);
            localStorage.setItem("username", res.data.user.username);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (onLogin) onLogin(res.data.user);

            // Navigation
            if (actualRole === "admin") navigate("/admin-dashboard");
            else navigate("/farmer");

        } catch (err) {
            const msg = err.response && err.response.data && err.response.data.msg ?
                err.response.data.msg :
                "Invalid Credentials";
            setError(msg);
        }
    };

    return ( 
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 transition-all duration-700 ease-in-out" 
            style={{ backgroundImage: currentBg }} // Dynamic Background from local asset
        >
            {/* 💡 Overlay is now a generic dark tint for better text readability on any image. */}
            <div 
                className={`absolute inset-0 bg-black/50 backdrop-saturate-150 backdrop-blur-sm transition-colors duration-700 ease-in-out`}
            ></div>

            {/* Login Card (Glassmorphism remains for best UI) */}
            <div className={`relative z-10 bg-gray-900/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md 
                            border ${loginRole === 'farmer' ? 'border-green-500/30 hover:shadow-green-500/20' : 'border-blue-500/30 hover:shadow-blue-500/20'} 
                            transition-all duration-500`}>

                <h2 className="text-5xl font-black text-white text-center mb-1 drop-shadow-lg flex justify-center items-center gap-2">
                    <Leaf className="text-green-400 w-8 h-8"/> AgroBot
                </h2>
                <p className="text-green-300 text-center mb-8 font-light tracking-widest text-sm">
                    Autonomous Farming System Login
                </p>

                {/* --- TOGGLE BOX (Farmer vs Admin) --- */}
                <div className="flex bg-white/10 p-1 rounded-xl mb-6 shadow-inner">
                    <button 
                        onClick={() => setLoginRole("farmer")}
                        className={`flex-1 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2
                        ${loginRole === "farmer" 
                            ? "bg-green-600 text-white shadow-lg shadow-green-500/40" 
                            : "text-gray-300 hover:text-white hover:bg-white/5"}`
                        }
                    > 
                        <span role="img" aria-label="farmer">👨‍🌾</span> Farmer 
                    </button>
                    <button 
                        onClick={() => setLoginRole("admin")}
                        className={`flex-1 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2
                        ${loginRole === "admin" 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" 
                            : "text-gray-300 hover:text-white hover:bg-white/5"}`
                        }
                    > 
                        <ShieldCheck className="w-5 h-5"/> Admin 
                    </button>
                </div>
                {/* ------------------------------------ */}

                {error && (
                    <div className="bg-red-600/90 text-white text-sm p-3 rounded-lg mb-4 text-center border border-red-400 font-semibold shadow-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-green-200 text-sm ml-1 font-medium flex items-center gap-2 mb-1"><Mail className="w-4 h-4"/> Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder={loginRole === 'admin' ? "admin@agro.com" : "farmer@agro.com"}
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:ring-offset-2 focus:ring-offset-gray-900/50 
                                       border border-transparent transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="text-green-200 text-sm ml-1 font-medium flex items-center gap-2 mb-1"><Lock className="w-4 h-4"/> Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:ring-offset-2 focus:ring-offset-gray-900/50 
                                       border border-transparent transition-all duration-300"
                        />
                    </div>
{/*Shows For Submissions Button For Farmers  */}
                    <button
                        type="submit"
                        className={`w-full py-3 font-extrabold rounded-xl shadow-xl transform transition duration-300 hover:scale-[1.02] text-white uppercase tracking-wider
                        ${loginRole === 'farmer' 
                            ? "bg-gradient-to-r from-lime-500 to-green-700 hover:from-lime-600 hover:to-green-800 shadow-green-500/50" 
                            : "bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 shadow-blue-500/50"}`
                        }
                    >
                        Login as {loginRole === 'farmer' ? "Farmer" : "Admin"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <p className="text-gray-300 text-sm">
                        New here? {" "}
                        <Link to="/register" className="text-green-400 font-bold hover:text-green-300 underline transition duration-300">
                            Create Farmer Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
