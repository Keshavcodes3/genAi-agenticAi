import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { invokeGemini, classifyGeminiError } from '../../config/gemini.js';
import { getPrompt } from './prompt.js';
import storyModel from '../Story/story.model.js';
import poemModel from '../Poem/poem.model.js';
export const processEditorAiAction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storyId, fullStoryContent, actionType, textTarget, styleConfig, prompt, type } = req.body;

        if (!fullStoryContent && !prompt) {
            return res.status(400).json({
                success: false,
                message: "No text content or prompt provided."
            });
        }

        const activeVibe = styleConfig?.vibe || "Neutral";
        const activeGenre = styleConfig?.genre || "General Fiction";
        const isPoetry =
            activeGenre.toLowerCase().includes("poetry") ||
            activeGenre.toLowerCase().includes("verse") ||
            activeGenre.toLowerCase().includes("poem");

        const systemInstruction = isPoetry
            ? `You are an elite, world-class poet and avant-garde literary collaborator.
               Your absolute directive is to match the user's creative focus perfectly:
               - CURRENT VIBE/MOOD: ${activeVibe}
               - POETIC STYLE/GENRE: ${activeGenre}

               CRITICAL FORMATTING RULES:
               1. Preserve structural spacing: Return your lines with exact intentional line breaks (\\n) and stanza separations.
               2. Do NOT write prose paragraphs. Focus on rhythm, meter, imagery, and line-level cadence.
               3. Return ONLY the raw poetic lines requested. Do not include conversational remarks, markdown titles, or introductory polite text.
               4. Ensure the poetry is deeply heartwarming, evocative, and touches the soul.`
            : `You are an elite literary co-author and ghostwriter embedded directly inside a rich-text editor.
               Your absolute directive is to match the user's target style perfectly:
               - CURRENT VIBE/MOOD: ${activeVibe}
               - TARGET GENRE: ${activeGenre}

               CRITICAL FORMATTING RULE: Return ONLY the raw text modifications requested. Do not include conversational remarks, pleasantries, markdown titles, quotes, or conversational intros.
               Ensure the generated story content is richly detailed, immersive, and naturally long.`;


        const humanInstruction = getPrompt({ actionType, fullStoryContent, textTarget, prompt });


        const finalizedAiText = (
            await invokeGemini(
                [new SystemMessage(systemInstruction), new HumanMessage(humanInstruction)],
                { temperature: isPoetry ? 0.9 : 0.75, maxOutputTokens: 2048 }
            )
        ).trim();

        // We do not save to DB here to avoid race conditions. 
        // The frontend will call triggerAutoSave with the new complete text.

        return res.status(200).json({
            success: true,
            aiResultText: finalizedAiText
        });

    } catch (err) {
        const info = classifyGeminiError(err);
        const status = err.status || info.status || 500;

        return res.status(status).json({
            success: false,
            message: err.message || info.userMessage,
            retryAfterSeconds: err.retryAfterSeconds,
        });
    }
};

export const syncStory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storyId, fullStoryContent, title, type } = req.body;

        if (!fullStoryContent) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const model = type === 'poetry' ? poemModel : storyModel;

        if (!storyId || storyId === 'new' || storyId === 'undefined') {
            const newStory = await model.create({
                userId: userId,
                title: title || 'Untitled Story',
                format: type === 'poetry' ? 'poetry' : 'story',
                mood: 'Neutral',
                genre: type === 'poetry' ? 'Free Verse' : 'General Fiction',
                userPrompt: 'Custom User Story',
                generatedText: fullStoryContent
            });
            return res.status(200).json({ success: true, message: "Created", storyId: newStory._id });
        }

        const updated = await model.findOneAndUpdate(
            { _id: storyId, userId: userId },
            { $set: { generatedText: fullStoryContent, title: title } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Story not found" });
        }

        return res.status(200).json({ success: true, message: "Synced", storyId: updated._id });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};