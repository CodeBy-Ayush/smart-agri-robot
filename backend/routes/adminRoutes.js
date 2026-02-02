// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");

const User = require("../models/User");
const Mission = require("../models/Mission");
const Robot = require("../models/Robot");
const Notification = require("../models/Notification");

// ---------------- STATS (Admin Dashboard) ----------------
// GET /api/admin/stats
router.get("/stats", auth, isAdmin, async(req, res) => {
    try {
        const totalFarmers = await User.countDocuments({ role: "farmer" });
        const pendingMissions = await Mission.countDocuments({ status: "Pending" });
        const activeRobots = await Robot.countDocuments({ status: "Active" });

        res.json({
            totalFarmers,
            pendingMissions,
            activeRobots,
            systemHealth: "98%", // simple static for now
        });
    } catch (err) {
        console.error("STATS ERROR:", err);
        res.status(500).json({ msg: "Stats error", error: err.message });
    }
});

// ---------------- RECENT ACTIVITY (Admin Dashboard) ----------------
// GET /api/admin/activity
router.get("/activity", auth, isAdmin, async(req, res) => {
    try {
        const missions = await Mission.find()
            .populate("farmer", "username")
            .sort({ createdAt: -1 })
            .limit(5);

        const robots = await Robot.find()
            .sort({ updatedAt: -1 })
            .limit(3);

        const activity = [];

        missions.forEach((m) => {
            activity.push({
                type: m.status === "Pending" ?
                    "mission" :
                    m.status === "Completed" ?
                    "success" :
                    m.status === "Rejected" ?
                    "alert" :
                    "mission",
                text: `Mission "${m.missionName}" (${m.missionType}) by ${
          m.farmer?.username || "Unknown"
        } is ${m.status}.`,
                time: m.createdAt,
            });
        });

        robots.forEach((r) => {
            activity.push({
                type: r.status === "Error" ? "alert" : "robot",
                text: `Robot ${r.code} status: ${r.status} (${r.battery}% battery)`,
                time: r.updatedAt,
            });
        });

        // sort latest first
        activity.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json({ activity });
    } catch (err) {
        console.error("ACTIVITY ERROR:", err);
        res.status(500).json({ msg: "Activity error", error: err.message });
    }
});

// ---------------- MISSIONS LIST (for Mission Controls) ----------------
// GET /api/admin/missions
router.get("/missions", auth, isAdmin, async(req, res) => {
    try {
        const missions = await Mission.find()
            .populate("farmer", "username email")
            .populate("assignedRobot", "code status")
            .sort({ createdAt: -1 });

        // Frontend ko clean shape
        const mapped = missions.map((m) => ({
            id: m._id.toString(),
            missionName: m.missionName,
            farmerName: m.farmer ? m.farmer.username : "Unknown",
            type: m.missionType, // planting | weeding | surveying
            zones: m.zones || [],
            fieldName: m.fieldName || "",
            status: m.status,
            priority: m.priority,
            createdAt: m.createdAt,
            assignedRobot: m.assignedRobot ?
                { id: m.assignedRobot._id, code: m.assignedRobot.code } :
                null,
        }));

        res.json({ missions: mapped });
    } catch (err) {
        console.error("MISSIONS ERROR:", err);
        res.status(500).json({ msg: "Missions error", error: err.message });
    }
});

// ---------------- UPDATE MISSION STATUS + AUTO ASSIGN ROBOT ---------------
// PATCH /api/admin/missions/:id/status
router.patch("/missions/:id/status", auth, isAdmin, async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let mission = await Mission.findById(id);
        if (!mission) {
            return res.status(404).json({ msg: "Mission not found" });
        }

        mission.status = status;

        // If admin APPROVES -> Running + assign robot if none
        let assignedRobot = null;
        if (status === "Running") {
            if (!mission.assignedRobot) {
                assignedRobot = await Robot.findOneAndUpdate({ status: "Idle" }, { status: "Active", currentMission: mission._id }, { new: true });

                if (!assignedRobot) {
                    return res
                        .status(400)
                        .json({ msg: "No idle robot available to assign." });
                }

                mission.assignedRobot = assignedRobot._id;
            }
        }

        // If mission REJECTED or COMPLETED -> free robot
        if (status === "Rejected" || status === "Completed") {
            if (mission.assignedRobot) {
                await Robot.findByIdAndUpdate(mission.assignedRobot, {
                    status: "Idle",
                    currentMission: null,
                    task: "Idle",
                    location: "Charging Station",
                });
            }
        }

        await mission.save();

        // Notification to farmer
        await Notification.create({
            farmer: mission.farmer,
            message: `Your mission "${mission.missionName}" is now ${status}.`,
        });

        res.json({
            msg: "Mission status updated",
            mission,
            assignedRobot,
        });
    } catch (err) {
        console.error("MISSION UPDATE ERROR:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// ---------------- USERS (User Management) ----------------
router.get("/users", auth, isAdmin, async(req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(
            users.map((u) => ({
                _id: u._id,
                name: u.username,
                email: u.email,
                role: u.role,
                status: u.isBlocked ? "Blocked" : "Active",
                joinDate: u.createdAt.toISOString().split("T")[0],
            }))
        );
    } catch (err) {
        res.status(500).json({ msg: "Users error", error: err.message });
    }
});

// Block/unblock
router.patch("/users/:id/status", auth, isAdmin, async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ msg: "User status updated" });
    } catch (err) {
        res
            .status(500)
            .json({ msg: "Update user status error", error: err.message });
    }
});

// Delete user
router.delete("/users/:id", auth, isAdmin, async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: "User deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Delete user error", error: err.message });
    }
});

// ---------------- ROBOTS (Robot Fleet) ----------------
// GET /api/admin/robots
router.get("/robots", auth, isAdmin, async(req, res) => {
    try {
        const robots = await Robot.find().sort({ updatedAt: -1 });
        res.json({ robots });
    } catch (err) {
        res.status(500).json({ msg: "Robots error", error: err.message });
    }
});

// POST /api/admin/robots/create
router.post("/robots/create", auth, isAdmin, async(req, res) => {
    try {
        const { code } = req.body;

        if (!code) return res.status(400).json({ msg: "Robot code is required" });

        const exists = await Robot.findOne({ code });
        if (exists) return res.status(400).json({ msg: "Robot already exists" });

        const robot = await Robot.create({
            code,
            status: "Idle",
            battery: 100,
            location: "Charging Station",
            task: "Idle",
        });

        res.json({ msg: "Robot added", robot });
    } catch (err) {
        res.status(500).json({ msg: "Create robot error", error: err.message });
    }
});

// ---------------- ANALYTICS ----------------
// GET /api/admin/analytics/missions
router.get("/analytics/missions", auth, isAdmin, async(req, res) => {
    try {
        const missions = await Mission.find();

        const result = {
            completed: missions.filter((m) => m.status === "Completed").length,
            failed: missions.filter((m) => m.status === "Rejected").length,
            pending: missions.filter((m) => m.status === "Pending").length,
            running: missions.filter((m) => m.status === "Running").length,
            total: missions.length,
        };

        res.json(result);
    } catch (err) {
        res
            .status(500)
            .json({ msg: "Analytics error", error: err.message });
    }
});

module.exports = router;
