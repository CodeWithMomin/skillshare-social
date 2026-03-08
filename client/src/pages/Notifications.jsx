import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsIcon from "@mui/icons-material/Notifications";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(Array.isArray(response.data) ? response.data : response);
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Mark single read error:", error);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbUpIcon sx={{ color: "#1976d2", fontSize: 20 }} />;
      case "comment":
        return <ChatBubbleIcon sx={{ color: "#388e3c", fontSize: 20 }} />;
      case "connection":
        return <PersonAddIcon sx={{ color: "#0a66c2", fontSize: 20 }} />;
      default:
        return <NotificationsIcon sx={{ color: "#ee9917", fontSize: 20 }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Notifications
        </Typography>
        {notifications.some((n) => !n.read) && (
          <Button variant="outlined" size="small" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary">You have no notifications yet.</Typography>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <List disablePadding>
            {notifications.map((notification, idx) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? "white" : "#f0f7ff",
                    transition: "background-color 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: notification.read ? "#f9f9f9" : "#e3f0fa",
                    },
                    py: 2
                  }}
                  onClick={() => {
                    if (!notification.read) handleMarkAsRead(notification._id);
                    if (notification.type === "connection") {
                      navigate("/friend-requests");
                    }
                  }}
                  secondaryAction={
                    !notification.read ? (
                      <IconButton edge="end" color="primary" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}>
                        <CheckCircleIcon />
                      </IconButton>
                    ) : null
                  }
                >
                  <ListItemAvatar sx={{ position: "relative", mr: 1 }}>
                    <Avatar
                      src={notification.sender?.profilePic || notification.sender?.avatar}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        bgcolor: "white",
                        borderRadius: "50%",
                        p: 0.5,
                        display: "flex",
                      }}
                    >
                      {renderIcon(notification.type)}
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                        {notification.message || (
                          <>
                            <strong>{notification.sender?.fullName || notification.sender?.username || "Someone"}</strong>{" "}
                            {notification.type === "like" ? "liked your post" : "commented on your post"}
                          </>
                        )}
                      </Typography>
                    }
                    secondary={
                      <>
                        {notification.post?.content && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}>
                            "{notification.post.content.length > 50 ? notification.post.content.substring(0, 50) + "..." : notification.post.content}"
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5 }}>
                          {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
};

export default Notifications;