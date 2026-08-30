import { HumanMessage } from '@langchain/core/messages';
import { invokeGemini } from '../../config/gemini.js';
import { poetryPrompt, storyPrompt, titlePrompt } from './story.prompt.js';

export const generateContent = async ({ format, mood, genre, userPrompt }) => {
    const compiledPrompt =
        format === 'poetry'
            ? poetryPrompt({ mood, genre, userPrompt })
            : storyPrompt({ mood, genre, userPrompt });

    return invokeGemini([new HumanMessage(compiledPrompt)], {
        temperature: 0.83,
        maxOutputTokens: 2048,
    });
};

export const generateTitle = async ({ format, mood, genre, userPrompt }) => {
    const prompt = titlePrompt({ mood, genre, format, userPrompt });
    return invokeGemini([new HumanMessage(prompt)], {
        temperature: 0.7,
        maxOutputTokens: 64,
    });
};
