import type { Request, Response } from "express";
import { asyncHandler } from "../../Utils/async-handler.js";
import { apiSuccess, apiError } from "../../Utils/apiResponse.js";
import { messageService } from "./message.service.js";

const service = new messageService();

export const getMessages = asyncHandler(
    async (req: Request, res: Response) => {
        const chatId = req.params.chatId as string;
        const messages = await service.getMessages(chatId);
        return apiSuccess(res, messages, "Messages fetched successfully");
    }
);

export const getMessage = asyncHandler(
    async (req: Request, res: Response) => {
        const messageId = req.params.messageId as string;
        const message = await service.getMessage(messageId);
        return apiSuccess(res, message, "Message fetched successfully");
    }
);

export const updateMessage = asyncHandler(
    async (req: Request, res: Response) => {
        const messageId = req.params.messageId as string;
        const { content } = req.body;
        const updated = await service.updateMessage(messageId, { content });
        return apiSuccess(res, updated, "Message updated successfully");
    }
);

export const deleteMessage = asyncHandler(
    async (req: Request, res: Response) => {
        const messageId = req.params.messageId as string;
        const result = await service.deleteMessage(messageId);
        return apiSuccess(res, result, "Message deleted successfully");
    }
);

export const sendMessage = asyncHandler(
    async (req: Request, res: Response) => {
        const { content, chatId } = req.body;
        const userId = req.user?.userId;
        const result = await service.sendMessage({
            chatId,
            content,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return apiSuccess(res, result, "Message sent successfully", 201);
    }
);

export const streamMessage = asyncHandler(
    async (req: Request, res: Response) => {
        const { content, chatId } = req.body;
        const userId = req.user?.userId;

        if (!chatId || !content) {
            throw apiError(400, "Chat ID and content are required");
        }

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();

        try {
            await service.streamMessage(
                {
                    chatId,
                    content,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                (chunk) => {
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                }
            );
            res.write(`data: [DONE]\n\n`);
            res.end();
        } catch (err: any) {
            res.write(`data: ${JSON.stringify({ error: err.message || "Streaming failed" })}\n\n`);
            res.end();
        }
    }
);
