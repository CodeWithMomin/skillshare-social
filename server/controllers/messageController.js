const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const imageUrl = req.file ? req.file.path : "";

        if (!message && !imageUrl) {
            return res.status(400).json({ error: "Message content or image is required." });
        }

        // SOCKET.IO functionality to emit the message to the receiver
        const receiverSocketId = req.app.locals.userSocketMap[receiverId];
        const status = receiverSocketId ? 'delivered' : 'sent';

        const newMessage = new Message({
            senderId,
            receiverId,
            message: message || "",
            imageUrl,
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
            await Message.updateMany(
                { senderId: userToChatId, receiverId: senderId, status: { $ne: 'read' } },
                { $set: { status: 'read' } }
            );
            const senderSocketId = req.app.locals.userSocketMap[userToChatId];
            if (senderSocketId) {
                req.io.to(senderSocketId).emit("messagesRead", { readerId: senderId });
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

module.exports = {
    sendMessage,
    getMessages,
    getUnreadCounts
};
