import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { invokeGemini } from '../../config/gemini.js';

const MAX_HISTORY_MESSAGES = 10;
const MAX_CHARS_PER_MESSAGE = 2000;

const Prompt = ({ mode }) => {
    const basePersona =
        'You are the Muse of StoryBook.ai — a concise, supportive writing companion. Keep replies focused (under 200 words unless analyzing prose).';

    switch (mode) {
        case 'prompt':
            return `${basePersona} CREATIVE PROVOCATION: Give one evocative writing constraint or twist. End with [mood: cozy-library|neon-rain|dark-gothic|cosmic-solitude].`;
        case 'feedback':
            return `${basePersona} LITERARY MIRROR: Briefly critique pacing, tone, and habits in the user's latest text.`;
        case 'coach':
            return `${basePersona} WRITING COACH: Focus on arc, character, subtext, and pacing.`;
        case 'chat':
        default:
            return `${basePersona} STANDARD CHAT: Brainstorm ideas and help with writer's block.`;
    }
};

const trimHistory = (messages) => {
    const recent = messages.slice(-MAX_HISTORY_MESSAGES);

    return recent.map((msg) => {
        const role = (msg.role || '').toLowerCase();
        let text = (msg.content || msg.message || '').slice(0, MAX_CHARS_PER_MESSAGE);

        if (role === 'user') return new HumanMessage(text);
        if (role === 'system') return new SystemMessage(text);
        if (role === 'ai' || role === 'assistant') return new AIMessage(text);
        return new HumanMessage(text);
    });
};

export const generateResponse = async ({ messages, mode }) => {
    const operationalSystemInstruction = Prompt({ mode });
    const structuredMessageHistory = trimHistory(messages);

    const payloadContext = [
        new SystemMessage(operationalSystemInstruction),
        ...structuredMessageHistory,
    ];

    return invokeGemini(payloadContext, {
        temperature: 0.85,
        maxOutputTokens: 1024,
    });
};
