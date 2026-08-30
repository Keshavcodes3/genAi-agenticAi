export const getPrompt = ({ actionType, fullStoryContent, textTarget, prompt }) => {
    let humanInstruction = "";

    // Normalize incoming string cases from the frontend action triggers
    switch (actionType?.toLowerCase()) {
        case "continue":
            if (prompt) {
                humanInstruction = `The user wants you to write a completely new, long, and highly detailed story or poetry based on this prompt: "${prompt}". 
Ensure you strictly follow the selected genre and mood. Make it very long (3-4 paragraphs minimum for story, or a long multi-stanza for poetry). 
You MUST provide a fitting title on the very first line in this exact format: "TITLE: [Your Title]", followed by a blank line, and then the full content.`;
            } else {
                humanInstruction = `Read the following context carefully:
"${fullStoryContent}"

Task: Write a highly detailed, long continuation (at least 3-4 full paragraphs if it's a story, or a long, heartwarming multi-stanza continuation if it's poetry). Examine the specified genre and mood thoroughly. Deeply explore the world, the emotional core of the characters, and the narrative flow. Ensure the continuation smoothly connects from the very end of the existing text.`;
            }
            break;

        case "rewrite":
            humanInstruction = `Read the full story context for structural background:
"${fullStoryContent}"

Task: Rewrite this specific target section to maximize its emotional weight, prose quality, and flow:
"${textTarget || fullStoryContent}"`;
            break;

        case "dramatic":
        case "make_it_dramatic": // Captures both naming conventions safely
            humanInstruction = `Read the full story context for structural background:
"${fullStoryContent}"

Task: Take this specific excerpt and intensely punch up its dramatic tension, inner stakes, emotional subtext, and sensory descriptions:
"${textTarget || fullStoryContent}"`;
            break;

        case "shorten":
            humanInstruction = `Trim down any linguistic fluff, eliminate overused adjectives, and dramatically tighten the pacing of this text snippet without dropping its core narrative plot value:
"${textTarget || fullStoryContent}"`;
            break;

        case "expand": // 🚀 Added missing feature link matching your UI mockup card
            humanInstruction = `Read the full story context for structural background:
"${fullStoryContent}"

Task: Elaborate on this specific target excerpt. Flesh out the environmental world-building details, physical character micro-expressions, or implicit atmospheres surrounding this moment:
"${textTarget || fullStoryContent}"`;
            break;

        case "custom": // 💡 Optional handler for if they type their own custom request prompt box
            humanInstruction = `Using the story context below:
"${fullStoryContent}"

Task: Execute this specific directive on the text target: ${prompt || "Polish the prose naturally"}`;
            break;

        default:
            humanInstruction = `Continue writing, polishing, or refining the text naturally based on this story context canvas: "${fullStoryContent}"`;
    }

    return humanInstruction;
};