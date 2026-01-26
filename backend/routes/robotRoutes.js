// backend/routes/robotRoutes----------
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const Mission = require("../models/Mission");
const Robot = require("../models/Robot");
const Notification = require("../models/Notification");


// --------------------------------------------------------
// 1. FARMER ROBOT STATUS
// --------------------------------------------------------
router.get("/status", auth, async (req, res) => {
    try {
        const farmerId = req.query.farmerId;

        const mission = await Mission.findOne({ farmer: farmerId })
            .sort({ createdAt: -1 })
            .populate("assignedRobot");

        const robot = mission?.assignedRobot || null;

        res.json({
            online: !!robot,
            battery: robot?.battery ?? 0,
            runtimeLeft: robot ? "30 min" : "—",
        });

    } catch (err) {
        console.error("ROBOT STATUS ERROR:", err);
        res.status(500).json({ msg: "Robot status error" });
    }
});


// ------------------------------------------------------
// 2. FARMER ACTIVE MISSION (Dashboard card)
// ------------------------------------------------------
router.get("/active-mission", auth, async (req, res) => {
    try {
        const farmerId = req.query.farmerId;

        const mission = await Mission.findOne({
            farmer: farmerId,
            status: { $in: ["Running", "Pending"] },
        }).sort({ createdAt: -1 });

        if (!mission) return res.json(null);

        res.json({
            missionName: mission.missionName,
            progress: mission.progress,
            speed: mission.speed,
            weeds: mission.weeds,
            timeLeft: mission.timeLeft,
        });

    } catch (err) {
        console.error("ACTIVE MISSION ERROR:", err);
        res.status(500).json({ msg: "Active mission error" });
    }
});


// -------------------------------------------------------
// 3. ROBOT DASHBOARD – MY ACTIVE MISSION + ROBOTS
// -------------------------------------------------------
router.get("/my-active", auth, async (req, res) => {
    try {
        const farmerId = req.user.id;

        const mission = await Mission.findOne({
            farmer: farmerId,
            status: "Running",
        })
            .populate("assignedRobot")
            .sort({ createdAt: -1 });

        if (!mission) {
            return res.json({ mission: null, robot: null });
        }

        const robot = mission.assignedRobot || null;

        res.json({
            mission: {
                _id: mission._id.toString(),
                missionName: mission.missionName,
                missionType: mission.missionType,
                zones: mission.zones,
                status: mission.status,
                fieldName: mission.fieldName,
                priority: mission.priority,
            },
            robot: robot
                ? {
                      _id: robot._id.toString(),
                      code: robot.code,
                      battery: robot.battery,
                      status: robot.status,
                  }
                : null,
        });

    } catch (err) {
        console.error("MY ACTIVE ERROR:", err);
        res.status(500).json({ msg: "My active mission error" });
    }
});


// ------------------------------------------------------
// 4. START MISSION (RobotDashboard Start Button)
// ------------------------------------------------------
router.post("/start-mission", auth, async (req, res) => {
    try {
        const { missionId } = req.body;

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ msg: "Mission not found" });

        if (mission.status !== "Running") {
            mission.status = "Running";
            await mission.save();
        }

        res.json({ msg: "Mission started", mission });

    } catch (err) {
        console.error("START MISSION ERROR:", err);
        res.status(500).json({ msg: "Start mission error" });
    }
});


// ------------------------------------------------------
// 5. MISSION COMPLETE (Robot ends simulation)
// ------------------------------------------------------
router.post("/mission-complete", auth, async (req, res) => {
    try {
        const { missionId, stats } = req.body;

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ msg: "Mission not found" });

        mission.status = "Completed";
        mission.progress = 100;
        mission.stats = stats || mission.stats;

        // Free the robot
        if (mission.assignedRobot) {
            await Robot.findByIdAndUpdate(mission.assignedRobot, {
                status: "Idle",
                currentMission: null,
                task: "Idle",
                location: "Charging Station",
            });
        }

        await mission.save();

        await Notification.create({
            farmer: mission.farmer,
            message: `Mission "${mission.missionName}" completed successfully.`,
        });

        res.json({ msg: "Mission marked completed", mission });

    } catch (err) {
        console.error("MISSION COMPLETE ERROR:", err);
        res.status(500).json({ msg: "Mission complete error" });
    }
});


// ------------------------------------------------------
// 6. ABORT MISSION (Emergency Stop)
// ------------------------------------------------------
router.post("/abort-mission", auth, async (req, res) => {
    try {
        const { missionId } = req.body;

        const mission = await Mission.findById(missionId);
        if (!mission) return res.status(404).json({ msg: "Mission not found" });

        mission.status = "Rejected";
        mission.progress = 0;

        if (mission.assignedRobot) {
            await Robot.findByIdAndUpdate(mission.assignedRobot, {
                status: "Idle",
                currentMission: null,
                task: "Idle",
                location: "Charging Station",
            });
        }

        await mission.save();

        await Notification.create({
            farmer: mission.farmer,
            message: `Mission "${mission.missionName}" was aborted by user.`,
        });

        res.json({ msg: "Mission aborted", mission });

    } catch (err) {
        console.error("ABORT MISSION ERROR:", err);
        res.status(500).json({ msg: "Abort mission error" });
    }
});

module.exports = router;
