const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    mediaUrl: {
        type: String,
        default: "",
    },
    mediaType: {
        type: String,
        default: "", // "image" or "video"
    },
    likes: [{ // Array of user names/IDs who liked
        type: String
    }],
    comments: [{
        user: {
            name: String,
            avatar: String
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    shares: {
        type: Number,
        default: 0,
    },
    tags: [
        {
            type: String,
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
