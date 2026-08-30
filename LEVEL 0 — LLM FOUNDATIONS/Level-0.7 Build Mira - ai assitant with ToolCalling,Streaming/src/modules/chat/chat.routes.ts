import { Router } from "express";
import { generateChat } from "./chat.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post(
    "/",
    authenticate,
    generateChat
);

export default router;
