// backend/routes/notificationRoutes.js

const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Fetch notifications for farmer
router.get("/", async(req, res) => {
    try {
        const farmerId = req.query.farmerId;

        if (!farmerId) {
            return res.status(400).json({ error: "farmerId is required" });
        }

        const notifications = await Notification.find({ farmer: farmerId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(notifications);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;