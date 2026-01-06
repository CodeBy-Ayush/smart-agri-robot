import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock } from "lucide-react"; // New Icons

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = e => setForm({...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register", form);

            alert("Registration Successful! Please Login.");
            navigate("/login");
        } catch (err) {
            const msg = err.response && err.response.data && err.response.data.msg ?
                err.response.data.msg :
                "Registration Failed";
            setError(msg);
        }
    };
    
    //Register Page
    return ( 
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop')" }} 
        >

            {/* ENHANCED Dark Green Overlay (Consistent with Login) */}
            <div className="absolute inset-0 bg-green-950/80 backdrop-saturate-150"></div>

            {/* ENHANCED Register Card (Consistent with Login) */}
            <div className="relative z-10 bg-gray-900/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md 
                            border border-green-500/30 transition-all duration-500 hover:shadow-green-500/20">

                <h2 className="text-4xl font-black text-white text-center mb-2 drop-shadow-lg flex justify-center items-center gap-2">
                    <Leaf className="text-green-400 w-6 h-6"/> Register
                </h2>
                <p className="text-green-300 text-center mb-8 font-light text-sm">
                    Create Your AgroBot Farmer Account
                </p>

                {error && (
                    <div className="bg-red-600/90 text-white text-sm p-3 rounded-lg mb-4 text-center border border-red-400 font-semibold shadow-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Username Input */}
                    <div>
                        <label className="text-green-200 text-sm ml-1 font-medium flex items-center gap-2 mb-1"><User className="w-4 h-4"/> Full Name</label>
                        <input
                            name="username"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:ring-offset-2 focus:ring-offset-gray-900/50 
                                       border border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="text-green-200 text-sm ml-1 font-medium flex items-center gap-2 mb-1"><Mail className="w-4 h-4"/> Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:ring-offset-2 focus:ring-offset-gray-900/50 
                                       border border-transparent transition-all duration-300"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="text-green-200 text-sm ml-1 font-medium flex items-center gap-2 mb-1"><Lock className="w-4 h-4"/> Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Create Password"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 
                                       focus:outline-none focus:ring-2 focus:ring-green-400/80 focus:ring-offset-2 focus:ring-offset-gray-900/50 
                                       border border-transparent transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-gradient-to-r from-lime-500 to-green-700 hover:from-lime-600 hover:to-green-800 text-white font-extrabold rounded-xl 
                                   shadow-xl shadow-green-500/50 transform transition duration-300 hover:scale-[1.02] uppercase tracking-wider"
                    >
                        Register as Farmer
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6">
                    <p className="text-gray-300 text-sm">
                        Already have an account? {" "}
                        <Link to="/login" className="text-green-400 font-bold hover:text-green-300 underline transition duration-300">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
