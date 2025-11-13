import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
const Notificationlogo = () => {
  const navigate = useNavigate();
  const handleNotificationClick = () => {
    navigate("/notifications");
  };
  return (
    <NotificationsIcon
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
      onClick={handleNotificationClick}
    />
  );
};

export default Notificationlogo;
