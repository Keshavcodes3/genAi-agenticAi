import mongoose from 'mongoose'

const memorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    memoryType: {
        type: String,
    },
    data: [{
        type: String
    }],
    sourceSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
}, {
    timestamps: true
})


const memoryModel = mongoose.model("Memory", memorySchema)



export default memoryModel