import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

export const IdentifyUser = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
        })
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access",
            success: false,
            error: err.message
        })
    }
}

export const RequireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("role");

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
                success: false,
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message,
        });
    }
};
