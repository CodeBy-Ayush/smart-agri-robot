// App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Page
import Register from "./pages/Register";
import Login from "./pages/Login";

// Farmer Page
import FarmerDashboard from "./pages/FarmerDashboard";
import MissionPlanner from "./pages/farmer/MissionPlanner";
import WeatherPage from "./pages/farmer/WeatherPage";
import CropRecommendation from "./pages/farmer/CropRecommendation";
import RobotDashboard from "./pages/farmer/RobotDashboard";

// Admin Page
import AdminDashboard from "./pages/AdminDashboard";
import MissionControl from "./pages/admin/MissionControl";
import UserManagement from "./pages/admin/UserManagement";
import RobotFleet from "./pages/admin/RobotFleet"; // New Page
import Analytics from "./pages/admin/Analytics";     // New Page
import Settings from "./pages/admin/Settings"; // ✅ Import

// Layouts
import FarmerLayout from "./layouts/FarmerLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user"); // Poora object uthao
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* 1. Root & Auth Route */}
                <Route path="/" element={
                    !user ? <Navigate to="/login" /> : 
                    (user.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/farmer" />)
                } />

                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

                {/* 2. FARMER ROUTES (Consolidated) */}
                <Route path="/farmer" element={user && user.role === "farmer" ? <FarmerLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                    <Route index element={<FarmerDashboard user={user} />} />
                    <Route path="missions" element={<MissionPlanner />} />
                    <Route path="weather" element={<WeatherPage />} />
                    <Route path="crops" element={<CropRecommendation />} />
                    <Route path="robot" element={<RobotDashboard />} />
                </Route>

                {/* 3. ADMIN ROUTES (Consolidated) */}
                <Route path="/admin-dashboard" element={user && user.role === "admin" ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                    <Route index element={<AdminDashboard user={user} />} />
                    <Route path="missions" element={<MissionControl />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="robots" element={<RobotFleet />} />   {/* New */}
                    <Route path="analytics" element={<Analytics />} /> {/* New */}
                        <Route path="settings" element={<Settings />} /> 

                </Route>
            </Routes>
        </Router>
    );
}

export default App;
