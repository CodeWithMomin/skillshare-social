import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Button,
  Divider,
  TextField,
  Chip,
} from "@mui/material";

import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AddPost = ({ onAddPost }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const currentUser = {
    user_id: user?._id,
    name: user?.fullName || user?.username || "Anonymous",
    email: user?.email,
    avatar: user?.profilePic || user?.avatar || "https://i.pravatar.cc/150?img=5",
    title: user?.title || user?.role || "Software Engineer",
  };

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Media States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mType, setMType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.trim().replace(/^#/, "");

      if (!tags.includes(tag)) {
        setTags((prev) => [...prev, tag]);
      }

      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!open) setOpen(true); // Open modal if started from outside
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMType(file.type.startsWith("video/") ? "video" : "image");
    }
    // clear input value so the same file can be selected again if removed
    if (e.target) e.target.value = '';
  };

  const handleRemoveMedia = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setMType("");
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) return;

    setUploading(true);
    let finalMediaUrl = "";
    let finalMediaType = "";

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("media", selectedFile);
        const token = localStorage.getItem("authToken");

        const res = await fetch("http://localhost:5000/api/posts/upload-media", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          finalMediaUrl = data.mediaUrl;
          finalMediaType = data.mediaType;
        } else {
          toast.error("Failed to upload media");
          setUploading(false);
          return;
        }
      }

      const newPost = {
        id: Date.now(),
        author: currentUser.name,
        userId: currentUser.user_id,
        title: currentUser.title,
        avatar: currentUser.avatar,
        timestamp: new Date().toISOString(),
        content: content.trim(),
        likes: 0,
        comments: 0,
        shares: 0,
        tags,
        ...(finalMediaUrl && { mediaUrl: finalMediaUrl }),
        ...(finalMediaType && { mediaType: finalMediaType }),
      };

      await onAddPost(newPost);

      setContent("");
      setTags([]);
      setTagInput("");
      handleRemoveMedia();
      setOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        mb: 2,
        overflow: "hidden"
      }}
    >
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
      />
      <CardContent sx={{ p: '0 !important' }}>
        {!open ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Avatar src={currentUser.avatar} sx={{ width: 48, height: 48 }} />

              <Box
                onClick={() => setOpen(true)}
                sx={{
                  flex: 1,
                  border: "1px solid #dce0e5",
                  bgcolor: "#f8f9fa",
                  borderRadius: "30px",
                  px: 2.5,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    bgcolor: "#f0f2f5",
                  }
                }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: "0.95rem" }}>
                  Start a post...
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5, px: 1 }}>
              <Button
                startIcon={<ImageIcon sx={{ color: "#378fe9" }} />}
                sx={{ textTransform: "none", color: "#5e6c77", fontWeight: 600, "&:hover": { bgcolor: "#f3f2ef" }, px: 2, borderRadius: 2 }}
                onClick={() => fileInputRef.current.click()}
              >
                Media
              </Button>
              <Button
                startIcon={<VideoLibraryIcon sx={{ color: "#5f9b41" }} />}
                sx={{ textTransform: "none", color: "#5e6c77", fontWeight: 600, "&:hover": { bgcolor: "#f3f2ef" }, px: 2, borderRadius: 2 }}
                onClick={() => fileInputRef.current.click()}
              >
                Video
              </Button>
              <Button
                startIcon={<ArticleIcon sx={{ color: "#e16745" }} />}
                sx={{ textTransform: "none", color: "#5e6c77", fontWeight: 600, "&:hover": { bgcolor: "#f3f2ef" }, px: 2, borderRadius: 2 }}
                onClick={() => setOpen(true)}
              >
                Write article
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Avatar src={currentUser.avatar} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography fontWeight={700} color="#111" sx={{ fontSize: "1rem" }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Post to Anyone
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={() => { setOpen(false); handleRemoveMedia(); setContent(""); }} sx={{ bgcolor: "#f3f4f6", "&:hover": { bgcolor: "#e5e7eb" } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <TextField
              multiline
              minRows={selectedFile ? 2 : 5}
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "1.1rem", lineHeight: 1.5, color: "#111" }
              }}
              sx={{ mt: 1 }}
            />

            {previewUrl && (
              <Box sx={{ position: "relative", mt: 1, borderRadius: 3, overflow: "hidden", border: "1px solid #e0e0e0" }}>
                <IconButton
                  size="small"
                  onClick={handleRemoveMedia}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    zIndex: 10
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                {mType === "video" ? (
                  <video src={previewUrl} controls style={{ width: "100%", maxHeight: "400px", objectFit: "contain", display: "block", backgroundColor: "#000" }} />
                ) : (
                  <img src={previewUrl} alt="Preview" style={{ width: "100%", maxHeight: "400px", objectFit: "contain", display: "block" }} />
                )}
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <TextField
                size="small"
                placeholder="Add hashtag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#f8f9fa",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "#dce0e5" },
                    "&.Mui-focused fieldset": { borderColor: "#0a66c2", borderWidth: "1px" },
                  }
                }}
              />
            </Box>

            {tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ bgcolor: "#e8f0fe", color: "#0a66c2", fontWeight: 600 }}
                  />
                ))}
              </Box>
            )}

            <Divider sx={{ mt: 2, mx: -2.5 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1.5 }}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton onClick={() => fileInputRef.current.click()} size="small" sx={{ color: "#378fe9", bgcolor: "#f3f2ef", "&:hover": { bgcolor: "#e0e0e0" }, p: 1 }}>
                  <ImageIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => fileInputRef.current.click()} size="small" sx={{ color: "#5f9b41", bgcolor: "#f3f2ef", "&:hover": { bgcolor: "#e0e0e0" }, p: 1 }}>
                  <VideoLibraryIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "#e16745", bgcolor: "#f3f2ef", "&:hover": { bgcolor: "#e0e0e0" }, p: 1 }}>
                  <ArticleIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                disabled={(!content.trim() && !selectedFile) || uploading}
                onClick={handleSubmit}
                disableElevation
                sx={{
                  borderRadius: "24px",
                  px: 3,
                  py: 0.8,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: (content.trim() || selectedFile) && !uploading ? "#0a66c2" : "#e0e0e0",
                  color: (content.trim() || selectedFile) && !uploading ? "#fff" : "#999",
                  "&:hover": { bgcolor: "#004182" }
                }}
              >
                {uploading ? "Posting..." : "Post"}
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPost;