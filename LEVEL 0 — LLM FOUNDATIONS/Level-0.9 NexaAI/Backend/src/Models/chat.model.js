import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    role: {
        type: String,
        default: "user",
        required: true,
        enum: ["ai", "user"]
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

chatSchema.index({ conversationId: 1, createdAt: 1 });


const chatModel=mongoose.model("Chat",chatSchema)

export default chatModel
