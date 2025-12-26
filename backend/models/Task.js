//Automactic Assign Task For Robot
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true },
    time: { type: String, default: "Today" }, // e.g. "4:00 PM"
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
