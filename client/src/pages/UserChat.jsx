import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { Send, Search, MoreVert, Phone, Videocam, ArrowBack } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserChat = () => {
  const { getUserProfile } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "them", text: "Hey! How are you doing?", time: "10:00 AM" },
    { id: 2, sender: "me", text: "I'm doing great, working on a new project!", time: "10:05 AM" },
    { id: 3, sender: "them", text: "That sounds awesome. We should catch up soon.", time: "10:10 AM" },
  ]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getUserProfile();
        if (res && res.friends) {
          setFriends(res.friends);
          if (res.friends.length > 0) {
            setSelectedFriend(res.friends[0]); // Auto-select first friend
          }
        }
      } catch (error) {
        console.error("Failed to load friends for chat", error);
      }
    };
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
  };

  return (
    <Card sx={{ display: "flex", height: "calc(100vh - 120px)", borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>

      {/* LEFT SIDEBAR - FRIENDS LIST */}
      <Box sx={{ width: 320, borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>

        {/* Search Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: "#555" }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              Messaging
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f3f2ef", borderRadius: "8px", px: 1.5, py: 0.5 }}>
            <Search sx={{ color: "#555", mr: 1 }} fontSize="small" />
            <TextField
              placeholder="Search messages"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              fullWidth
              sx={{ fontSize: "0.9rem" }}
            />
          </Box>
        </Box>

        {/* Contacts List */}
        <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
          {friends.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              <Typography variant="body2">No connections available to chat.</Typography>
            </Box>
          ) : (
            friends.map((friend) => (
              <React.Fragment key={friend.userId}>
                <ListItem
                  button
                  onClick={() => setSelectedFriend(friend)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: selectedFriend?.userId === friend.userId ? "#f3f2ef" : "transparent",
                    borderLeft: selectedFriend?.userId === friend.userId ? "4px solid #0a66c2" : "4px solid transparent",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f3f2ef" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={friend.profilePic} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" fontWeight={selectedFriend?.userId === friend.userId ? "bold" : "medium"}>{friend.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary" noWrap>Available to chat</Typography>}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Box>

      {/* RIGHT PANEL - CHAT INTERFACE */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#f9f9f9" }}>

        {selectedFriend ? (
          <>
            {/* Chat Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar src={selectedFriend.profilePic} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedFriend.name}
                  </Typography>
                  <Typography variant="caption" color="green">
                    Online
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton color="primary"><Videocam /></IconButton>
                <IconButton color="primary"><Phone /></IconButton>
                <IconButton><MoreVert /></IconButton>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              {chatHistory.map((chat) => (
                <Box
                  key={chat.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: chat.sender === "me" ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: chat.sender === "me" ? "#0a66c2" : "#fff",
                      color: chat.sender === "me" ? "#fff" : "text.primary",
                      borderTopRightRadius: chat.sender === "me" ? 0 : 8,
                      borderTopLeftRadius: chat.sender === "me" ? 8 : 0,
                    }}
                  >
                    <Typography variant="body2">{chat.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, alignSelf: chat.sender === "me" ? "flex-end" : "flex-start" }}
                  >
                    {chat.time}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Message Input Box */}
            <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Write a message..."
                variant="outlined"
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    bgcolor: "#f3f2ef",
                  }
                }}
              />
              <IconButton color="primary" onClick={handleSendMessage} sx={{ bgcolor: "#e8f0fe", "&:hover": { bgcolor: "#d3e3fd" } }}>
                <Send fontSize="small" />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "text.secondary" }}>
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-chat-illustration-download-in-svg-png-gif-file-formats--message-box-logo-no-available-messages-data-states-pack-design-development-illustrations-6405622.png?f=webp" alt="No Chat" width="200" style={{ opacity: 0.6, marginBottom: 16 }} />
            <Typography variant="h6">Your Messages</Typography>
            <Typography variant="body2">Select a connected friend to start checking your conversations.</Typography>
          </Box>
        )}
      </Box>

    </Card>
  );
};

export default UserChat;