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
  Button,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { linkedInPosts } from "../lib/linkedinPosts";
import AddPost from "./Addpost";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import { encryptMessage } from "../utils/crypto";

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

  // Post Options State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostOptions, setSelectedPostOptions] = useState(null);

  // Edit/Delete Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPostContent, setEditPostContent] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Share Dialog State
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPostToShare, setSelectedPostToShare] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

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
      name: user?.fullName || user?.username || "Anonymous",
      avatar: user?.profilePic || user?.avatar || "https://i.pravatar.cc/150?img=5",
    };

    // Optimistic UI update
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId]
        ? [...prev[postId], { user: newCommentUser, text }]
        : [{ user: newCommentUser, text }],
    }));
    setCommentInput((prev) => ({ ...prev, [postId]: "" }));

    if (typeof postId === "number" || postId.toString().length < 10) {
      return; // Skip backend call for demo posts
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newCommentUser, text, userId: user?._id || user?.id })
      });
      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(prev => prev.map(p => (p._id === postId || p.id === postId) ? updatedPost : p));
      } else {
        console.warn("Backend comment update failed, falling back to optimistic UI");
      }
    } catch (err) {
      console.error("Comment fetch error:", err);
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

  // Post Options Handlers
  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostOptions(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostOptions(null);
  };

  // Edit Handlers
  const handleEditClick = () => {
    if (selectedPostOptions) {
      setEditPostContent(selectedPostOptions.content);
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!selectedPostOptions) return;
    const postId = selectedPostOptions._id || selectedPostOptions.id;

    // Optimistic Update
    setPosts(prev => prev.map(p => (p._id === postId || p.id === postId) ? { ...p, content: editPostContent } : p));
    setEditDialogOpen(false);

    if (typeof postId === "number" || postId.toString().length < 10) return; // Skip API for demo posts

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editPostContent })
      });
      if (!response.ok) throw new Error("Failed to edit post");
      setToast({ open: true, message: "Post updated", severity: "success" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Error updating post", severity: "error" });
    }
  };

  // Delete Handlers
  const handleDeleteClick = async () => {
    if (!selectedPostOptions) return;
    const postId = selectedPostOptions._id || selectedPostOptions.id;
    handleMenuClose();
    setIsDeleting(true);

    try {
      if (typeof postId !== "number" && postId.toString().length >= 10) {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete post");
      }

      // Update UI after successful deletion
      setPosts(prev => prev.filter(p => p._id !== postId && p.id !== postId));
      setToast({ open: true, message: "Post deleted", severity: "info" });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Error deleting post", severity: "error" });
    } finally {
      setIsDeleting(false);
      setAnchorEl(null);
    }
  };

  const handleShareClick = (post) => {
    if (friendsList.length === 0) {
      setToast({ open: true, message: "You don't have any friends to share this with yet!", severity: "info" });
      return;
    }
    setSelectedPostToShare(post);
    setShareDialogOpen(true);
  };

  const handleShareConfirm = async (friendId) => {
    if (!selectedPostToShare) return;
    setIsSharing(true);
    try {
      // Craft the message payload
      let shareMessage = "Check out this post!";

      // 1. Grab friend's public key for End-to-End Encryption
      const friendRes = await api.get("/users/user/" + friendId);
      let fPubKey = null;
      if (friendRes?.data?.user?.publicKey) {
        fPubKey = friendRes.data.user.publicKey;
      } else if (friendRes?.user?.publicKey) {
        fPubKey = friendRes.user.publicKey;
      }

      // 2. Encrypt the literal text payload using Curve25519 cryptography
      const mySecKey = localStorage.getItem("e2ee_secretKey");
      if (shareMessage && mySecKey && fPubKey) {
        shareMessage = encryptMessage(shareMessage, mySecKey, fPubKey) || shareMessage;
      }

      // 3. Package as FormData strictly to match UserChat.jsx multer expectations
      const formData = new FormData();
      if (shareMessage) formData.append("message", shareMessage);
      formData.append("sharedPost", selectedPostToShare._id || selectedPostToShare.id);

      // Fire payload to direct messages API
      const response = await api.post(`/messages/send/${friendId}`, formData);

      if (response.data || response) {
        setToast({ open: true, message: "Post shared successfully!", severity: "success" });
        setShareDialogOpen(false);
      }
    } catch (error) {
      console.error("Share dispatch error:", error);
      setToast({ open: true, message: "Failed to share post.", severity: "error" });
    } finally {
      setIsSharing(false);
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {post.userId && post.userId !== (user?._id || user?.id) &&
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
                    )}
                  {(post.author === user?.fullName || post.author === user?.username || post.author === user?.name || post.userId === (user?._id || user?.id)) && (
                    <IconButton onClick={(e) => handleMenuOpen(e, post)} sx={{ mt: 1 }}>
                      <MoreVertIcon />
                    </IconButton>
                  )}
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

            {/* Interaction Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 1,
              }}
            >
              <Button
                size="medium"
                startIcon={<ThumbUpOutlinedIcon />}
                onClick={() => handleLikePost(post._id || post.id)}
                sx={{
                  color: Array.isArray(post.likes) && post.likes.includes(user?._id || user?.id || "anonymous") ? "primary.main" : "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                Like
              </Button>

              <Button
                size="medium"
                startIcon={<ChatBubbleOutlineIcon />}
                onClick={() =>
                  setShowComment((prev) =>
                    prev === (post._id || post.id) ? null : (post._id || post.id)
                  )
                }
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                Comment
              </Button>

              <Button
                size="medium"
                startIcon={<ShareIcon />}
                onClick={() => handleShareClick(post)}
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                Share
              </Button>
            </Box>

            {/* Comment Section */}
            {showComment === (post._id || post.id) && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#fcfcfc",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Comment Input */}
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Avatar src={user?.profilePic || user?.avatar} sx={{ width: 36, height: 36 }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentInput[post._id || post.id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post._id || post.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commentInput[post._id || post.id]?.trim()) {
                        e.preventDefault();
                        handlePostComment(post._id || post.id);
                      }
                    }}
                    InputProps={{
                      sx: { borderRadius: 5, bgcolor: "white" },
                    }}
                  />
                  <IconButton
                    color="primary"
                    disabled={!commentInput[post._id || post.id]?.trim()}
                    onClick={() => handlePostComment(post._id || post.id)}
                    sx={{ bgcolor: commentInput[post._id || post.id]?.trim() ? "primary.light" : "action.hover", color: commentInput[post._id || post.id]?.trim() ? "white" : "text.disabled", "&:hover": { bgcolor: "primary.main" } }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Comments List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                  {(Array.isArray(post.comments) ? post.comments : comments[post._id || post.id] || []).map((cmt, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                      <Avatar src={cmt.user.avatar} sx={{ width: 32, height: 32, mt: 0.5 }} />
                      <Box
                        sx={{
                          bgcolor: "#eef2f6",
                          px: 2,
                          py: 1,
                          borderRadius: 3,
                          borderTopLeftRadius: 1,
                          maxWidth: "85%",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary" }}>
                          {cmt.user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, wordBreak: "break-word" }}>
                          {cmt.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Card>
        ))}
      </Box>

      {/* Post Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock={true}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditClick}>Edit Post</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          {isDeleting ? "Deleting..." : "Delete Post"}
        </MenuItem>
      </Menu>

      {/* Share Post Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        disableScrollLock={true}
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: 'center', pb: 1, pt: 3 }}>
          Share to Chat
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflowX: 'hidden' }}>
          <Box sx={{ p: 2, pt: 0 }}>
            {friendsList.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                No friends available. Expand your network!
              </Typography>
            ) : (
              <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
                {friendsList.map((friend) => (
                  <ListItem
                    key={friend.userId || friend._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      mb: 0.5,
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(238, 153, 23, 0.08)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Avatar
                        src={friend.profilePic || friend.avatar}
                        sx={{ width: 48, height: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', bgcolor: '#ee9917' }}
                      >
                        {friend.name?.charAt(0) || "F"}
                      </Avatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="600" color="text.primary">{friend.name || friend.username}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">Connected</Typography>}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleShareConfirm(friend.userId || friend._id)}
                      disabled={isSharing}
                      disableElevation
                      sx={{
                        borderRadius: 6,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        bgcolor: '#ee9917',
                        '&:hover': { bgcolor: '#d88812' }
                      }}
                    >
                      {isSharing ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : "Send"}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
          <Button onClick={() => setShareDialogOpen(false)} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, borderRadius: 3, px: 3 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm" disableScrollLock={true}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={!editPostContent.trim()}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={toast.open} autoHideDuration={4000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Feed;