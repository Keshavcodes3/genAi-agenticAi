import { updateProfile, deleteAccount, Logout } from "./setting.controller.js";
import express from 'express'
import { protect } from '../../Middlewares/protect.js'

const settingRoutes = express.Router()

settingRoutes.post('/deleteAccount', protect, deleteAccount)


settingRoutes.post('/update', protect, updateProfile)


settingRoutes.post('/logout', protect, Logout)


export default settingRoutes