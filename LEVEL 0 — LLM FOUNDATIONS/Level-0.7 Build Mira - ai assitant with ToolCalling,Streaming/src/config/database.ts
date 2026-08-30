import mongoose from "mongoose";

export const connectToDb = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};