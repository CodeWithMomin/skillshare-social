const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require("path");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Fix any legacy posts with numbers instead of arrays
const Post = require('./models/Post');
Post.updateMany({ likes: { $type: "number" } }, { $set: { likes: [] } }).catch(console.error);
Post.updateMany({ comments: { $type: "number" } }, { $set: { comments: [] } }).catch(console.error);

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// User socket map
const userSocketMap = {};
app.locals.userSocketMap = userSocketMap;

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
  console.log(`User attempt connect: ${userId} with socketId: ${socket.id}`);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log("Current Socket Map:", userSocketMap);
  }

  // Tell all clients who is currently online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markAsRead", async ({ senderId, receiverId }) => {
    try {
      const Message = require('./models/Message');
      const now = new Date();
      await Message.updateMany(
        { senderId, receiverId, status: { $ne: 'read' } },
        { $set: { status: 'read', readAt: now } }
      );
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { readerId: receiverId, readAt: now });
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    console.log(`Typing: ${senderId} -> ${receiverId}`);
    const targetSocketId = userSocketMap[receiverId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    console.log(`Stop Typing: ${senderId} -> ${receiverId}`);
    const targetSocketId = userSocketMap[receiverId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("stopTyping", { senderId });
    }
  });

  // ── WebRTC Signaling ────────────────────────────────────────────────────────

  // Caller sends an offer to the callee
  socket.on("callUser", ({ to, from, caller, callType, offer }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("incomingCall", { from, caller, callType, offer });
    }
  });

  // Callee sends answer back to caller
  socket.on("callAccepted", ({ to, answer }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("callAnswered", { answer });
    }
  });

  // Either side rejects / hangs up
  socket.on("callRejected", ({ to }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) io.to(targetSocket).emit("callRejected");
  });

  socket.on("callEnded", ({ to }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) io.to(targetSocket).emit("callEnded");
  });

  // ICE candidates relay
  socket.on("iceCandidate", ({ to, candidate }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) io.to(targetSocket).emit("iceCandidate", { candidate });
  });

  // Handle peer disconnect
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }
    // Broadcast the new list after someone leaves
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
}
)

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  req.io = io;
  next();
});


// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', require('./routes/userRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/chat-history', require('./routes/chatHistoryRoutes'));


// Error handler middleware for Multer errors, etc.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
