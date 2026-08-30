import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            default: "New project",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

projectSchema.index({ userId: 1, title: 1 }, { unique: true });

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;
