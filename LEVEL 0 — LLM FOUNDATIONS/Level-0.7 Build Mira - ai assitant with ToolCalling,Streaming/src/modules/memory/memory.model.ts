import { Schema, model, type InferSchemaType } from "mongoose";

const memorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["fact", "preference", "event", "relationship"],
            default: "fact",
            index: true,
        },

        importance: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.5,
        },
    },
    {
        timestamps: true,
    }
);

export type Memory = InferSchemaType<typeof memorySchema>;

export const MemoryModel = model("Memory", memorySchema);