import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.route.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";

// Models
import GroupMessage from "./models/groupMessage.model.js";
import User from "./models/user.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend
    credentials: true,
  })
);

// ✅ REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔗 UserId <-> SocketId map
const userSocketMap = {}; // userId -> socket.id

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🔐 Map user ID to socket
  socket.on("registerUser", (userId) => {
    userSocketMap[userId] = socket.id;
    socket.userId = userId;

    // ✅ Emit array of online user IDs to all clients
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });

  // 💬 Private Message
  socket.on("sendPrivateMessage", ({ senderId, receiverId, content }) => {
    const receiverSocket = userSocketMap[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("newPrivateMessage", {
        senderId,
        content,
      });
    }
  });

  // 🧑‍🤝‍🧑 Group chat
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`📥 User ${socket.userId} joined group ${groupId}`);
  });

  socket.on("sendGroupMessage", async ({ groupId, senderId, content }) => {
    try {
      const message = await GroupMessage.create({
        group: groupId,
        sender: senderId,
        content,
      });

      io.to(groupId).emit("newGroupMessage", {
        _id: message._id,
        sender: senderId,
        content,
        group: groupId,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("❌ Group message DB error:", err.message);
    }
  });
  //handle edit message
  socket.on("editMessage", ({ messageId, newContent }) => {
    io.emit("messageEdited", { messageId, newContent });
  });

  //handle delete message
  socket.on("deleteMessage", ({ messageId }) => {
    io.emit("messageDeleted", { messageId });
  });

  // 🔌 Disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.userId}`);
    for (const [userId, sockId] of Object.entries(userSocketMap)) {
      if (sockId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    // ✅ Emit updated online user list
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
