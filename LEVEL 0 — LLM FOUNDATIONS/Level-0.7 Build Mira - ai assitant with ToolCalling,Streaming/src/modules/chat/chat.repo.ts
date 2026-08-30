import mongoose from "mongoose";
import { CreateChatInput } from "./chat.types.js";
import { ChatModel } from "./chat.model.js";
import { UserModel } from "../users/user.model.js";
import { Types } from "mongoose";

export class chatRepositary {
    private chatModel = ChatModel
    private UserModel = UserModel
    createChat = async (input: CreateChatInput) => {
        const chat = await this.chatModel.create({
            userId: input.userId,
            title: input.title,
            createdAt: Date.now()
        })
        return chat
    }

    getUserChats = async (userId: string, options?: {
        cursor?: string;
        limit?: number;
    }) => {
        const chats = await this.chatModel.find({
            userId: userId
        })
        return chats
    }

    updateChat = async (
        chatId: string,
        userId: string,
        input: string
    ) => {
        const chat = await this.chatModel.findByIdAndUpdate(new Types.ObjectId(chatId as string), {
            "$set": {
                input
            }
        })
        return chat
    }

    deleteChat = async (chatId: string) => {
        return await this.chatModel.findByIdAndDelete(new Types.ObjectId(chatId as string)
        )
    }

    findByUserAndChatId = async (data: {
        chatId: Types.ObjectId,
        userId: Types.ObjectId,
    }) => {
        return await this.chatModel.findOne({
            userId: data.userId,
            _id: data.chatId
        })
    }
}