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
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { usePosts } from "../context/PostContext";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const Feed = () => {
  // ⭐ Create Post States
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // ⭐ Feed Reactions/Comments (your existing code)
  const [showEmojis, setShowEmojis] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState({});
  const [showComment, setShowComment] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  // ⭐ Dummy users for example feed
  const users = [
    { name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  ];

  // ⭐ Handle File Input
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // ⭐ Remove a single image
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  // ⭐ Submit Post
 // Import context


// Inside your component:
const { createPost } = usePosts();

const handleCreatePost = async () => {
  if (!caption.trim() && images.length === 0) {
    return toast.error("Write something or select at least one image!");
  }

  try {
    // Send request to backend
    const result = await createPost(caption, images);

    if (result?.success) {
      toast.success("Post uploaded successfully!");

      // Reset UI
      setCaption("");
      setImages([]);
      setPreviewImages([]);
    } else {
      toast.error("Failed to create post");
    }
  } catch (err) {
    toast.error("Something went wrong.");
  }
};


  // Dummy generated posts
  const posts = Array.from({ length: 5 }, (_, i) => {
    const user = users[i % users.length];
    return {
      id: i + 1,
      user,
      content: `This is post number ${i + 1}`,
      image: `https://picsum.photos/seed/${i + 1}/600/400`,
     
    };
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 2 }}>
      
      {/* --------------------------------------------------------------- */}
      {/* ⭐ SEXY CREATE POST CARD */}
      {/* --------------------------------------------------------------- */}
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Create a Post
        </Typography>

        {/* Caption Input */}
        <TextField
          fullWidth
          multiline
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
        />

        {/* Upload Images */}
        <Box
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 3,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
              borderColor: "#1976d2",
              background: "#f6faff",
            },
          }}
          onClick={() => document.getElementById("post-image-input").click()}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "#888" }} />
          <Typography sx={{ mt: 1, color: "#666" }}>
            Click to upload images (max 10)
          </Typography>

          <input
            id="post-image-input"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
        </Box>

        {/* Image Preview Grid */}
        {previewImages.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {previewImages.map((src, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={src}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                    }}
                  />

                  {/* Remove button */}
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(0,0,0,0.4)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Post Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            background:"#ee9917"
          }}
          onClick={handleCreatePost}
          disabled={!caption && images.length === 0}
        >
          Post
        </Button>
      </Card>

      {/* --------------------------------------------------------------- */}
      {/* ⭐ EXISTING FEED POSTS BELOW */}
      {/* --------------------------------------------------------------- */}
      {posts.map((post) => (
        <Card key={post.id} sx={{ borderRadius: 2, boxShadow: 3, position: "relative" }}>
          <CardHeader avatar={<Avatar src={post.user.avatar} />} title={post.user.name} />

          <CardContent>
            <Typography>{post.content}</Typography>
          </CardContent>

          <CardMedia
            component="img"
            image={post.image}
            alt={`Post ${post.id}`}
            sx={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 1 }}
          />
        </Card>
      ))}
    </Box>
  );
};

export default Feed;
