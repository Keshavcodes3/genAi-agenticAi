import { Types } from "mongoose";
import { MessageRepository } from "./message.repo.js";
import { chatRepositary } from "../chat/chat.repo.js";
import { Message } from "./message.types.js";
import { apiError } from "../../Utils/apiResponse.js";
import miraAi from "../../ai/agent.js";
import { aiResponse } from "./message.utils.js";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from "@langchain/core/messages";
import miraModel from "../../ai/model.js";
import { MIRA_SYSTEM_PROMPT } from "../../ai/prompts.js";

export class messageService {
    private messageRepo = new MessageRepository()
    private chatRepo = new chatRepositary()

    sendMessage = async (data: Message) => {
        const { content, userId, chatId } = data;

        if (!userId) {
            throw apiError(401, "Unauthorized");
        }

        if (!chatId) {
            throw apiError(400, "Chat ID is required");
        }

        if (!content?.trim()) {
            throw apiError(400, "Message content is required");
        }

        try {
            // 1. Get previous messages
            const history =
                await this.messageRepo.findByChatId(chatId);

            // 2. Build LLM context
            const messages: (
                | HumanMessage
                | AIMessage
                | SystemMessage
            )[] = [];

            // System prompt should always be present.
            messages.push(
                new SystemMessage(MIRA_SYSTEM_PROMPT)
            );

            // 3. Convert DB messages → LangChain messages
            for (const message of history) {
                switch (message.role) {
                    case "user":
                        messages.push(
                            new HumanMessage(message.content)
                        );
                        break;

                    case "assistant":
                        messages.push(
                            new AIMessage(message.content)
                        );
                        break;

                    case "system":
                        messages.push(
                            new SystemMessage(message.content)
                        );
                        break;
                }
            }

            // 4. Add current user message
            messages.push(
                new HumanMessage(content)
            );

            // 5. Ask Mira
            const response = await aiResponse(messages);
            const responseContent =
                typeof response.content === "string"
                    ? response.content
                    : JSON.stringify(response.content);

            if (!responseContent) {
                throw apiError(
                    500,
                    "Empty AI response"
                );
            }

            // 6. Persist user message
            const userMessage =
                await this.messageRepo.create({
                    chatId,
                    role: "user",
                    content,
                });

            // 7. Persist AI message
            const aiMessage =
                await this.messageRepo.create({
                    chatId,
                    role: "assistant",
                    content: responseContent,
                });

            return {
                userMessage,
                aiMessage,
            };
        } catch (error) {
            console.error(
                "sendMessage error:",
                error
            );

            if (error instanceof Error) {
                throw apiError(
                    500,
                    error.message
                );
            }

            throw apiError(
                500,
                "Error generating response"
            );
        }
    };

    async getMessages(chatId: string) {
        if (!chatId) throw apiError(400, "Chat ID is required");
        return await this.messageRepo.findByChatId(chatId);
    }

    async getMessage(messageId: string) {
        if (!messageId) throw apiError(400, "Message ID is required");
        const message = await this.messageRepo.findById(messageId);
        if (!message) throw apiError(404, "Message not found");
        return message;
    }

    async updateMessage(messageId: string, data: { content?: string }) {
        if (!messageId) throw apiError(400, "Message ID is required");
        const updated = await this.messageRepo.updateById(messageId, data);
        if (!updated) throw apiError(404, "Message not found");
        return updated;
    }

    async deleteMessage(messageId: string) {
        if (!messageId) throw apiError(400, "Message ID is required");
        const message = await this.messageRepo.findById(messageId);
        if (!message) throw apiError(404, "Message not found");
        await this.messageRepo.deleteById(messageId);
        return { success: true, message: "Message deleted successfully" };
    }

    async streamMessage(
        data: Message,
        onChunk: (chunk: string) => void
    ) {
        const { content, userId, chatId } = { ...data };
        if (!userId) throw apiError(401, "Unauthorized");
        if (!chatId) throw apiError(400, "Chat Not found");

        const history = await this.messageRepo.findByChatId(chatId);

        const messages: any[] = [];
        const hasSystem = history.some(m => m.role === "system");
        if (!hasSystem) {
            messages.push(new SystemMessage(MIRA_SYSTEM_PROMPT));
        }

        for (const message of history) {
            switch (message.role) {
                case "user":
                    messages.push(new HumanMessage(message.content));
                    break;
                case "assistant":
                    messages.push(new AIMessage(message.content));
                    break;
                case "system":
                    messages.push(new SystemMessage(message.content));
                    break;
            }
        }
        messages.push(new HumanMessage(content));

        const userMessage = await this.messageRepo.create({
            chatId: chatId,
            role: "user",
            content: content,
        });

        let fullContent = "";
        try {
            const stream = await miraModel.stream(messages);
            for await (const chunk of stream) {
                const text = typeof chunk.content === "string" ? chunk.content : JSON.stringify(chunk.content);
                if (text) {
                    fullContent += text;
                    onChunk(text);
                }
            }
        } catch (err) {
            console.error("Streaming error:", err);
            throw apiError(400, "Error streaming AI response");
        }

        if (!fullContent) {
            fullContent = "No response generated";
        }

        const aiMessage = await this.messageRepo.create({
            chatId: chatId,
            role: "assistant",
            content: fullContent,
        });

        return { userMessage, aiMessage };
    }
}