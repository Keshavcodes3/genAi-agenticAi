import mongoose from "mongoose";

export const connectToDB = async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
        console.error('Database connection failed: set MONGO_URI (or MONGODB_URI) in environment variables');
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('connected to Database');
};