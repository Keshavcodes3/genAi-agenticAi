import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['chat', 'coach', 'feedback', 'prompt'],
        default: 'chat'
    },
    role: {
        type: String,
        enum: ['ai', 'user', 'assistant', 'system'],
        default: 'user'
    }
}, {
    timestamps: true
})



const chatModel = mongoose.model("Chat", chatSchema)


export default chatModel