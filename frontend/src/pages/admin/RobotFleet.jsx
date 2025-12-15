// frontend/src/pages/admin/RobotFleet.jsx
import React, { useEffect, useState } from "react";
import { Bot, Battery, AlertTriangle, CheckCircle, MapPin, Plus } from "lucide-react";
import axios from "axios";

const RobotFleet = () => {
  const [robots, setRobots] = useState([]);
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    loadRobots();
  }, []);

  const loadRobots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/robots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRobots(res.data.robots || []);
    } catch (err) {
      console.error("Load robots error:", err);
    }
  };

  const handleAddRobot = async () => {
    if (!newCode.trim()) {
      return alert("Please enter a robot code");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/admin/robots/create",
        { code: newCode.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRobots((prev) => [res.data.robot, ...prev]);
      setNewCode("");
      alert("Robot added successfully");
    } catch (err) {
      console.error("Add robot error:", err);
      alert(err?.response?.data?.msg || "Failed to add robot");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">
          🤖 Robot Fleet Management
        </h1>

        <div className="flex gap-2">
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="New Robot Code (e.g. R-105)"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <button
            onClick={handleAddRobot}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add New Robot
          </button>
        </div>
      </div>

      {robots.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border text-center text-slate-400">
          No robots found. Add one using "New Robot Code".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {robots.map((robot) => (
            <div
              key={robot._id}
              className={`p-6 rounded-xl border-l-4 shadow-sm bg-white ${
                robot.status === "Active"
                  ? "border-green-500"
                  : robot.status === "Error"
                  ? "border-red-500"
                  : "border-slate-400"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {robot.code || "Unknown"}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        robot.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : robot.status === "Error"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {robot.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm font-bold">
                  <Battery
                    size={16}
                    className={
                      (robot.battery || 0) < 20
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  />
                  {robot.battery ?? "--"}%
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />{" "}
                  {robot.location || "Unknown location"}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-purple-500" /> Current
                  Task:{" "}
                  <span className="font-semibold">
                    {robot.task || "Idle"}
                  </span>
                </div>
              </div>

              {robot.status === "Error" && (
                <div className="mt-4 bg-red-50 text-red-700 p-2 rounded text-xs flex items-center gap-2">
                  <AlertTriangle size={14} /> Maintenance Required
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RobotFleet;
