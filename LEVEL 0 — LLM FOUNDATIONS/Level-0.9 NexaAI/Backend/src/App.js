import 'dotenv/config'
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Must be FIRST — before body parsers, before routes.
// Browsers send OPTIONS preflight before every cross-origin request.
// If CORS isn't resolved first, the request is blocked before auth/body parsing.
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://nexaai-tahr.onrender.com",
    "https://nexa-ai-one-amber.vercel.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow no-origin requests (Postman, mobile, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

// Express 5 dropped bare "*" wildcard — must use regex for preflight handler
app.options(/(.*)/, cors(corsOptions));

// ─── BODY PARSERS ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── LOGGING (dev only) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.use(morgan('dev'));
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────
import authRouter from "./Routes/user.routes.js";
import conversationRouter from "./Routes/conversation.routes.js";
import projectRoutes from "./Routes/project.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import { apiRateLimit } from "./Middlewares/rateLimit.middleware.js";

// Health check — no auth, no rate limit
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRateLimit);
app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/project", projectRoutes);
app.use("/api/admin", adminRouter);

// ─── 404 FALLBACK ────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: "Route not found", success: false });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Internal server error",
        success: false,
    });
});

export default app;
