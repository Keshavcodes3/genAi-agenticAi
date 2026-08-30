import { Schema, model, Document, Types } from "mongoose";

export type MessageRole =
    | "system"
    | "user"
    | "assistant"
    | "tool";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    role: MessageRole;
    content: string;

    toolCallId?: string;
    toolName?: string;

    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true,
        },

        role: {
            type: String,
            enum: ["system", "user", "assistant", "tool"],
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        toolCallId: {
            type: String,
        },

        toolName: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export const Message = model<IMessage>(
    "Message",
    messageSchema
);