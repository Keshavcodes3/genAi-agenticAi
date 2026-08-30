import mongoose from "mongoose";

const blackListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h'
    }
}, {
    timestamps: true
});

const blacklistModel = mongoose.model("Blacklist", blackListSchema);

export default blacklistModel;