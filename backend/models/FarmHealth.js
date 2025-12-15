const mongoose = require("mongoose");

const FarmHealthSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    healthScore: { type: Number, default: 85 }, // %
    soilStatus: { type: String, default: "Soil moisture optimal, nutrients balanced." },
    soilMoisture: { type: String, default: "Optimal" },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("FarmHealth", FarmHealthSchema);