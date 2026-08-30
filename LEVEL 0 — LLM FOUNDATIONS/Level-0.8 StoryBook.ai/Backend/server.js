import './src/config/env.js';

import app from './src/App.js';
import { connectToDB } from './src/config/database.js';
import { getGeminiApiKeys, getModelFallbacks } from './src/config/gemini.js';

const PORT = process.env.PORT || 3000;

const geminiKeys = getGeminiApiKeys();
if (geminiKeys.length === 0) {
    console.warn(
        'WARNING: No valid Gemini API key. Create one at https://aistudio.google.com/apikey and set GEMINI_API_KEY on Render.'
    );
} else {
    console.log(`Gemini: ${geminiKeys.length} key(s); models: ${getModelFallbacks().join(' → ')}`);
}

connectToDB();
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});