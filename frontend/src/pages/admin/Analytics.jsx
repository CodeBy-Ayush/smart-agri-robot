// frontend/src/pages/admin/Analytics.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Analytics = () => {
  const [missionStats, setMissionStats] = useState({
    completed: 0,
    failed: 0,
    pending: 0,
    running: 0,
    total: 0,
  });

  useEffect(() => {
    loadMissionAnalytics();
  }, []);

  const loadMissionAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/analytics/missions",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMissionStats(res.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  const missionData = [
    {
      name: "Missions",
      Completed: missionStats.completed,
      Failed: missionStats.failed,
      Pending: missionStats.pending,
      Running: missionStats.running,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        📈 System Analytics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mission Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-700">
            Mission Status Overview
          </h3>
          <p className="text-xs text-slate-400 mb-2">
            Total missions: {missionStats.total}
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" fill="#22c55e" />
                <Bar dataKey="Failed" fill="#ef4444" />
                <Bar dataKey="Pending" fill="#f97316" />
                <Bar dataKey="Running" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simple text summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-4 text-slate-700">
            Summary
          </h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>✅ Completed missions: {missionStats.completed}</li>
            <li>🚧 Running missions: {missionStats.running}</li>
            <li>⏳ Pending missions: {missionStats.pending}</li>
            <li>❌ Failed / Rejected missions: {missionStats.failed}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
