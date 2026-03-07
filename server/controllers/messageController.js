const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Detect what kind of file was uploaded
        let imageUrl = "";
        let fileUrl = "";
        let fileType = "";
        let fileName = "";

        if (req.file) {
            const mime = req.file.mimetype || "";
            fileName = req.file.originalname || "file";

            if (mime.startsWith("image/")) {
                imageUrl = req.file.path;
                fileType = "image";
            } else if (mime.startsWith("video/")) {
                fileUrl = req.file.path;
                fileType = "video";
            } else {
                // Documents: PDF, DOCX, XLSX, etc.
                fileUrl = req.file.path;
                fileType = "document";
            }
        }

        if (!message && !imageUrl && !fileUrl) {
            return res.status(400).json({ error: "Message content or a file is required." });
        }

        const receiverSocketId = req.app.locals.userSocketMap[receiverId];
        const status = receiverSocketId ? 'delivered' : 'sent';

        const newMessage = new Message({
            senderId,
            receiverId,
            message: message || "",
            imageUrl,
            fileUrl,
            fileType,
            fileName,
            status
        });

        await newMessage.save();

        if (receiverSocketId) {
            req.io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        // Find all messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time (ascending)

        // Mark unread messages as read
        const unreadMessages = messages.filter(m => m.receiverId.toString() === senderId && m.status !== 'read');
        if (unreadMessages.length > 0) {
            const now = new Date();
            await Message.updateMany(
                { senderId: userToChatId, receiverId: senderId, status: { $ne: 'read' } },
                { $set: { status: 'read', readAt: now } }
            );
            const senderSocketId = req.app.locals.userSocketMap[userToChatId];
            if (senderSocketId) {
                req.io.to(senderSocketId).emit("messagesRead", { readerId: senderId, readAt: now });
            }
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUnreadCounts = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const mongoose = require('mongoose');
        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: new mongoose.Types.ObjectId(String(receiverId)), status: { $ne: 'read' } } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const countsMap = {};
        unreadCounts.forEach(item => {
            countsMap[item._id.toString()] = item.count;
        });

        res.status(200).json(countsMap);
    } catch (error) {
        console.error("Error in getUnreadCounts: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Only the sender can delete the message
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ error: "You can only delete your own messages" });
        }

        // Soft delete: clear content and set isDeleted flag
        message.message = "";
        message.imageUrl = "";
        message.fileUrl = "";
        message.isDeleted = true;
        await message.save();

        // Notify the receiver if they are online
        const receiverSocketId = req.app.locals.userSocketMap[message.receiverId];
        if (receiverSocketId) {
            req.io.to(receiverSocketId).emit("messageDeleted", { messageId, isDeleted: true });
        }

        res.status(200).json({ success: true, messageId, isDeleted: true });
    } catch (error) {
        console.error("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getUnreadCounts,
    deleteMessage
};
