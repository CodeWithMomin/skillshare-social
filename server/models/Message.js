const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            default: ""
        },
        fileUrl: {
            type: String,
            default: ""
        },
        fileType: {
            type: String,   // 'image' | 'video' | 'document'
            default: ""
        },
        fileName: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent'
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        },
        sharedPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
