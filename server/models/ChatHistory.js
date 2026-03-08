const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'bot', 'image'], required: true },
    content: { type: String, required: true },
    prompt: { type: String },           // for role=image (generated image prompt)
    fileName: { type: String },           // for uploaded text files
    previewUrl: { type: String },           // thumbnail for uploaded images (data URL kept small)
}, { timestamps: true });

const chatHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New Chat' },
    messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
