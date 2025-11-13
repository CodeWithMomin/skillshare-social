import React from "react";
import { useNavigate } from "react-router-dom";
import TextsmsIcon from "@mui/icons-material/Textsms";
import "../App.css";

const ChatLauncher = () => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat"); // navigates to the chat page
  };

  return (
    <TextsmsIcon
      sx={{
        fontSize: 30,
        color: "#ee9917",
        m: 2,
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
  );
};

export default ChatLauncher;
