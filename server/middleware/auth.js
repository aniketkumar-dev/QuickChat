import User from "../models/User.js";
import jwt from "jsonwebtoken";

const DEFAULT_JWT_SECRET = "2930e9f869d04d77a5f8a2821b703fd9e7df2a6f55738e9dd8749e08a103dc94";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: "No authentication token provided"
            });
        }

        const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);

        res.json({
            success: false,
            message: error.message
        });
    }
};
