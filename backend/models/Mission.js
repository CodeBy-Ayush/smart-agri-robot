const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    missionName: { type: String, required: true },
    missionType: { type: String, enum: ["planting", "weeding", "surveying"], required: true },
    zones: [{ type: String }], // ["Zone 1", "Zone 3"]
    fieldName: { type: String }, // For display
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },

    status: {
        type: String,
        enum: ["Pending", "Running", "Completed", "Rejected"],
        default: "Pending",
    },

    // For Farmer dashboard & Robot sim
    progress: { type: Number, default: 0 },
    speed: { type: Number, default: 1.2 },
    weeds: { type: Number, default: 0 },
    timeLeft: { type: String, default: "30 min" },

    stats: {
        distance: { type: Number, default: 0 },
        weeds: { type: Number, default: 0 },
        plants: { type: Number, default: 0 },
    },

    assignedRobot: { type: mongoose.Schema.Types.ObjectId, ref: "Robot" },
}, { timestamps: true });

module.exports = mongoose.model("Mission", MissionSchema);