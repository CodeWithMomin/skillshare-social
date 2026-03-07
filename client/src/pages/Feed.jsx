import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Snackbar,
  Alert
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import { linkedInPosts } from "../lib/linkedinPosts";
import AddPost from "./Addpost";
import { useAuth } from "../context/AuthContext";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const Feed = () => {
  const { user } = useAuth();

  const [showEmojis, setShowEmojis] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState({});
  const [showComment, setShowComment] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [posts, setPosts] = useState(linkedInPosts);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        const data = await response.json();
        if (data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      const uId = user?._id || user?.id || "anonymous";
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uId })
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => prev.map(p => (p._id === postId || p.id === postId) ? updatedPost : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (postId) => {
    const text = commentInput[postId];
    if (!text) return;

    const newCommentUser = {
      name: user?.name || "Anonymous",
      avatar: user?.avatar || "https://i.pravatar.cc/150?img=5",
    };

    // Optimistic UI update
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]
        ? [...prev[postId], { user: newCommentUser, text }]
        : [{ user: newCommentUser, text }],
    }));
    setCommentInput((prev) => ({ ...prev, [postId]: "" }));

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newCommentUser, text })
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => prev.map(p => (p._id === postId || p.id === postId) ? updatedPost : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPost = async (newPost) => {
    console.log("newPost", newPost);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost)
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      const savedPost = await response.json();
      setPosts((prev) => [savedPost, ...prev]);
      setToast({ open: true, message: "Post saved successfully!", severity: "success" });
    } catch (error) {
      console.error("Error saving post:", error);
      setToast({ open: true, message: "Failed to save post", severity: "error" });
      setPosts((prev) => [newPost, ...prev]); // Update UI regardless of backend error for demo
    }
  };

  return (
    <>
      <AddPost onAddPost={handleAddPost} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        {posts.map((post) => (
          <Card
            key={post._id || post.id}
            sx={{ borderRadius: 2, boxShadow: 2, position: "relative" }}
          >
            {/* Header */}
            <CardHeader
              avatar={<Avatar src={post.avatar} />}
              title={<Typography fontWeight="bold">{post.author}</Typography>}
              subheader={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />

            {/* Content */}
            <CardContent>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-line" }}
              >
                {post.content}
              </Typography>

              {/* Tags */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                {post.tags?.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </CardContent>

            {/* Stats */}
            <Box sx={{ px: 2, pb: 1, display: "flex", gap: 2 }}>
              <Typography variant="caption">
                👍 {Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)}
              </Typography>
              <Typography variant="caption">
                💬 {Array.isArray(post.comments) ? post.comments.length : (post.comments || 0)}
              </Typography>
              <Typography variant="caption">
                🔁 {post.shares || 0}
              </Typography>
            </Box>

            <Box sx={{ borderTop: "1px solid #e0e0e0", mx: 2 }} />

            {/* Interaction */}
            <Box sx={{ display: "flex", gap: 1, p: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleLikePost(post._id || post.id)}
              >
                <ThumbUpOutlinedIcon fontSize="small" color={Array.isArray(post.likes) && post.likes.includes(user?._id || user?.id || "anonymous") ? "primary" : "inherit"} />
              </IconButton>

              <IconButton
                size="small"
                onClick={() =>
                  setShowComment((prev) =>
                    prev === (post._id || post.id) ? null : (post._id || post.id)
                  )
                }
              >
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>

              <IconButton size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Comment Section */}
            {showComment === (post._id || post.id) && (
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput[post._id || post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post._id || post.id]: e.target.value,
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handlePostComment(post._id || post.id);
                    }}
                  />

                  <button
                    onClick={() => handlePostComment(post._id || post.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Post
                  </button>
                </Box>

                {(Array.isArray(post.comments) ? post.comments : comments[post._id || post.id] || []).map((cmt, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={cmt.user.avatar}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2">
                      <strong>{cmt.user.name}:</strong> {cmt.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        ))}
      </Box>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={toast.open} autoHideDuration={4000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Feed;