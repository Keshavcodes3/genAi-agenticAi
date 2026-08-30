import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { invokeGemini } from '../../../config/gemini.js';
import memoryModel from './memory.model.js';

export const autoProcessAndStoreMemory = async (userId, sessionId, userMessageText) => {
    try {
        const systemPrompt = `
            You are a backend background data extraction engine. 
            Analyze the incoming text from a writer and determine if they are stating a permanent preference, lore element, theme, or writing style flaw.
            Ignore casual chatter like "hi", "how are you", or everyday routine remarks. Only pull out things relevant to their creative writing persona.

            If relevant data is found, you MUST respond with a valid JSON object in this exact layout. Do not add markdown wraps, triple backticks, or extra text:
            {
                "hasRelevantData": true,
                "category": "Choose one: writing-style | character-lore | themes | structural-flaws",
                "extractedInsights": ["A short, clear summary string of the insight discovered"]
            }

            If the text contains nothing relevant to long-term writing memory, return:
            {
                "hasRelevantData": false,
                "category": "none",
                "extractedInsights": []
            }
        `;

        const cleanContent = (
            await invokeGemini(
                [
                    new SystemMessage(systemPrompt),
                    new HumanMessage(`Analyze this user message text: "${userMessageText.slice(0, 500)}"`),
                ],
                { temperature: 0.2, maxOutputTokens: 512 }
            )
        ).trim();

        let jsonText = cleanContent;
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        }

        const analysis = JSON.parse(jsonText);

        if (!analysis.hasRelevantData || !analysis.extractedInsights?.length) {
            return { success: true, message: 'No persistent data found in this message turn.' };
        }

        const updatedMemory = await memoryModel.findOneAndUpdate(
            {
                userID: userId,
                memoryType: analysis.category,
            },
            {
                $addToSet: { data: { $each: analysis.extractedInsights } },
                $set: { sourceSessionId: sessionId },
            },
            {
                new: true,
                upsert: true,
            }
        );

        console.log(`[Auto-Memory]: Successfully stashed to "${analysis.category}" for user ${userId}`);
        return { success: true, data: updatedMemory };
    } catch (err) {
        console.error('Auto-Memory Processing Failed:', err.message);
        return { success: false, error: err.message };
    }
};
