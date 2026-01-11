require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/aiRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const farmRoutes = require("./routes/farmRoutes");
const robotRoutes = require("./routes/robotRoutes");
const adminRoutes = require("./routes/adminRoutes");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Auto Admin create  (admin IS Fixed)
mongoose.connection.once("open", async() => {
    try {
        const adminEmail = "admin@gmail.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin", 10);
            const adminUser = new User({
                username: "Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            await adminUser.save();
            console.log("👑 Admin Account Created: admin@gmail.com / admin");
        } else {
            console.log("✅ Admin Account Already Exists");
        }
    } catch (err) {
        console.error("Admin creation failed:", err);
    }
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/farm", farmRoutes);
app.use("/api/robot", robotRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/missions", require("./routes/missionRoutes"));

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
