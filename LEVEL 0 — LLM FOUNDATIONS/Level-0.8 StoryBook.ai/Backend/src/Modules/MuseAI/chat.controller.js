import chatModel from "./chat.model.js";
import convoModel from "./convo.model.js";
import userModel from "../User/user.model.js";
import memoryModel from "./Memory/memory.model.js";
import { generateResponse } from "./ai.service.js";
import { autoProcessAndStoreMemory } from "./Memory/memory.service.js";

/**
 * Shared helper to retrieve the active 1:1 conversation.
 * Automatically wipes any messages older than 24 hours from the database and convo document.
 * If the conversation becomes empty, seeds the default Muse welcome message.
 */
async function getActiveConversation(userId, username) {
    // 1:1 atomic conversation upsert
    let convo = await convoModel.findOneAndUpdate(
        { userId },
        {},
        { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('messages');

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredMessageIds = [];
    const activeMessages = [];

    if (convo.messages && convo.messages.length > 0) {
        for (const msg of convo.messages) {
            if (msg) {
                if (msg.createdAt < twentyFourHoursAgo) {
                    expiredMessageIds.push(msg._id);
                } else {
                    activeMessages.push(msg);
                }
            }
        }
    }

    let modified = false;

    // Delete expired messages from the database
    if (expiredMessageIds.length > 0) {
        await chatModel.deleteMany({ _id: { $in: expiredMessageIds } });
        convo.messages = activeMessages.map(msg => msg._id);
        modified = true;
    }

    // Seed greeting if no active messages remain
    if (activeMessages.length === 0) {
        const greeting = await chatModel.create({
            userId,
            role: 'assistant',
            content: `Greetings, ${username || 'writer'}. I am your Muse. Let's weave your thoughts into realities. What are we exploring today?`,
            mode: 'chat'
        });
        convo.messages = [greeting._id];
        modified = true;
    }

    if (modified) {
        await convo.save();
        await convo.populate('messages');
    }

    return convo;
}

export const startChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select('+username');

        if (!user) {
            return res.status(444).json({
                success: false,
                message: "User context not found."
            });
        }

        const convo = await getActiveConversation(userId, user.username);

        return res.status(200).json({
            success: true,
            message: "Continuous Muse thread retrieved successfully.",
            data: convo
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during session initialization.",
            error: err?.message
        });
    }
};

export const retriveContent = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select('+username');

        if (!user) {
            return res.status(444).json({
                success: false,
                message: "User context not found."
            });
        }

        const convo = await getActiveConversation(userId, user.username);

        return res.status(200).json({
            success: true,
            data: convo
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during content retrieval.",
            error: err?.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { text, activeMode } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message payload cannot be empty."
            });
        }

        const user = await userModel.findById(userId).select('+username');
        if (!user) {
            return res.status(444).json({
                success: false,
                message: "User context not found."
            });
        }

        // 1. Get active conversation session (and ensure it's seeded/cleaned)
        const convo = await getActiveConversation(userId, user.username);

        // 2. Save user message in database
        const userChat = await chatModel.create({
            userId,
            role: 'user',
            content: text,
            mode: activeMode || 'chat'
        });

        // 3. Link user message to conversation
        convo.messages.push(userChat._id);
        await convo.save();

        // 4. Retrieve refreshed list of messages to pass down to AI pipeline
        const refreshedConvo = await convoModel.findById(convo._id).populate('messages');

        // 5. Generate reply using LangChain pipeline
        const museAiReplyString = await generateResponse({
            messages: refreshedConvo.messages,
            mode: activeMode || 'chat'
        });

        // 6. Save AI message in database
        const aiChat = await chatModel.create({
            userId,
            role: 'assistant',
            content: museAiReplyString,
            mode: activeMode || 'chat'
        });

        // 7. Link AI reply to conversation
        convo.messages.push(aiChat._id);
        await convo.save();

        // 8. Launch Memory Extraction asynchronously in background (without blocking response)
        setImmediate(() => {
            autoProcessAndStoreMemory(userId, convo._id, text)
                .then(result => {
                    if (result && result.success && result.data) {
                        console.log(`[Auto-Memory]: Successfully stored insight for ${userId}`);
                    }
                })
                .catch(err => {
                    console.error("[Auto-Memory] Background extraction failed:", err.message);
                });
        });

        return res.status(200).json({
            success: true,
            text: museAiReplyString
        });

    } catch (err) {
        const status = err.status || 500;
        const isQuota = err.type === 'quota' || status === 429;

        return res.status(isQuota ? 429 : status).json({
            success: false,
            message: err.message || 'Internal server error during message delivery loop.',
            retryAfterSeconds: err.retryAfterSeconds,
            ...(process.env.NODE_ENV !== 'production' && { error: err?.message }),
        });
    }
};

/**
 * Retrieves the permanent memory bank extracted for the user.
 */
export const getMemory = async (req, res) => {
    try {
        const userId = req.user.id;
        const memories = await memoryModel.find({ userID: userId });

        return res.status(200).json({
            success: true,
            data: memories
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user memories.",
            error: err?.message
        });
    }
};