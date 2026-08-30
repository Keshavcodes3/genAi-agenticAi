import mongoose from "mongoose";
import ConversationModel from "../Models/conversation.model.js";
import chatModel from "../Models/chat.model.js";
import { generateChatTitle, generateMessageResponse } from "../Services/ai.services.js";

const VALID_MODES = new Set(["casual", "explanation", "roadmap"]);

const normalizeMode = (mode = "casual") => {
    const normalized = String(mode).trim().toLowerCase();

    if (normalized === "ask anything") return "casual";
    if (normalized === "explain") return "explanation";
    if (VALID_MODES.has(normalized)) return normalized;

    return "casual";
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendStreamError = (res, err) => {
    const message = err?.message || "Something went wrong";

    if (!res.headersSent) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? message : "Something went wrong",
        });
    }

    res.write(JSON.stringify({ type: "error", error: message }) + "\n");
    return res.end();
};

const setStreamHeaders = (res) => {
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
};

export const createEmptyConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const mode = normalizeMode(req.body.mode);

        const conversation = await ConversationModel.create({
            user: userId,
            title: "New Chat",
            mode,
        });

        return res.status(201).json({
            message: "Conversation created",
            conversationId: conversation._id,
            conversation,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};

export const createFirstConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const message = String(req.body.message || "").trim();
        const mode = normalizeMode(req.body.mode);

        if (!message) {
            return res.status(400).json({
                message: "Message should be greater than one char",
                success: false,
            });
        }

        const title = generateChatTitle({ message });

        const conversation = await ConversationModel.create({
            user: userId,
            title,
            mode,
        });

        const userMessage = await chatModel.create({
            conversationId: conversation._id,
            role: "user",
            content: message,
        });

        setStreamHeaders(res);

        res.write(JSON.stringify({
            type: "start",
            title,
            mode,
            conversationId: conversation._id,
        }) + "\n");

        const result = await generateMessageResponse({
            messages: [{ role: "user", content: message }],
            res,
            mode,
        });

        const AIMessage = await chatModel.create({
            conversationId: conversation._id,
            role: "ai",
            content: result,
        });

        res.write(JSON.stringify({
            type: "done",
            message: "New conversation created",
            title,
            mode,
            conversationId: conversation._id,
            conversation,
            content: {
                AIMessage,
                userMessage,
            },
            success: true,
        }) + "\n");

        return res.end();
    } catch (err) {
        return sendStreamError(res, err);
    }
};

export const takeFollowUp = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const message = String(req.body.message || "").trim();

        if (!conversationId || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                message: "No conversation found",
                success: false,
            });
        }

        if (!message) {
            return res.status(400).json({
                message: "No message provided",
                success: false,
            });
        }

        const conversation = await ConversationModel.findOne({
            _id: conversationId,
            user: userId,
        });

        if (!conversation) {
            return res.status(404).json({
                message: "No conversation found",
                success: false,
            });
        }

        const existingMessageCount = await chatModel.countDocuments({ conversationId });
        const title = existingMessageCount === 0 ? generateChatTitle({ message }) : conversation.title;

        if (existingMessageCount === 0 && conversation.title !== title) {
            conversation.title = title;
            await conversation.save();
        }

        const userMessage = await chatModel.create({
            conversationId,
            role: "user",
            content: message,
        });

        const allMessages = await chatModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .select("role content")
            .lean();

        setStreamHeaders(res);

        const mode = normalizeMode(conversation.mode);
        const result = await generateMessageResponse({
            messages: allMessages,
            res,
            mode,
        });

        const AIMessage = await chatModel.create({
            conversationId,
            role: "ai",
            content: result,
        });

        res.write(JSON.stringify({
            type: "done",
            message: "Message created",
            title,
            mode,
            conversationId,
            conversation,
            content: {
                AIMessage,
                userMessage,
            },
            success: true,
        }) + "\n");

        return res.end();
    } catch (err) {
        return sendStreamError(res, err);
    }
};

export const updateConversationMode = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const mode = normalizeMode(req.body.mode);

        if (!conversationId || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                message: "No conversation found",
                success: false,
            });
        }

        const conversation = await ConversationModel.findOneAndUpdate(
            { _id: conversationId, user: userId },
            { mode },
            { new: true }
        );

        if (!conversation) {
            return res.status(404).json({
                message: "No conversation found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Conversation mode updated",
            conversationId: conversation._id,
            mode: conversation.mode,
            conversation,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};

export const deleteConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        if (!conversationId || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                message: "No conversation found",
                success: false,
            });
        }

        const conversation = await ConversationModel.findOneAndDelete({
            _id: conversationId,
            user: userId,
        });

        if (!conversation) {
            return res.status(404).json({
                message: "No conversation found",
                success: false,
            });
        }

        await chatModel.deleteMany({ conversationId });

        return res.status(200).json({
            message: "Conversation deleted successfully",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};

export const getAllConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await ConversationModel.find({ user: userId })
            .sort({ updatedAt: -1, createdAt: -1 })
            .select("title mode createdAt updatedAt")
            .lean();

        const allConversations = conversations.map((convo) => ({
            convoId: convo._id,
            convo: convo.title,
            mode: normalizeMode(convo.mode),
            createdAt: convo.createdAt,
            updatedAt: convo.updatedAt,
        }));

        return res.status(200).json({
            message: "All conversations fetched successfully",
            allConversations,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};

export const getOneConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        if (!conversationId || !isValidObjectId(conversationId)) {
            return res.status(400).json({
                message: "No conversation found",
                success: false,
            });
        }

        const conversation = await ConversationModel.findOne({
            _id: conversationId,
            user: userId,
        }).lean();

        if (!conversation) {
            return res.status(404).json({
                message: "No conversation found",
                success: false,
            });
        }

        const messages = await chatModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .select("role content createdAt")
            .lean();

        return res.status(200).json({
            message: "Conversation fetched successfully",
            title: conversation.title,
            mode: normalizeMode(conversation.mode),
            conversationId: conversation._id,
            conversation,
            chats: messages,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};

const startOfDay = (date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
};

const startOfWeek = (date) => {
    const value = startOfDay(date);
    const day = value.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    value.setDate(value.getDate() + diff);
    return value;
};

const startOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const formatMonthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildDailyBuckets = (messages, days = 7) => {
    const today = startOfDay(new Date());
    const buckets = [];

    for (let index = days - 1; index >= 0; index -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - index);
        buckets.push({
            key: formatDateKey(date),
            label: date.toLocaleDateString("en-US", { weekday: "short" }),
            messages: 0,
            userMessages: 0,
            aiMessages: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    messages.forEach((message) => {
        if (!message.createdAt) return;

        const key = formatDateKey(startOfDay(message.createdAt));
        const bucket = bucketByKey.get(key);
        if (!bucket) return;

        bucket.messages += 1;
        if (message.role === "user") bucket.userMessages += 1;
        if (message.role === "ai") bucket.aiMessages += 1;
    });

    return buckets;
};

const buildWeeklyBuckets = (messages, weeks = 8) => {
    const thisWeek = startOfWeek(new Date());
    const buckets = [];

    for (let index = weeks - 1; index >= 0; index -= 1) {
        const date = new Date(thisWeek);
        date.setDate(thisWeek.getDate() - index * 7);
        buckets.push({
            key: formatDateKey(date),
            label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            messages: 0,
            userMessages: 0,
            aiMessages: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    messages.forEach((message) => {
        if (!message.createdAt) return;

        const key = formatDateKey(startOfWeek(message.createdAt));
        const bucket = bucketByKey.get(key);
        if (!bucket) return;

        bucket.messages += 1;
        if (message.role === "user") bucket.userMessages += 1;
        if (message.role === "ai") bucket.aiMessages += 1;
    });

    return buckets;
};

const buildMonthlyBuckets = (messages, months = 6) => {
    const thisMonth = startOfMonth(new Date());
    const buckets = [];

    for (let index = months - 1; index >= 0; index -= 1) {
        const date = new Date(thisMonth);
        date.setMonth(thisMonth.getMonth() - index);
        buckets.push({
            key: formatMonthKey(date),
            label: date.toLocaleDateString("en-US", { month: "short" }),
            messages: 0,
            userMessages: 0,
            aiMessages: 0,
        });
    }

    const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    messages.forEach((message) => {
        if (!message.createdAt) return;

        const key = formatMonthKey(startOfMonth(message.createdAt));
        const bucket = bucketByKey.get(key);
        if (!bucket) return;

        bucket.messages += 1;
        if (message.role === "user") bucket.userMessages += 1;
        if (message.role === "ai") bucket.aiMessages += 1;
    });

    return buckets;
};

export const getUsageAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await ConversationModel.find({ user: userId })
            .select("_id mode projectId createdAt")
            .lean();

        const conversationIds = conversations.map((conversation) => conversation._id);
        const messages = conversationIds.length
            ? await chatModel
                .find({ conversationId: { $in: conversationIds } })
                .select("conversationId role createdAt")
                .lean()
            : [];

        const modeCounts = conversations.reduce((acc, conversation) => {
            const mode = normalizeMode(conversation.mode);
            acc[mode] = (acc[mode] || 0) + 1;
            return acc;
        }, {});

        const projectConversationCount = conversations.filter(
            (conversation) => conversation.projectId
        ).length;

        return res.status(200).json({
            message: "Usage analytics fetched successfully",
            success: true,
            data: {
                totals: {
                    conversations: conversations.length,
                    messages: messages.length,
                    userMessages: messages.filter((message) => message.role === "user").length,
                    aiMessages: messages.filter((message) => message.role === "ai").length,
                    projectConversations: projectConversationCount,
                },
                byMode: {
                    casual: modeCounts.casual || 0,
                    explanation: modeCounts.explanation || 0,
                    roadmap: modeCounts.roadmap || 0,
                },
                daily: buildDailyBuckets(messages),
                weekly: buildWeeklyBuckets(messages),
                monthly: buildMonthlyBuckets(messages),
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: process.env.MODE === "dev" ? err.message : "Something went wrong",
        });
    }
};
