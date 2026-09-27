import mongoose from "mongoose";

const DEFAULT_URI = "mongodb+srv://aniketgupta2801_db_user:Aniket_2805@cluster0.tfbepno.mongodb.net/QuickChat?appName=Cluster0";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        const uri = process.env.MONGODB_URI || DEFAULT_URI;
        await mongoose.connect(uri);
        console.log("Database Connected");

    } catch (error) {
        console.log("DB Connection Error:", error.message);
        throw error;
    }
};