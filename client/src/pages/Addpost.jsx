import React, { useState } from "react";
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

const AddPost = ({ onAddPost }) => {
  const { user } = useAuth();

  const currentUser = {
    user_id: user?._id,
    name: user?.fullName || user?.username || "Anonymous",
    email: user?.email,
    avatar: user?.avatar || "https://i.pravatar.cc/150?img=5",
    title: user?.title || user?.role || "Software Engineer",
  };

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

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

  const handleSubmit = () => {
    if (!content.trim()) return;

    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      title: currentUser.title,
      avatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      content: content.trim(),
      likes: 0,
      comments: 0,
      shares: 0,
      tags,
    };

    onAddPost(newPost);

    setContent("");
    setTags([]);
    setTagInput("");
    setOpen(false);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 2 }}>
      <CardContent>
        {!open ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar src={currentUser.avatar} />

            <Box
              onClick={() => setOpen(true)}
              sx={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "20px",
                px: 2,
                py: 1,
                cursor: "pointer",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Start a post...
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Avatar src={currentUser.avatar} />

                <Box>
                  <Typography fontWeight="bold">
                    {currentUser.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {currentUser.title}
                  </Typography>
                </Box>
              </Box>

              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              multiline
              minRows={4}
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />

            <TextField
              size="small"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />

            {tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
            )}

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <IconButton size="small">
                  <ImageIcon />
                </IconButton>

                <IconButton size="small">
                  <VideoLibraryIcon />
                </IconButton>

                <IconButton size="small">
                  <ArticleIcon />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                disabled={!content.trim()}
                onClick={handleSubmit}
              >
                Post
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPost;