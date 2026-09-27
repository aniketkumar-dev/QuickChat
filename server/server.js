import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Initialize socket.io server safely
export let io = null;

if (!process.env.VERCEL) {
    try {
        io = new Server(server, {
            cors: { origin: "*" }
        });

        // Socket.io connection handler
        io.on("connection", (socket) => {
            const userId = socket.handshake.query.userId;
            console.log("User Connected", userId);

            if (userId) userSocketMap[userId] = socket.id;

            // Emit online users to all connected clients
            io.emit("getOnlineUsers", Object.keys(userSocketMap));

            socket.on("disconnect", () => {
                console.log("User Disconnected", userId);
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            });
        });
    } catch (e) {
        console.log("Socket initialization skipped/failed:", e.message);
    }
}

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Ensure MongoDB is connected before processing API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        console.log("Middleware DB connect error:", e.message);
        res.status(500).json({
            success: false,
            message: "Database Connection Error: " + e.message
        });
    }
});

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Connect to MongoDB safely for local/persistent runs
connectDB().catch(err => console.log("Initial DB error:", err.message));

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
}

export default app;
