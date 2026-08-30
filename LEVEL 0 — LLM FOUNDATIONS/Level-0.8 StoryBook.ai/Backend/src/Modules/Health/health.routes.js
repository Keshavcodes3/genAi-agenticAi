import express from 'express';
import { probeGeminiHealth } from '../../config/gemini.js';

const healthRoutes = express.Router();

healthRoutes.get('/ai', async (req, res) => {
    try {
        const result = await probeGeminiHealth();
        return res.status(result.ok ? 200 : 503).json({
            success: result.ok,
            ...result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err?.message || 'Health check failed',
        });
    }
});

export default healthRoutes;
