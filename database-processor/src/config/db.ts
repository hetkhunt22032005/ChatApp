import mongoose from "mongoose";

export async function connectDB() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    try {
        await mongoose.connect(uri);
        console.log("Database connected successfully.");
    } catch (error: any) {
        console.log('Error in database connection: ', error.message);
    }
}

export async function closeDB() {
    await mongoose.disconnect();
}
