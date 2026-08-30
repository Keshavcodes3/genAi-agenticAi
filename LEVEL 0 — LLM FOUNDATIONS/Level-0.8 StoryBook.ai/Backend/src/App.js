import './config/env.js';


import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import bcrypt from 'bcryptjs';
import morgan from 'morgan'
const app = express();
const allowedOrigins = [
    ...new Set([
        'http://localhost:5173',
        'http://localhost:3000',
        'https://story-book-ai-eta.vercel.app',
        process.env.FRONTEND_URL,
    ].filter(Boolean)),
];

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow internal/server-to-server or tools like Postman (no origin)
        if (!origin) return callback(null, true);

        // 2. Clean verification against your array strings
        // Trim any trailing slashes to prevent string mismatches
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanAllowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        if (cleanAllowed.includes(cleanOrigin)) {
            return callback(null, true);
        } else {
            // DO NOT throw a raw Error here. It triggers a 500 crash.
            // Just return false to block the domain safely via standard CORS headers.
            return callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookie());
app.use(morgan("dev"))


app.get('/', (req, res) => {
    res.send("Welcome to  backend setup!");
});


//*Import routes
import userRoutes from './Modules/User/user.routes.js';
import storyRoutes from './Modules/Story/story.routes.js';
import chatRoutes from './Modules/MuseAI/chat.routes.js';
import settingRoutes from './Modules/Setting/setting.routes.js';
import editorRoutes from './Modules/Editor/editor.routes.js';
import healthRoutes from './Modules/Health/health.routes.js';


const baseUrl = "/api/v1"
//&Use routes
app.use(`${baseUrl}/auth`, userRoutes)
app.use(`${baseUrl}/story`, storyRoutes)
app.use(`${baseUrl}/muse`, chatRoutes)
app.use(`${baseUrl}/settings`, settingRoutes)
app.use(`${baseUrl}/editor`, editorRoutes)
app.use(`${baseUrl}/health`, healthRoutes)

export default app;