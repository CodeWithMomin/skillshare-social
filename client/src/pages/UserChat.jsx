import React, { useState, useEffect, useRef } from "react";
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
  Badge,
  Dialog,
  Menu,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { Send, Search, MoreVert, Phone, Videocam, ArrowBack, Check, DoneAll, AttachFile, Close, Download, Share } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import VideoCall from "./VideoCall";

const UserChat = () => {
  const { getUserProfile } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewerImage, setViewerImage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [sharingFriendId, setSharingFriendId] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  // ── Calling State ──────────────────────────────────────────────────────────
  const [callState, setCallState] = useState(null);
  // callState shape: { isIncoming, isOutgoing, isActive, callType, caller, callee, offer }

  const myProfileRef = useRef(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedFriendRef = useRef(selectedFriend);
  useEffect(() => {
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await getUserProfile();
        if (res) {
          setMyUserId(res._id);
          if (res.friends) {
            setFriends(res.friends);
          }
          // Fetch initial unread counts
          const token = localStorage.getItem("authToken");
          if (token) {
            fetch("http://localhost:5000/api/messages/unread-counts", {
              headers: { "Authorization": `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(data => {
                if (!data.error) setUnreadCounts(data);
              })
              .catch(console.error);
          }
        }
      } catch (error) {
        console.error("Failed to load friends for chat", error);
      }
    };
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch own profile for showing caller info
  useEffect(() => {
    if (myUserId) {
      const token = localStorage.getItem("authToken");
      fetch("http://localhost:5000/api/users/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { myProfileRef.current = data; })
        .catch(console.error);
    }
  }, [myUserId]);

  // Socket Connection & Listener
  useEffect(() => {
    if (myUserId) {
      socket.io.opts.query = { userId: myUserId };
      socket.connect();

      socket.on("newMessage", (msg) => {
        const currSelected = selectedFriendRef.current;
        if (currSelected && currSelected.userId === msg.senderId) {
          socket.emit("markAsRead", { senderId: msg.senderId, receiverId: myUserId });
        } else {
          setUnreadCounts(counts => ({
            ...counts,
            [msg.senderId]: (counts[msg.senderId] || 0) + 1
          }));
        }

        // Only append if it belongs to the currently selected friend
        setChatHistory((prev) => {
          return prev.some(existingMsg => existingMsg._id === msg._id) ? prev : [...prev, msg];
        });
      });

      socket.on("messagesRead", ({ readerId }) => {
        setChatHistory((prev) =>
          prev.map(msg =>
            (msg.senderId === myUserId && msg.status !== 'read') ? { ...msg, status: 'read' } : msg
          )
        );
      });

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // ── Incoming Call ──────────────────────────────────────────────────────
      socket.on("incomingCall", ({ from, caller, callType, offer }) => {
        setCallState({
          isIncoming: true, isOutgoing: false, isActive: false,
          callType, caller, callee: null, offer,
        });
      });
    }

    return () => {
      socket.off("newMessage");
      socket.off("messagesRead");
      socket.off("getOnlineUsers");
      socket.off("incomingCall");
      socket.disconnect();
    };
  }, [myUserId]);

  // Fetch Chat History when a friend is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedFriend) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/messages/${selectedFriend.userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setChatHistory(data);

        // Clear local unread counts for this friend
        setUnreadCounts(prev => {
          if (!prev[selectedFriend.userId]) return prev;
          const updated = { ...prev };
          delete updated[selectedFriend.userId];
          return updated;
        });

      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [selectedFriend]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "" && !selectedImage) return;

    // Cache and clear instantly to prevent double submits
    const msgText = message;
    const imgFile = selectedImage;
    const previewBackup = imagePreview;

    setMessage("");
    clearImage();

    try {
      const token = localStorage.getItem("authToken");

      const formData = new FormData();
      if (msgText) formData.append("message", msgText);
      if (imgFile) formData.append("image", imgFile);

      const response = await fetch(`http://localhost:5000/api/messages/send/${selectedFriend.userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setChatHistory((prev) => [...prev, data]);
      } else {
        setMessage(msgText);
        setSelectedImage(imgFile);
        setImagePreview(previewBackup);
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessage(msgText);
      setSelectedImage(imgFile);
      setImagePreview(previewBackup);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, selectedFriend]);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 9999, bgcolor: "#fff", overflow: "hidden" }}>

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
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: onlineUsers.includes(friend.userId) ? "#44b700" : "#d3d3d3",
                          color: onlineUsers.includes(friend.userId) ? "#44b700" : "#d3d3d3",
                          boxShadow: `0 0 0 2px #fff`,
                        }
                      }}
                    >
                      <Avatar src={friend.profilePic} />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle2" fontWeight={selectedFriend?.userId === friend.userId ? "bold" : "medium"}>{friend.name}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary" noWrap>
                      {onlineUsers.includes(friend.userId) ? "Online" : "Offline"}
                    </Typography>}
                  />
                  {unreadCounts[friend.userId] > 0 && (
                    <Badge badgeContent={unreadCounts[friend.userId]} color="primary" sx={{ mr: 1 }} />
                  )}
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
                  <Typography variant="caption" color={onlineUsers.includes(selectedFriend.userId) ? "green" : "text.secondary"}>
                    {onlineUsers.includes(selectedFriend.userId) ? "Online" : "Offline"}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => {
                  setCallState({
                    isIncoming: false, isOutgoing: true, isActive: false,
                    callType: "video",
                    caller: myProfileRef.current ? { userId: myUserId, name: myProfileRef.current.name, profilePic: myProfileRef.current.profilePic } : { userId: myUserId, name: "You" },
                    callee: { userId: selectedFriend.userId, name: selectedFriend.name, profilePic: selectedFriend.profilePic },
                    offer: null,
                  });
                }}><Videocam /></IconButton>
                <IconButton color="primary" onClick={() => {
                  setCallState({
                    isIncoming: false, isOutgoing: true, isActive: false,
                    callType: "audio",
                    caller: myProfileRef.current ? { userId: myUserId, name: myProfileRef.current.name, profilePic: myProfileRef.current.profilePic } : { userId: myUserId, name: "You" },
                    callee: { userId: selectedFriend.userId, name: selectedFriend.name, profilePic: selectedFriend.profilePic },
                    offer: null,
                  });
                }}><Phone /></IconButton>
                <IconButton><MoreVert /></IconButton>
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              {chatHistory.map((chat) => {
                const isMe = chat.senderId === myUserId;
                const timeStr = new Date(chat.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <Box
                    key={chat._id || chat.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        px: 2,
                        borderRadius: 2,
                        bgcolor: isMe ? "#0a66c2" : "#fff",
                        color: isMe ? "#fff" : "text.primary",
                        borderTopRightRadius: isMe ? 0 : 8,
                        borderTopLeftRadius: isMe ? 8 : 0,
                      }}
                    >
                      {chat.imageUrl && (
                        <Box sx={{ mb: (chat.message || chat.text) ? 1 : 0 }}>
                          <img
                            src={chat.imageUrl}
                            alt="attachment"
                            onClick={() => setViewerImage(chat.imageUrl)}
                            style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8, objectFit: "cover", cursor: "pointer" }}
                          />
                        </Box>
                      )}
                      {(chat.message || chat.text) && (
                        <Typography variant="body2">{chat.message || chat.text}</Typography>
                      )}
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, alignSelf: isMe ? "flex-end" : "flex-start", display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {timeStr}
                      {isMe && (
                        chat.status === "read" ? <DoneAll sx={{ fontSize: 16, color: "#4fc3f7" }} /> :
                          chat.status === "delivered" ? <DoneAll sx={{ fontSize: 16 }} /> :
                            <Check sx={{ fontSize: 16 }} />
                      )}
                    </Typography>
                  </Box>
                )
              })}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input Box */}
            <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 1 }}>

              {/* Image Preview Area */}
              {imagePreview && (
                <Box sx={{ position: "relative", width: "fit-content", mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 2, bgcolor: "#f9f9f9" }}>
                  <IconButton
                    size="small"
                    onClick={clearImage}
                    sx={{ position: "absolute", top: -10, right: -10, bgcolor: "black", color: "white", "&:hover": { bgcolor: "gray" }, width: 22, height: 22 }}
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                  <img src={imagePreview} alt="Preview" style={{ maxHeight: 100, borderRadius: 4 }} />
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                <IconButton onClick={() => fileInputRef.current.click()} color="primary" sx={{ color: "#555" }}>
                  <AttachFile />
                </IconButton>

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

      {/* FULL-SCREEN IMAGE VIEWER MODAL */}
      <Dialog
        open={Boolean(viewerImage)}
        onClose={() => setViewerImage(null)}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 10000 }}
        PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

          <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1, zIndex: 10 }}>
            <IconButton
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
            >
              <MoreVert fontSize="large" />
            </IconButton>

            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)} sx={{ zIndex: 10005 }}>
              <MenuItem onClick={async () => {
                setMenuAnchorEl(null);
                try {
                  const response = await fetch(viewerImage);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `attachment-${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (error) {
                  console.error("Download failed:", error);
                }
              }}>
                <Download fontSize="small" sx={{ mr: 1 }} /> Save
              </MenuItem>
              <MenuItem onClick={() => {
                setMenuAnchorEl(null);
                setForwardDialogOpen(true);
              }}>
                <Share fontSize="small" sx={{ mr: 1 }} /> Forward
              </MenuItem>
            </Menu>

            <IconButton
              onClick={() => { setViewerImage(null); setMenuAnchorEl(null); }}
              sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
            >
              <Close fontSize="large" />
            </IconButton>
          </Box>

          <img
            src={viewerImage}
            alt="Full Screen"
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 8 }}
          />
        </Box>
      </Dialog>

      {/* WHATSAPP STYLE FORWARD DIALOG */}
      <Dialog
        open={forwardDialogOpen}
        onClose={() => sharingFriendId === null && setForwardDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: 11000 }}
      >
        <DialogTitle sx={{ fontWeight: "bold", borderBottom: "1px solid #e0e0e0" }}>Forward to...</DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ pt: 0 }}>
            {friends.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">No connections available.</Typography>
              </Box>
            ) : (
              friends.map((friend) => {
                const isThisFriendSharing = sharingFriendId === friend.userId;
                const isAnySharing = sharingFriendId !== null;

                return (
                  <ListItem
                    button
                    key={friend.userId}
                    disabled={isAnySharing}
                    onClick={async () => {
                      setSharingFriendId(friend.userId);
                      try {
                        // 1. Fetch the actual image back into a File Blob
                        const response = await fetch(viewerImage);
                        const blob = await response.blob();
                        const file = new File([blob], "shared_image.jpg", { type: blob.type });

                        // 2. Prepare FormData to send to internal API
                        const formData = new FormData();
                        formData.append("image", file);

                        const token = localStorage.getItem("authToken");
                        const shareRes = await fetch(`http://localhost:5000/api/messages/send/${friend.userId}`, {
                          method: "POST",
                          headers: { "Authorization": `Bearer ${token}` },
                          body: formData
                        });

                        if (shareRes.ok) {
                          setShareSuccess(true);
                          setForwardDialogOpen(false);
                          setViewerImage(null);
                        }
                      } catch (err) {
                        console.error("Failed to forward:", err);
                      } finally {
                        setSharingFriendId(null);
                      }
                    }}
                    sx={{ py: 1.5, px: 2, "&:hover": { bgcolor: "#f3f2ef" } }}
                  >
                    <ListItemAvatar>
                      <Avatar src={friend.profilePic} />
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle2" fontWeight="medium">{friend.name}</Typography>} />
                    <IconButton edge="end" color="primary" disabled={isAnySharing}>
                      {isThisFriendSharing ? <CircularProgress size={20} /> : <Send fontSize="small" />}
                    </IconButton>
                  </ListItem>
                )
              })
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #e0e0e0", p: 1.5 }}>
          <Button onClick={() => setForwardDialogOpen(false)} color="inherit" disabled={sharingFriendId !== null}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* SUCCESS TOAST FOR SHARING */}
      <Snackbar open={shareSuccess} autoHideDuration={3000} onClose={() => setShareSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ zIndex: 10000 }}>
        <Alert onClose={() => setShareSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Image shared successfully!
        </Alert>
      </Snackbar>

      {/* ── VIDEO / AUDIO CALL OVERLAY ── */}
      {callState && (
        <VideoCall
          callState={callState}
          myUserId={myUserId}
          onCallEnd={() => setCallState(null)}
        />
      )}

    </Box>
  );
};

export default UserChat;