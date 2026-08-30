import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const toSafeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    avatar: user.avatar,
    role: user.role,
});

export const registerUser = async (req, res) => {
    const { name, email, password, avatar } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
            avatar,
        });

        return res.status(201).json({
            message: "User created successfully. You can log in now.",
            user: toSafeUser(user),
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error?.message,
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            user: toSafeUser(user),
            token,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error?.message,
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
     
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).json({
            message: "Logout successful",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error?.message,
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User found", user: toSafeUser(user) });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error?.message,
        });
    }
};
