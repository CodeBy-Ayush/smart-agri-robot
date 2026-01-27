const express = require("express");
const router = express.Router();
const Mission = require("../models/Mission");
const { auth } = require("../middleware/auth");

// CREATE mission
router.post("/create", auth, async(req, res) => {
    try {
        const { farmerId, missionName, missionType, zones, fieldName, priority } = req.body;

        const mission = await Mission.create({
            farmer: farmerId,
            missionName,
            missionType,
            zones,
            fieldName,
            priority,
            status: "Pending",
        });

        res.json({ msg: "Mission created", mission });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.get("/my", auth, async(req, res) => {
    try {
        const missions = await Mission.find({ farmer: req.user.id }).sort({ createdAt: -1 });
        return res.json({ missions });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
