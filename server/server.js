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
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Tell all clients who is currently online
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markAsRead", async ({ senderId, receiverId }) => {
    try {
      const Message = require('./models/Message');
      await Message.updateMany(
        { senderId, receiverId, status: { $ne: 'read' } },
        { $set: { status: 'read' } }
      );
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", { readerId: receiverId });
      }
    } catch (err) {
      console.error(err);
    }
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
