import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Battery,
  Zap,
  Play,
  Square,
  AlertOctagon,
  ArrowUpRight,
} from "lucide-react";
import axios from "axios";

const gridSize = 10;

const RobotDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Weeding");
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [battery, setBattery] = useState(100);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ weeds: 0, plants: 0, distance: 0 });

  const [activeMission, setActiveMission] = useState(null);
  const [robotInfo, setRobotInfo] = useState(null);
  const [loadingMission, setLoadingMission] = useState(true);

  const logContainerRef = useRef(null);

  const addLog = (msg, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, msg, type }, ...prev.slice(0, 50)]);
  };

  const loadActiveMission = async () => {
    try {
      setLoadingMission(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/robot/my-active",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setActiveMission(res.data.mission || null);
      setRobotInfo(res.data.robot || null);

      if (res.data.robot?.battery != null) {
        setBattery(res.data.robot.battery);
      }

      if (res.data.mission) {
        const m = res.data.mission;
        const readableMode =
          m.missionType === "planting"
            ? "Planting"
            : m.missionType === "weeding"
            ? "Weeding"
            : "Surveying";

        setMode(readableMode);
        addLog(
          `Loaded active mission #${m._id?.slice(-5)} (${readableMode})`,
          "success"
        );
      } else {
        addLog("No active mission assigned yet.", "info");
      }
    } catch (err) {
      console.error(err);
      addLog("Failed to load active mission from server.", "error");
    } finally {
      setLoadingMission(false);
    }
  };

  useEffect(() => {
    loadActiveMission();
  }, []);

  // ROBOT SIMULATION
  useEffect(() => {
    if (!isRunning || battery <= 0 || !activeMission) return;

    const interval = setInterval(() => {
      setRobotPos((prevPos) => {
        let newX = prevPos.x;
        let newY = prevPos.y;

        if (newY % 2 === 0) {
          if (newX < gridSize - 1) newX++;
          else newY++;
        } else {
          if (newX > 0) newX--;
          else newY++;
        }

        // finish
        if (newY >= gridSize) {
          clearInterval(interval);
          setIsRunning(false);
          setRobotPos({ x: 0, y: 0 });
          addLog("Mission completed. Returning to base.", "success");

          if (activeMission?._id) {
            axios
              .post(
                "http://localhost:5000/api/robot/mission-complete",
                {
                  missionId: activeMission._id,
                  stats,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(() => {
                addLog(
                  `Mission #${activeMission._id} marked as Completed on server.`,
                  "success"
                );
              })
              .catch(() => {
                addLog(
                  "Failed to update mission status on server (will remain local only).",
                  "error"
                );
              });
          }

          return { x: 0, y: 0 };
        }

        // Update stats
        setStats((prevStats) => ({
          ...prevStats,
          distance: prevStats.distance + 1,
        }));

        if (Math.random() > 0.8) {
          if (mode === "Weeding") {
            setStats((prev) => ({ ...prev, weeds: prev.weeds + 1 }));
            addLog(
              `Weed removed at zone [${prevPos.x}, ${prevPos.y}]`,
              "alert"
            );
          } else if (mode === "Planting") {
            setStats((prev) => ({ ...prev, plants: prev.plants + 1 }));
            addLog(
              `Seed planted at zone [${prevPos.x}, ${prevPos.y}]`,
              "info"
            );
          }
        }

        return { x: newX, y: newY };
      });

      setBattery((prev) => Math.max(0, prev - 0.5));
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, battery, mode, activeMission, stats]); // ye theek hai, but ensure activeMission non-null

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop =
        logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleMission = () => {
    if (!activeMission) {
      return alert(
        "No mission assigned yet. Please create & get approval from admin."
      );
    }
    if (!isRunning) {
      if (battery < 10) return alert("Battery too low to start!");
      addLog(`Mission started: ${mode} mode.`, "success");

      axios
        .post(
          "http://localhost:5000/api/robot/start-mission",
          { missionId: activeMission._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .catch(() => {
          addLog(
            "Could not notify server about mission start (local sim is still running).",
            "error"
          );
        });
    } else {
      addLog("Mission paused by user.", "warning");
    }
    setIsRunning((prev) => !prev);
  };

  const handleStop = () => {
    setIsRunning(false);
    setRobotPos({ x: 0, y: 0 });
    addLog("Emergency stop triggered. Robot reset.", "error");

    if (activeMission?._id) {
      axios
        .post(
          "http://localhost:5000/api/robot/abort-mission",
          { missionId: activeMission._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .catch(() => {});
    }
  };

  // ----------------- UI -----------------
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Bot size={32} className="text-blue-600" /> Field Robot
          </h1>
          <p className="text-slate-500">
            Live simulation + backend-ready mission control.
          </p>

          {loadingMission && (
            <p className="text-xs text-slate-400 mt-2">
              Loading assigned mission...
            </p>
          )}

          {!loadingMission && !activeMission && (
            <p className="text-xs text-red-500 mt-2">
              No active mission. Go to Mission Planner / Admin to create &
              approve one.
            </p>
          )}

          {!loadingMission && activeMission && (
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p className="font-semibold">
                Mission:{" "}
                <span className="text-blue-600">
                  #{activeMission._id?.slice(-5)} ({mode})
                </span>
              </p>
              <p>
                Zones:{" "}
                <span className="font-mono">
                  {activeMission.zones?.join(", ") || "N/A"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isRunning ? "bg-green-400" : "bg-orange-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isRunning ? "bg-green-500" : "bg-orange-500"
                }`}
              ></span>
            </span>
            <span className="font-bold text-slate-700">
              {isRunning ? "ROBOT ACTIVE" : "STANDBY"}
            </span>
          </div>

          {robotInfo && (
            <div className="text-xs text-slate-500">
              Robot:{" "}
              <span className="font-mono font-semibold">
                {robotInfo.code}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: MAP + CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* MAP */}
          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-full flex justify-between text-slate-400 mb-4 text-xs uppercase tracking-widest font-bold">
              <span>Field Map (Sector A)</span>
              <span>Live Simulation</span>
            </div>

            <div
              className="grid gap-1 bg-slate-800 p-2 rounded-lg border border-slate-700"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: "100%",
                maxWidth: "400px",
                aspectRatio: "1 / 1",
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize);
                const isRobotHere = robotPos.x === x && robotPos.y === y;

                return (
                  <div
                    key={index}
                    className={`rounded-sm flex items-center justify-center transition-all duration-300 ${
                      isRobotHere
                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] scale-110 z-10"
                        : "bg-slate-700/30"
                    }`}
                  >
                    {isRobotHere && (
                      <Bot
                        size={16}
                        className="text-white animate-bounce"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="w-full mt-4 flex justify-between text-slate-400 text-xs font-mono">
              <span>
                Position: X:{robotPos.x} Y:{robotPos.y}
              </span>
              <span>
                Velocity: {isRunning ? "1.2 m/s" : "0.0 m/s"}
              </span>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={toggleMission}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-white shadow-lg transition-transform active:scale-95 ${
                  isRunning
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isRunning ? (
                  <>
                    <Square size={20} fill="currentColor" /> Pause
                  </>
                ) : (
                  <>
                    <Play size={20} fill="currentColor" /> Start Mission
                  </>
                )}
              </button>

              <button
                onClick={handleStop}
                className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <AlertOctagon size={20} /> Stop
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-lg">
              <span className="text-sm font-semibold text-slate-500 px-2">
                Mode:
              </span>
              {["Planting", "Weeding", "Surveying"].map((m) => (
                <button
                  key={m}
                  onClick={() => !isRunning && setMode(m)}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: BATTERY + STATS + LOGS */}
        <div className="space-y-6">
          {/* BATTERY & STATS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" /> Battery & Stats
            </h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-600">
                  Power Level
                </span>
                <span
                  className={`font-bold ${
                    battery < 20 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {Math.round(battery)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    battery < 20 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${battery}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-center">
                <p className="text-xs text-blue-400 font-bold uppercase">
                  Distance
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.distance}m
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-center">
                <p className="text-xs text-purple-400 font-bold uppercase">
                  {mode === "Weeding"
                    ? "Weeds"
                    : mode === "Planting"
                    ? "Seeds"
                    : "Data"}
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {mode === "Weeding"
                    ? stats.weeds
                    : mode === "Planting"
                    ? stats.plants
                    : stats.distance * 2}
                </p>
              </div>
            </div>
          </div>

          {/* LOGS */}
          <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl shadow-lg h-[400px] flex flex-col">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <ArrowUpRight size={18} /> Telemetry Logs
            </h3>

            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs custom-scrollbar"
            >
              {logs.length === 0 && (
                <p className="text-slate-600 text-center mt-10">
                  System ready. Waiting for commands...
                </p>
              )}
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex gap-3 border-l-2 pl-3 ${
                    log.type === "error"
                      ? "border-red-500 text-red-400"
                      : log.type === "alert"
                      ? "border-yellow-500 text-yellow-400"
                      : log.type === "success"
                      ? "border-green-500 text-green-400"
                      : "border-blue-500 text-slate-300"
                  }`}
                >
                  <span className="opacity-50 shrink-0">{log.time}</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotDashboard;
