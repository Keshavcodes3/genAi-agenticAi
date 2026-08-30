import express from "express";
import helmet from "helmet";

import userRoutes from "./modules/users/user.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json())
app.use(helmet());

app.use(cookieParser());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));



app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Mira API is healthy",
    });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;