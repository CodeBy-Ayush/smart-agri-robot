// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  ClipboardList,
  Activity,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalFarmers: 0,
    pendingMissions: 0,
    activeRobots: 0,
    systemHealth: "—",
  });

  const [activity, setActivity] = useState([]);

  useEffect(() => {
    loadStats();
    loadActivity();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error", err);
    }
  };

  const loadActivity = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/activity", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivity(res.data.activity || []);
    } catch (err) {
      console.error("Activity fetch error", err);
    }
  };

  const formatTime = (t) => {
    if (!t) return "";
    return new Date(t).toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Headers */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Admin Control Center 🛡️
          </h1>
          <p className="text-slate-500 mt-1">
            Live overview of system performance and usage.
          </p>
        </div>
        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          System Online
        </span>
      </div>

      {/* Stats of Farmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Farmers */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Total Farmers
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.totalFarmers}
            </h3>
          </div>
        </div>

        {/* Pending Missions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-lg">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Pending Missions
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.pendingMissions}
            </h3>
          </div>
        </div>

        {/* Active Robots */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Active Robots
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.activeRobots}
            </h3>
          </div>
        </div>

        {/* Systems Healths */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              System Health
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.systemHealth}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-500" /> Recent Activity
        </h3>

        {activity.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No recent activity recorded.
          </p>
        ) : (
          <div className="space-y-3">
            {activity.map((a, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 py-2 border-b last:border-0 border-slate-100"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    a.type === "alert"
                      ? "bg-red-500"
                      : a.type === "success"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                />
                <div>
                  <p className="text-slate-800 text-sm">{a.text}</p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    {formatTime(a.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
