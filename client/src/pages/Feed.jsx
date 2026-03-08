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
  Alert,
  Tabs,
  Tab,
  Button
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import { linkedInPosts } from "../lib/linkedinPosts";
import AddPost from "./Addpost";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';

const Feed = () => {
  const { user, getUserProfile } = useAuth();
  const [feedFilter, setFeedFilter] = useState("all");
  const [friendsList, setFriendsList] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

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
    const fetchFriends = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setFriendsList(profile.friends || []);
          setSentRequests(profile.sentRequests || []);
        }
      } catch (e) { console.error(e) }
    };
    fetchPosts();
    fetchFriends();
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

  const handleConnect = async (postUserId) => {
    try {
      if (!postUserId) return;
      const response = await api.post(`/users/${postUserId}/connect`);
      if (response && response.success) {
        setToast({ open: true, message: "Friend request sent!", severity: "success" });
        setSentRequests(prev => [...prev, { userId: postUserId }]);
      }
    } catch {
      setToast({ open: true, message: "Error sending request", severity: "error" });
    }
  };

  const filteredPosts = posts.filter(post => {
    if (feedFilter === "all") return true;
    if (feedFilter === "friends") {
      const isMyPost = post.userId === user?._id || post.author === user?.fullName;
      const isFriend = friendsList.some(f => f.userId === post.userId) || friendsList.some(f => f.name === post.author);
      return isFriend || isMyPost;
    }
    return true;
  });

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 2, pt: 2, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs value={feedFilter} onChange={(e, val) => setFeedFilter(val)} aria-label="feed tabs">
            <Tab label="All Posts" value="all" />
            <Tab label="Friends Only" value="friends" />
          </Tabs>
        </Box>
        <AddPost onAddPost={handleAddPost} />

        {filteredPosts.map((post) => (
          <Card
            key={post._id || post.id}
            sx={{ borderRadius: 2, boxShadow: 2, position: "relative" }}
          >
            {/* Header */}
            <CardHeader
              avatar={<Avatar src={
                (post.author === user?.fullName || post.author === user?.username || post.author === user?.name)
                  ? (user?.profilePic || user?.avatar || post.avatar)
                  : post.avatar
              } />}
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
              action={
                post.userId && post.userId !== (user?._id || user?.id) &&
                !friendsList.some(f => f.userId === post.userId) && (
                  <Button
                    size="small"
                    startIcon={sentRequests.some(r => r.userId === post.userId) ? <CheckIcon /> : <PersonAddIcon />}
                    onClick={() => handleConnect(post.userId)}
                    disabled={sentRequests.some(r => r.userId === post.userId)}
                    sx={{ textTransform: 'none', mt: 1, mr: 1 }}
                    color="primary"
                    variant="outlined"
                  >
                    {sentRequests.some(r => r.userId === post.userId) ? "Pending" : "Add Friend"}
                  </Button>
                )
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

              {post.mediaUrl && (
                <Box sx={{ mt: 2, mx: -2, mb: -2, bgcolor: "#f8f9fa" }}>
                  {post.mediaType === "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      style={{ width: "100%", maxHeight: "600px", objectFit: "contain", backgroundColor: "#000", display: "block" }}
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      style={{ width: "100%", maxHeight: "600px", objectFit: "contain", display: "block" }}
                    />
                  )}
                </Box>
              )}
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