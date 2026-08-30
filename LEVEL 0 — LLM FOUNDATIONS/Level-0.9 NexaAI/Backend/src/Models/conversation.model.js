import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type: String,
        default: "New Chat",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    mode: {
        type: String,
        default: "casual",
        enum: ["casual", "explanation", "roadmap"]
    }
}, { timestamps: true })

conversationSchema.index({ user: 1, createdAt: -1 });



const ConversationModel = mongoose.model("Conversation", conversationSchema);
export default ConversationModel 
