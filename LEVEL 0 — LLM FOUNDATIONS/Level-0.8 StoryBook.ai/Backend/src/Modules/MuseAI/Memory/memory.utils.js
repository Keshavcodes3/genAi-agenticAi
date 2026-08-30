import { generateResponse } from "../ai.service.js";
import { autoProcessAndStoreMemory } from "./memory.service.js";
import convoModel from "../../MuseAI/convo.model.js";

export const handleIncomingMuseMessage = async (req, res) => {
    const userId = req.user.id;
    const { messageText, activeMode } = req.body;

    try {

        let convo = await convoModel.findOne({ userId });

        convo.messages.push({ role: "user", content: messageText, mode: activeMode });

        const museResponse = await generateResponse({ messages: convo.messages, mode: activeMode });

        convo.messages.push({ role: "assistant", content: museResponse, mode: activeMode });
        await convo.save();

        autoProcessAndStoreMemory(userId, convo._index, messageText);

        return res.status(200).json({ success: true, text: museResponse });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "The Muse is temporarily offline." });
    }
};