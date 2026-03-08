import React, { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notificationlogo = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        const data = response.data || response;
        if (Array.isArray(data)) {
          setUnreadCount(data.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
    
    // Simple polling for new notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <Badge badgeContent={unreadCount} color="error" overlap="circular" max={99}>
      <NotificationsIcon
        sx={{
          fontSize: 28,
          color: "#ee9917",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            scale: "1.1",
            textShadow: "0 0 10px rgba(25, 118, 210, 0.7)",
            transform: "translateY(-2px)",
          },
        }}
        onClick={handleNotificationClick}
      />
    </Badge>
  );
};

export default Notificationlogo;
