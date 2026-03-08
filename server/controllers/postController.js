const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        const { author, title, avatar, timestamp, content, likes, comments, shares, tags, mediaUrl, mediaType } = req.body;

        const newPost = new Post({
            author,
            title,
            avatar,
            timestamp: timestamp || Date.now(),
            content,
            likes: Array.isArray(likes) ? likes : [],
            comments: Array.isArray(comments) ? comments : [],
            shares: shares || 0,
            tags: tags || [],
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || "",
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ timestamp: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const { userId } = req.body;

        // Simple logic: if user already liked it, unlike it; else like it
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            post.likes.push(userId);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
const commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const { user, text } = req.body;

        post.comments.push({ user, text });

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Upload media for a post
// @route   POST /api/posts/upload-media
const uploadPostMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No media file uploaded" });
        }

        const mediaUrl = req.file.path;
        let mediaType = "unknown";

        if (req.file.mimetype.startsWith("image/")) {
            mediaType = "image";
        } else if (req.file.mimetype.startsWith("video/")) {
            mediaType = "video";
        }

        res.status(200).json({
            success: true,
            mediaUrl,
            mediaType,
            message: "Media uploaded successfully",
        });
    } catch (error) {
        console.error("Upload Post Media Error:", error);
        res.status(500).json({ success: false, message: "Server error during media upload" });
    }
};

module.exports = {
    createPost,
    getPosts,
    likePost,
    commentPost,
    uploadPostMedia
};
