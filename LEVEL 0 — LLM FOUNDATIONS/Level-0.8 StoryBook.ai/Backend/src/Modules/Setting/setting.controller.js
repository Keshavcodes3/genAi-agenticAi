import bcrypt from 'bcryptjs'
import { getAuthCookieOptions } from '../../Common/authCookieOptions.js';
import userModel from '../User/user.model.js'
import chatModel from '../../Modules/MuseAI/chat.model.js'
import poemModel from '../Poem/poem.model.js'
import storyModel from '../Story/story.model.js'
import blacklistModel from '../../Common/blackList.model.js'

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(401).json({
                message: "No user found"
            })
        }

        let { username, avatar, email, name, bio, theme } = req.body
        const data = await userModel.findByIdAndUpdate(userId, {
            $set: { username, email, avatar, name, bio, theme }
        }, { new: true })
        return res.status(200).json({
            message: "Profile updated successfully",
            data: data,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err?.message
        })
    }
}




export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select('+username')
        const { password } = req.body
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(400).json({
                message: "password mismatched",
                success: false
            })
        }

        await chatModel.deleteMany({ userId: userId })
        await poemModel.deleteMany({ userId: userId })
        await storyModel.deleteMany({ userId: userId })
        await userModel.findByIdAndDelete(userId);
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await blacklistModel.create({
                userId: userId,
                token: token
            });
        }
        return res.status(200).json({
            message: "Account deleted successfully",
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err?.message
        })
    }
}

export const Logout = async (req, res) => {
    try {
        const userId = req.user.id
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            await blacklistModel.create({
                userId: userId,
                token: token
            });
        }
        res.clearCookie('token', getAuthCookieOptions());
        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err?.message
        })
    }
}