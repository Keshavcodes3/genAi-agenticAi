import express from "express";
import { getPlatformAnalytics } from "../Controllers/admin.controller.js";
import { IdentifyUser, RequireAdmin } from "../Middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/analytics", IdentifyUser, RequireAdmin, getPlatformAnalytics);

export default adminRouter;
