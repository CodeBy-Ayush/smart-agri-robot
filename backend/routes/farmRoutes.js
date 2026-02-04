//Farm Routes for farmer
const express = require("express");
const router = express.Router();
const FarmHealth = require("../models/FarmHealth");
const Task = require("../models/Task");

// GET /api/farm/health?farmerId
router.get("/health", async(req, res) => {
    try {
        const farmerId = req.query.farmerId;
        if (!farmerId) return res.status(400).json({ msg: "farmerId required" });

        let health = await FarmHealth.findOne({ farmer: farmerId });

        // Agar nahi hai, ek default record bana do uske liye
        if (!health) {
            health = await FarmHealth.create({ farmer: farmerId });
        }

        res.json({
            healthScore: health.healthScore,
            soilStatus: health.soilStatus,
            soilMoisture: health.soilMoisture,
        });
    } catch (err) {
        res.status(500).json({ msg: "Farm health error", error: err.message });
    }
});

// GET /api/tasks/today?farmerId=
router.get("/tasks/today", async(req, res) => {
    try {
        const farmerId = req.query.farmerId;
        if (!farmerId) return res.status(400).json({ msg: "farmerId required" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tasks = await Task.find({
            farmer: farmerId,
            createdAt: { $gte: today },
        }).sort({ createdAt: 1 });

        // Agar empty hai, kuch default tasks daal do ek baar ke liye
        if (tasks.length === 0) {
            const defaults = await Task.insertMany([{
                    farmer: farmerId,
                    task: "Check irrigation in North field",
                    time: "4:00 PM",
                },
                {
                    farmer: farmerId,
                    task: "Inspect pest traps",
                    time: "6:00 PM",
                },
            ]);
            return res.json(defaults);
        }

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: "Tasks error", error: err.message });
    }
});

module.exports = router;
