/**
 * Run: node scripts/test-gemini.mjs   (from any directory)
 * Or:  npm run test:gemini            (from Backend/)
 * Requires GEMINI_API_KEY or GOOGLE_API_KEY in Backend/.env
 */
import '../src/config/env.js';
import { probeGeminiHealth, getGeminiApiKeys, listGeminiModelsForKey } from '../src/config/gemini.js';

const keys = getGeminiApiKeys();
if (keys.length === 0) {
    console.error(
        'No valid Gemini API key in Backend/.env.\n' +
            'Set GEMINI_API_KEY=AIza... from https://aistudio.google.com/apikey\n' +
            '(Keys must start with AIza; MuseApiKey and other names are not read.)'
    );
    process.exit(1);
}

console.log(`Configured key(s): ${keys.length}`);

try {
    const models = await listGeminiModelsForKey(keys[0]);
    console.log('Available generateContent models (first 12):');
    console.log(models.slice(0, 12).join('\n'));
} catch (e) {
    console.error('ListModels failed:', e.message);
    if (String(e.message).toLowerCase().includes('api key')) {
        console.error(
            'A key was loaded from .env but Google rejected it. Create a new key at https://aistudio.google.com/apikey ' +
                '(server key, no HTTP referrer restriction) and update Backend/.env.'
        );
    }
}

const health = await probeGeminiHealth();
console.log('\nHealth probe:', JSON.stringify(health, null, 2));
process.exit(health.ok ? 0 : 1);
