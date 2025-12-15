// frontend/src/pages/admin/MissionControl.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  PlayCircle,
} from "lucide-react";
import axios from "axios";

const MissionControl = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/missions",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMissions(res.data.missions || []);
    } catch (err) {
      console.error("Fetch missions error:", err);
    }
  };

  const handleStatusUpdate = async (missionId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/admin/missions/${missionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionId ? { ...m, status: newStatus } : m
        )
      );

      alert(
        newStatus === "Running"
          ? "Mission approved & robot assigned (if available)."
          : `Mission marked as ${newStatus}`
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert(err?.response?.data?.msg || "Failed to update mission");
    }
  };

  const filteredMissions = missions.filter((m) => {
    if (activeTab === "Pending") return m.status === "Pending";
    if (activeTab === "Approved") return m.status === "Running";
    if (activeTab === "Completed") return m.status === "Completed";
    if (activeTab === "Rejected") return m.status === "Rejected";
    return true;
  });

  const getTypeBadge = (missionType) => {
    const t = (missionType || "").toLowerCase();
    if (t === "weeding") return "bg-red-100 text-red-700";
    if (t === "planting") return "bg-green-100 text-green-700";
    if (t === "surveying") return "bg-blue-100 text-blue-700";
    return "bg-slate-200 text-slate-600";
  };

  const formatType = (missionType) => {
    if (!missionType) return "Unknown";
    return missionType.charAt(0).toUpperCase() + missionType.slice(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            🎮 Mission Control Center
          </h1>
          <p className="text-slate-500">
            Review, approve and dispatch robot missions.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
            Pending: {missions.filter((m) => m.status === "Pending").length}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            Active: {missions.filter((m) => m.status === "Running").length}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-slate-200 pb-1">
        {["Pending", "Approved", "Completed", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm transition-all relative ${
              activeTab === tab
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMissions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border text-slate-400">
            No missions found.
          </div>
        ) : (
          filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* LEFT */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${getTypeBadge(
                      mission.type
                    )}`}
                  >
                    {formatType(mission.type)}
                  </span>

                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock size={12} />{" "}
                    {mission.createdAt
                      ? mission.createdAt.toString().slice(0, 10)
                      : "--"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  {mission.missionName || `Mission #${mission.id.slice(-5)}`}
                </h3>

                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <User size={16} /> {mission.farmerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />{" "}
                    {mission.fieldName ||
                      (mission.zones && mission.zones.join(", ")) ||
                      "No zones selected"}
                  </span>
                </div>

                {mission.assignedRobot && (
                  <p className="text-xs text-slate-400 mt-1">
                    Assigned Robot:{" "}
                    <span className="font-mono">
                      {mission.assignedRobot.code}
                    </span>
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div className="text-center min-w-[120px]">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                    mission.status === "Pending"
                      ? "bg-orange-100 text-orange-600"
                      : mission.status === "Running"
                      ? "bg-blue-100 text-blue-600 animate-pulse"
                      : mission.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {mission.status === "Running" && (
                    <PlayCircle size={14} />
                  )}
                  {mission.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                {mission.status === "Pending" ? (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(mission.id, "Running")
                      }
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
                    >
                      <CheckCircle size={18} /> Approve & Dispatch
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(mission.id, "Rejected")
                      }
                      className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </>
                ) : (
                  <span className="text-slate-400 text-sm">
                    Action Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MissionControl;
