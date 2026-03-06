import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Chip,
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

  const handleEmojiClick = (postId, emoji) => {
    setSelectedReaction((prev) => ({ ...prev, [postId]: emoji }));
    setShowEmojis(null);
  };

  const handlePostComment = (postId) => {
    const text = commentInput[postId];
    if (!text) return;

    const newComment = {
      user: {
        name: user?.name || "Anonymous",
        avatar: user?.avatar || "https://i.pravatar.cc/150?img=5",
      },
      text,
    };

    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]
        ? [...prev[postId], newComment]
        : [newComment],
    }));

    setCommentInput((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleAddPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <>
      <AddPost onAddPost={handleAddPost} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        {posts.map((post) => (
          <Card
            key={post.id}
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
                👍 {post.likes || 0}
              </Typography>
              <Typography variant="caption">
                💬 {post.comments || 0}
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
                onMouseEnter={() => setShowEmojis(post.id)}
                onMouseLeave={() => setShowEmojis(null)}
              >
                {selectedReaction[post.id] ? (
                  <Typography fontSize="1.2rem">
                    {selectedReaction[post.id]}
                  </Typography>
                ) : (
                  <ThumbUpOutlinedIcon fontSize="small" />
                )}
              </IconButton>

              <IconButton
                size="small"
                onClick={() =>
                  setShowComment((prev) =>
                    prev === post.id ? null : post.id
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
            {showComment === post.id && (
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
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
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
                        handlePostComment(post.id);
                    }}
                  />

                  <button
                    onClick={() => handlePostComment(post.id)}
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

                {comments[post.id]?.map((cmt, idx) => (
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
    </>
  );
};

export default Feed;