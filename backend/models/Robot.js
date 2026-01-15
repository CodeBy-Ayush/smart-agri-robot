const mongoose = require("mongoose");

const RobotSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // e.g. "R-101"
    status: { type: String, enum: ["Active", "Idle", "Error"], default: "Idle" },
    battery: { type: Number, default: 100 },
    location: { type: String, default: "Charging Station" },
    task: { type: String, default: "Idle" },

    assignedFarmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    currentMission: { type: mongoose.Schema.Types.ObjectId, ref: "Mission" },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Robot", RobotSchema);
