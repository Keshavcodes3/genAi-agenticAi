import { Types } from "mongoose";
import { Message, IMessage, MessageRole } from "./message.model.js";

interface CreateMessageData {
    chatId: Types.ObjectId | string;
    role: MessageRole;
    content: string;
    toolCallId?: string;
    toolName?: string;
}

export class MessageRepository {
    async create(data: CreateMessageData): Promise<IMessage> {
        return Message.create({
            chatId: data.chatId,
            role: data.role,
            content: data.content,
            toolCallId: data.toolCallId,
            toolName: data.toolName,
        });
    }

    async findById(
        messageId: string | Types.ObjectId
    ): Promise<IMessage | null> {
        return Message.findById(messageId);
    }

    async findByChatId(
        chatId: string | Types.ObjectId
    ): Promise<IMessage[]> {
        return Message.find({
            chatId,
        })
            .sort({ createdAt: 1 })
            .lean();
    }

    async findRecentByChatId(
        chatId: string | Types.ObjectId,
        limit: number
    ): Promise<IMessage[]> {
        const messages = await Message.find({
            chatId,
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return messages.reverse();
    }

    async countByChatId(
        chatId: string | Types.ObjectId
    ): Promise<number> {
        return Message.countDocuments({
            chatId,
        });
    }

    async deleteByChatId(
        chatId: string | Types.ObjectId
    ): Promise<void> {
        await Message.deleteMany({
            chatId,
        });
    }

    async deleteById(
        messageId: string | Types.ObjectId
    ): Promise<void> {
        await Message.findByIdAndDelete(messageId);
    }

    async updateById(
        messageId: string | Types.ObjectId,
        data: { content?: string }
    ): Promise<IMessage | null> {
        return Message.findByIdAndUpdate(
            messageId,
            { $set: data },
            { new: true }
        );
    }
}

