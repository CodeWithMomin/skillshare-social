const Post = require("../models/Posts");

// CREATE POST (Multiple Images)
const createPost = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const imageUrls = req.files.map(file => file.path);

    const newPost = await Post.create({
      userId: req.user.id,
      caption: req.body.caption || "",
      imageUrls
    });

    res.json({
      success: true,
      message: "Post created successfully",
      post: newPost
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LIKE POST
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({ success: true, likes: post.likes.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UNLIKE POST
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();

    res.json({ success: true, likes: post.likes.length });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId: req.user.id, text });
    await post.save();

    res.json({ success: true, comments: post.comments });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);

    await post.save();

    res.json({ success: true, comments: post.comments });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FEED (All posts)
const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "fullName profilePic")
      .populate("comments.userId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only owner can delete
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports={
    getFeed,deletePost,deleteComment,addComment,unlikePost,likePost,createPost
}