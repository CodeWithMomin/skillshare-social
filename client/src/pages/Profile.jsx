import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    headline: "Frontend Developer",
    location: "New York, USA",
    skills: ["React", "JavaScript", "CSS"],
    profilePicture: null,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleCompleteProfile = () => navigate("/complete-profile");

  const handleProfilePictureClick = () => fileInputRef.current.click();

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profilePicture: imageURL }));
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ ...user, profilePicture: imageURL })
      );
    }
  };

  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "center", // horizontal centering
    mt: 5, // margin-top to move it down from top
  }}
>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          width: 260,
          border: "1px solid #ddd",
          borderRadius: 3, // smoother corners
          boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={user.profilePicture}
            sx={{ width: 80, height: 80 }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#eee" },
              width: 24,
              height: 24,
            }}
            onClick={handleProfilePictureClick}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePictureChange}
          />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ mt: 1, fontWeight: "bold", textAlign: "center" }}
        >
          {user.fullName}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          {user.headline}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {user.location}
        </Typography>

        <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
          Skills: {user.skills.length ? user.skills.join(", ") : "None"}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 0.5, px: 2, fontSize: "0.75rem", borderRadius: 2 }}
          onClick={handleCompleteProfile}
        >
          Complete Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
