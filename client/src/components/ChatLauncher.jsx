import React from "react";
import { useNavigate } from "react-router-dom";
import TextsmsIcon from "@mui/icons-material/Textsms";
import "../App.css";

import { Badge } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const ChatLauncher = () => {
  const navigate = useNavigate();
  const { totalUnreadCount } = useAuth();

  const handleChatClick = () => {
    navigate("/chat"); // navigates to the chat page
  };

  return (
    <Badge badgeContent={totalUnreadCount} color="error" sx={{ mr: 2 }}>
      <TextsmsIcon
        sx={{
          fontSize: 28,
          color: "#ee9917",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            scale: 1.1,
            textShadow: "0 0 10px rgba(25, 118, 210, 0.7)",
            transform: "translateY(-2px)",
          },
        }}
        onClick={handleChatClick}
      />
    </Badge>
  );
};

export default ChatLauncher;
