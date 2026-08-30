import { Router } from "express";
import {
    getMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    sendMessage,
    streamMessage,
} from "./message.controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.get("/chat/:chatId", authenticate, getMessages);
router.get("/:messageId", authenticate, getMessage);
router.post("/", authenticate, sendMessage);
router.post("/stream", authenticate, streamMessage);
router.patch("/:messageId", authenticate, updateMessage);
router.delete("/:messageId", authenticate, deleteMessage);

export default router;
