// frontend/src/pages/FarmerDashboard.jsx
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import axios from "axios";

export default function FarmerDashboard() {
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState(null);
  const [farmHealth, setFarmHealth] = useState(null);
  const [robotStatus, setRobotStatus] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = savedUser.username
    ? savedUser.username.split(" ")[0]
    : "Farmer";
  const farmerId = savedUser?._id;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    loadWeather();
    loadFarmHealth();
    loadRobotStatus();
    loadActiveMission();
    loadTasks();
    loadNotifications();
  }, []);

  const loadWeather = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/weather/current?city=Ludhiana"
      );
      setWeather(res.data);
    } catch (e) {
      console.log("Weather error", e);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications?farmerId=${farmerId}`
      );
      setNotifications(res.data || []);
    } catch (e) {
      console.log("Notifications error", e);
    }
  };

  const loadFarmHealth = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/farm/health?farmerId=${farmerId}`
      );
      setFarmHealth(res.data);
    } catch (e) {
      console.log("Farm health error", e);
    }
  };

  const loadRobotStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/robot/status?farmerId=${farmerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRobotStatus(res.data);
    } catch (e) {
      console.log("Robot status error", e);
    }
  };
//Load Mission
  const loadActiveMission = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/robot/active-mission?farmerId=${farmerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setActiveMission(res.data);
    } catch (e) {
      console.log("Active mission error", e);
    }
  };
// Load Task
  const loadTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/today?farmerId=${farmerId}`
      );
      setTasks(res.data || []);
    } catch (e) {
      console.log("Tasks error", e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADERs */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">
            {greeting}, {firstName}! 👨‍🌾
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Here’s what’s happening on your farm today.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <div
            className={`w-3 h-3 rounded-full ${
              robotStatus?.online ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="font-semibold text-slate-700">
            System: {robotStatus?.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* WEATHERs For 5 Days */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 font-medium">Live Weather</p>
          <h2 className="text-4xl font-bold mt-2">
            {weather ? weather.temperature + "°C" : "--"}
          </h2>
          <p className="text-sm mt-1 text-blue-100">
            {weather?.condition} • {weather?.humidity}% Hum.
          </p>
        </div>

        {/* FARM HEALTH */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-500 font-medium">Farm Health</p>
          <h2 className="text-3xl font-bold text-slate-800">
            {farmHealth?.healthScore || "--"}%
          </h2>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${farmHealth?.healthScore || 0}%` }}
            />
          </div>
          <p className="text-sm text-green-600 mt-2 font-medium flex items-center gap-1">
            <CheckCircle size={14} /> {farmHealth?.soilStatus || "Healthy"}
          </p>
        </div>

        {/* ROBOT BATTERY Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-500 font-medium">Robot Battery</p>
          <h2 className="text-3xl font-bold text-slate-800">
            {robotStatus?.battery ?? "--"}%
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Est. runtime: {robotStatus?.runtimeLeft || "--"}
          </p>
        </div>

        {/* SOIL STATUS Shows */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-500 font-medium">Soil Status</p>
          <h2 className="text-3xl font-bold text-slate-800">
            {farmHealth?.soilStatus || "--"}
          </h2>
          <p className="text-sm text-slate-400 mt-2">Updated recently</p>
        </div>
      </div>

      {/* ACTIVE MISSION + TASKS + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ACTIVE MISSION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            🚜 Active Robot Mission
          </h3>

          {!activeMission ? (
            <p className="text-slate-500">No active mission.</p>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-700 text-lg">
                  {activeMission.missionName || "Mission in progress"}
                </span>
                <span className="text-blue-600 font-bold">
                  {activeMission.progress ?? 0}%
                </span>
              </div>

              <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${activeMission.progress ?? 0}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-slate-500 text-xs">Speed</p>
                  <p className="font-bold text-slate-800">
                    {activeMission.speed || 0} m/s
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-xs">Weeds Found</p>
                  <p className="font-bold text-red-500">
                    {activeMission.weeds || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-xs">Time Left</p>
                  <p className="font-bold text-slate-800">
                    {activeMission.timeLeft || "--"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TASKS + NOTIFICATIONS RIGHT COLUMN */}
        <div className="space-y-6">
          {/* TASKS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              📋 Today’s Tasks
            </h3>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No tasks for today.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    className="p-4 border rounded-xl flex gap-4"
                    key={task._id}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-slate-300"
                      }`}
                    >
                      {task.completed && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {task.task}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {task.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              🔔 Recent Notifications
            </h3>
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-xs">
                No notifications yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="border-l-2 border-blue-500 pl-2 py-1"
                  >
                    <p className="text-slate-700">{n.message}</p>
                    <p className="text-slate-400 text-[10px]">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Static fake weather alert hata diya (faltu confusion) */}
    </div>
  );
}
