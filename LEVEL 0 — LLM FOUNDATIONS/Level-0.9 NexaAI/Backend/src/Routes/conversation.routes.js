import express from "express";
import {
    createEmptyConversation,
    createFirstConversation,
    deleteConversation,
    getAllConversations,
    getOneConversation,
    getUsageAnalytics,
    takeFollowUp,
    updateConversationMode,
} from "../Controllers/conversation.controller.js";
import { IdentifyUser } from "../Middlewares/auth.middleware.js";
import { chatRateLimit } from "../Middlewares/rateLimit.middleware.js";

const conversationRouter = express.Router();

conversationRouter.post("/", IdentifyUser, chatRateLimit, createFirstConversation);
conversationRouter.post("/empty", IdentifyUser, createEmptyConversation);
conversationRouter.post("/sendMessage/:conversationId", IdentifyUser, chatRateLimit, takeFollowUp);
conversationRouter.patch("/:conversationId/mode", IdentifyUser, updateConversationMode);
conversationRouter.delete("/delete/:conversationId", IdentifyUser, deleteConversation);
conversationRouter.get("/all", IdentifyUser, getAllConversations);
conversationRouter.get("/analytics/usage", IdentifyUser, getUsageAnalytics);
conversationRouter.get("/:conversationId", IdentifyUser, getOneConversation);

export default conversationRouter;
