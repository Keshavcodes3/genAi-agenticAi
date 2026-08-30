import { HumanMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const ENV_KEYS = [
    'GEMINI_API_KEY',
    'GOOGLE_API_KEY',
];

/** Google AI Studio keys always start with AIza */
const GOOGLE_API_KEY_PATTERN = /^AIza[0-9A-Za-z_-]{30,}$/;

const DEFAULT_INVOKE_TIMEOUT_MS = 55_000;

const DEFAULT_MODEL_FALLBACKS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
];

const cleanEnvValue = (raw) => {
    if (!raw) return '';
    return raw.trim().replace(/^['"]|['"]$/g, '');
};

export const isValidGoogleApiKeyFormat = (key) =>
    typeof key === 'string' && GOOGLE_API_KEY_PATTERN.test(key.trim());

export const getGeminiApiKeys = () => {
    const keys = [];
    const seen = new Set();

    for (const name of ENV_KEYS) {
        const key = cleanEnvValue(process.env[name]);
        if (!key || seen.has(key)) continue;

        if (!isValidGoogleApiKeyFormat(key)) {
            console.warn(
                `[Gemini] Skipping ${name}: not a valid Google API key (expected AIza... from aistudio.google.com/apikey)`
            );
            continue;
        }

        seen.add(key);
        keys.push(key);
    }

    return keys;
};

export const getGeminiApiKey = () => getGeminiApiKeys()[0] ?? null;

export const assertGeminiApiKey = () => {
    const key = getGeminiApiKey();
    if (!key) {
        throw new Error(
            `Gemini API key is not configured. Set one of: ${ENV_KEYS.join(', ')}`
        );
    }
    return key;
};

export const getModelFallbacks = () => {
    const fromEnv = cleanEnvValue(process.env.GEMINI_MODEL);
    const models = fromEnv
        ? [fromEnv, ...DEFAULT_MODEL_FALLBACKS]
        : DEFAULT_MODEL_FALLBACKS;

    return [...new Set(models.filter(Boolean))];
};

export const normalizeGeminiContent = (content) => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part;
                if (part && typeof part.text === 'string') return part.text;
                return '';
            })
            .join('');
    }
    return content == null ? '' : String(content);
};

export const classifyGeminiError = (err) => {
    const msg = err?.message || String(err);

    if (
        msg.includes('429') ||
        msg.includes('Quota exceeded') ||
        msg.includes('quota') ||
        msg.includes('rate limit') ||
        msg.includes('RESOURCE_EXHAUSTED')
    ) {
        const retryMatch = msg.match(/retry in ([\d.]+)s/i);
        return {
            type: 'quota',
            status: 429,
            userMessage:
                'AI quota limit reached on the free Gemini plan. Wait about a minute and try again, or add billing in Google AI Studio.',
            retryAfterSeconds: retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60,
        };
    }

    if (
        msg.includes('API_KEY_INVALID') ||
        msg.includes('API key not valid') ||
        msg.includes('API key expired') ||
        msg.includes('API Key not found') ||
        msg.includes('API key not found')
    ) {
        return {
            type: 'auth',
            status: 503,
            userMessage:
                'AI service key is invalid or expired. Create a new key at aistudio.google.com/apikey, set GEMINI_API_KEY on Render, and redeploy.',
        };
    }

    if (
        msg.includes('is not found') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('404') ||
        msg.includes('not supported for generateContent')
    ) {
        return {
            type: 'model',
            status: 503,
            userMessage:
                'The configured Gemini model is unavailable. Set GEMINI_MODEL=gemini-2.5-flash on Render and redeploy.',
        };
    }

    if (
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('referer') ||
        msg.includes('blocked') ||
        msg.includes('API has not been used') ||
        msg.includes('SERVICE_DISABLED')
    ) {
        return {
            type: 'permission',
            status: 503,
            userMessage:
                'Gemini API access is blocked for this key. In Google AI Studio, use an unrestricted server key (no HTTP referrer limit) and enable the Generative Language API.',
        };
    }

    if (msg.includes('Gemini API key is not configured')) {
        return {
            type: 'config',
            status: 503,
            userMessage: msg,
        };
    }

    if (msg.includes('fetch failed') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT')) {
        return {
            type: 'network',
            status: 503,
            userMessage: 'Could not reach Google AI. Check Render logs and try again in a moment.',
        };
    }

    return {
        type: 'unknown',
        status: 500,
        userMessage: 'AI generation failed. Please try again in a moment.',
    };
};

export const toGeminiError = (err) => {
    const info = classifyGeminiError(err);
    const error = new Error(info.userMessage);
    error.status = info.status;
    error.retryAfterSeconds = info.retryAfterSeconds;
    error.type = info.type;
    error.cause = err;
    return error;
};

export const createGeminiModel = (options = {}) => {
    const { model = getModelFallbacks()[0], apiKey, temperature, maxOutputTokens, ...rest } = options;

    return new ChatGoogleGenerativeAI({
        model,
        apiKey: apiKey || assertGeminiApiKey(),
        ...(temperature !== undefined && { temperature }),
        ...(maxOutputTokens !== undefined && { maxOutputTokens }),
        ...rest,
    });
};

const shouldTryNextModel = (type) => type === 'quota' || type === 'model';

const shouldTryNextKey = (type) => type === 'auth';

const withTimeout = (promise, ms, label = 'Gemini request') =>
    Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`ETIMEDOUT: ${label} exceeded ${ms}ms`)), ms);
        }),
    ]);

/**
 * Invoke Gemini with API-key fallbacks and model fallbacks.
 */
export const invokeGemini = async (messages, options = {}) => {
    const apiKeys = options.apiKeys || getGeminiApiKeys();
    const models = options.models || getModelFallbacks();
    const timeoutMs = options.timeoutMs ?? DEFAULT_INVOKE_TIMEOUT_MS;

    if (apiKeys.length === 0) {
        throw toGeminiError(
            new Error(
                'Gemini API key is not configured. Set GEMINI_API_KEY from https://aistudio.google.com/apikey'
            )
        );
    }

    let lastError;

    for (const apiKey of apiKeys) {
        for (const model of models) {
            try {
                const client = createGeminiModel({
                    model,
                    apiKey,
                    temperature: options.temperature ?? 0.8,
                    maxOutputTokens: options.maxOutputTokens ?? 2048,
                });
                const response = await withTimeout(
                    client.invoke(messages),
                    timeoutMs,
                    `model ${model}`
                );
                return normalizeGeminiContent(response.content);
            } catch (err) {
                lastError = err;
                const { type } = classifyGeminiError(err);
                console.error(`[Gemini] model=${model} type=${type}:`, err?.message || err);

                if (shouldTryNextModel(type)) {
                    console.warn(`[Gemini] Trying next model after ${type} on ${model}...`);
                    continue;
                }

                if (shouldTryNextKey(type)) {
                    console.warn('[Gemini] API key rejected, trying next configured key...');
                    break;
                }

                throw toGeminiError(err);
            }
        }
    }

    throw toGeminiError(lastError);
};

/** List models your API key can use (for diagnostics). */
export const listGeminiModelsForKey = async (apiKey) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error?.message || `ListModels failed (${res.status})`);
    }

    return (data.models || [])
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));
};

export const probeGeminiHealth = async () => {
    const keys = getGeminiApiKeys();
    if (keys.length === 0) {
        return {
            ok: false,
            reason: 'No API key configured',
            keysConfigured: 0,
        };
    }

    try {
        const availableModels = await listGeminiModelsForKey(keys[0]);
        const preferred = getModelFallbacks().find((m) => availableModels.includes(m));
        const text = await invokeGemini(
            [new HumanMessage('Reply with exactly: ok')],
            {
                apiKeys: keys,
                models: preferred ? [preferred] : availableModels.slice(0, 3),
                maxOutputTokens: 16,
                temperature: 0,
            }
        );

        return {
            ok: true,
            keysConfigured: keys.length,
            modelUsed: preferred || availableModels[0],
            sampleModels: availableModels.slice(0, 8),
            probeReply: (text || '').slice(0, 32),
        };
    } catch (err) {
        const info = classifyGeminiError(err);
        return {
            ok: false,
            keysConfigured: keys.length,
            reason: info.userMessage,
            type: info.type,
            detail: err?.message || err?.cause?.message,
        };
    }
};
