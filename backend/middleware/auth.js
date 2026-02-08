//MongoDb Connection from atlas
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async(req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

const isAdmin = async(req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ msg: "Admin access only" });
    }
    next();
};

module.exports = { auth, isAdmin };
