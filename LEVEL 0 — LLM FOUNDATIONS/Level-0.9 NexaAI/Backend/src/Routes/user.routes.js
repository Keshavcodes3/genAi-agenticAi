import express from "express";
import { registerUser, loginUser, getUser, logoutUser } from "../Controllers/user.controller.js";
import { IdentifyUser } from "../Middlewares/auth.middleware.js";
import { authRateLimit } from "../Middlewares/rateLimit.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", authRateLimit, registerUser);
authRouter.post("/login", authRateLimit, loginUser);
authRouter.get("/user", IdentifyUser, getUser);
authRouter.post("/logout", IdentifyUser, logoutUser)

export default authRouter;
