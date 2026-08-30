import mongoose from "mongoose";


const convoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    systemContext: {
        type: String,
        default: `You are an intuitive creative writing muse. Inspire, guide, and critique with deep literary empathy.`
    }
}, {
    timestamps: true
})

convoSchema.index({ userId: 1 }, { unique: true })

const convoModel = mongoose.model("Convo", convoSchema)


export default convoModel