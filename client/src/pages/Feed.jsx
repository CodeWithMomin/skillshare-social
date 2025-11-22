import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
const users = [
  { name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
  { name: "David", avatar: "https://i.pravatar.cc/150?img=4" },
];

const Feed = () => {
  const [showEmojis, setShowEmojis] = useState(null); // Which post shows emoji row
  const [selectedReaction, setSelectedReaction] = useState({}); // emoji per post
  const [showComment, setShowComment] = useState(null); // Which post shows comment input
  const [comments, setComments] = useState({}); // store comments per post
  const [commentInput, setCommentInput] = useState({}); // input text per post

  const handleEmojiClick = (postId, emoji) => {
    setSelectedReaction((prev) => ({ ...prev, [postId]: emoji }));
    setShowEmojis(null);
  };

  const handlePostComment = (postId) => {
    const text = commentInput[postId];
    if (!text) return;
    const user = users[Math.floor(Math.random() * users.length)];
    const newComment = { user, text };
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? [...prev[postId], newComment] : [newComment],
    }));
    setCommentInput((prev) => ({ ...prev, [postId]: "" })); // clear input
  };

  const posts = Array.from({ length: 20 }, (_, i) => {
    const user = users[i % users.length];
    return {
      id: i + 1,
      user,
      content: `This is post number ${i + 1}`,
      image: `https://picsum.photos/seed/${i + 1}/600/400`,
    };
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      {posts.map((post) => (
        <Card key={post.id} sx={{ borderRadius: 2, boxShadow: 2, position: "relative" }}>
          <CardHeader
            avatar={<Avatar src={post.user.avatar} />}
            title={post.user.name}
          />
          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>
          <CardMedia
            component="img"
            image={post.image}
            alt={`Post ${post.id}`}
            sx={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 1 }}
          />

          {/* Interaction Bar */}
          <Box sx={{ display: "flex", gap: 1, p: 1, alignItems: "center", position: "relative" }}>
            <IconButton
              size="small"
              onMouseEnter={() => setShowEmojis(post.id)}
              onMouseLeave={() => setShowEmojis(null)}
            >
              {selectedReaction[post.id] ? (
                <Typography fontSize="1.2rem">{selectedReaction[post.id]}</Typography>
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              size="small"
              onClick={() => setShowComment((prev) => (prev === post.id ? null : post.id))}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>

            <IconButton size="small">
              <ShareIcon fontSize="small" />
            </IconButton>

            {/* Emoji Row */}
            {showEmojis === post.id && (
              <Box sx={{
                position: "absolute", bottom: 35, left: 0,
                display: "flex", gap: 1, bgcolor: "white",
                p: 1, borderRadius: 2, boxShadow: 3, zIndex: 10
              }}>
                {reactions.map((emoji) => (
                  <Box
                    key={emoji}
                    sx={{ fontSize: "1.5rem", cursor: "pointer", "&:hover": { transform: "scale(1.4)" } }}
                    onClick={() => handleEmojiClick(post.id, emoji)}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Comment Input */}
          {showComment === post.id && (
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInput[post.id] || ""}
                  onChange={(e) =>
                    setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
                  onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(post.id); }}
                />
                <button
                  style={{ padding: "8px 12px", borderRadius: "8px", background: "#1976d2", color: "white", border: "none" }}
                  onClick={() => handlePostComment(post.id)}
                >
                  Post
                </button>
              </Box>

              {/* Show all comments */}
              {comments[post.id] && comments[post.id].map((cmt, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                  <Avatar src={cmt.user.avatar} sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2"><strong>{cmt.user.name}:</strong> {cmt.text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
