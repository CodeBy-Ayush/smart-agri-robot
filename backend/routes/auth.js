const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (Farmer)
router.post("/register", async(req, res) => {
    const { username, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        

        const user = new User({
            username,
            email,
            password: hashed,
            role: "farmer",
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" }
        );

        res.status(201).json({
            msg: "Farmer registered successfully",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// LOGIN
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid email or password" });

        if (user.isBlocked)
            return res.status(403).json({ msg: "Your account is blocked. Contact admin." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET || "secretkey", { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;