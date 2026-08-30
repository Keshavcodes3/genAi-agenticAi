import { Schema, model, type InferSchemaType } from "mongoose";

const chatSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            default: "New Chat",
            trim: true,
            maxlength: 100,
        },

        lastMessageAt: {
            type: Date,
            default: null,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

chatSchema.index({
    userId: 1,
    updatedAt: -1,
});

export type Chat = InferSchemaType<typeof chatSchema>;

export const ChatModel = model("Chat", chatSchema);