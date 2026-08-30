import type { Request, Response } from "express";
import { asyncHandler } from "../../Utils/async-handler.js";
import { apiSuccess } from "../../Utils/apiResponse.js";
import { chatService } from "./chat.service.js";

export const generateChat = asyncHandler(
    async (req: Request, res: Response) => {
        const { content, message } = req.body;
        const textContent = content || message;
        const userId = req.user?.userId;

        const result = await chatService.generateChat({
            userId,
            content: textContent,
        });

        return apiSuccess(
            res,
            result,
            "Chat title generated and saved successfully",
            201
        );
    }
);
