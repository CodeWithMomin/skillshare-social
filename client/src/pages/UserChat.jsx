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
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Send, Search, MoreVert, Phone, Videocam, VideocamOff, ArrowBack, Check, DoneAll, AttachFile, Close, Download, Share, Image, InsertDriveFile, PlayCircle, Delete, Block } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import VideoCall from "./VideoCall";
import api from "../services/api";
import { generateKeyPair, encryptMessage, decryptMessage } from "../utils/crypto";

const UserChat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { getUserProfile, globalUnreadCounts, setGlobalUnreadCounts } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewerImage, setViewerImage] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [sharingFriendId, setSharingFriendId] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [typingUsers, setTypingUsers] = useState({}); // { [friendId]: boolean }
  const typingTimeoutRef = useRef({}); // { [friendId]: timeoutId }
  const [friendPublicKey, setFriendPublicKey] = useState(null);
  const friendPublicKeyRef = useRef(null);

  useEffect(() => {
    friendPublicKeyRef.current = friendPublicKey;
  }, [friendPublicKey]);

  useEffect(() => {
    if (myUserId) {
      if (!localStorage.getItem("e2ee_secretKey") || !localStorage.getItem("e2ee_publicKey")) {
        const { publicKey, secretKey } = generateKeyPair();
        localStorage.setItem("e2ee_publicKey", publicKey);
        localStorage.setItem("e2ee_secretKey", secretKey);
        api.put("/users/profile/complete", { publicKey }).catch(console.error);
      }
    }
  }, [myUserId]);

  // ── Calling State ──────────────────────────
  const [callState, setCallState] = useState(null);
  const myProfileRef = useRef(null);

  const fileInputRef = useRef(null); // images
  const videoInputRef = useRef(null); // videos
  const docInputRef = useRef(null); // documents
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
          // Fetch initial unread counts via centralized API service
          const data = await api.get("/messages/unread-counts");
          if (data && !data.error) setGlobalUnreadCounts(data);
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
      api.get("/users/profile")
        .then(data => { myProfileRef.current = data; })
        .catch(console.error);
    }
  }, [myUserId]);

  // Socket Connection & Listener
  useEffect(() => {
    if (myUserId) {
      console.log("Connecting socket for user:", myUserId);
      socket.auth = { userId: myUserId };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.on("newMessage", (msg) => {
        const currSelected = selectedFriendRef.current;
        if (currSelected && currSelected.userId === msg.senderId) {
          socket.emit("markAsRead", { senderId: msg.senderId, receiverId: myUserId });
        }
        // AuthContext now handles incrementing globalUnreadCounts globally.
        let msgToAppend = msg;
        const fPubKey = friendPublicKeyRef.current;
        const mySecKey = localStorage.getItem("e2ee_secretKey");
        if (msg.message && mySecKey && fPubKey) {
          const decMsg = decryptMessage(msg.message, mySecKey, fPubKey);
          if (decMsg) msgToAppend.message = decMsg;
        }

        // Only append if it belongs to the currently selected friend
        setChatHistory((prev) => {
          return prev.some(existingMsg => existingMsg._id === msgToAppend._id) ? prev : [...prev, msgToAppend];
        });
      });

      socket.on("typing", ({ senderId }) => {
        console.log("Typing from:", senderId);
        setTypingUsers(prev => ({ ...prev, [senderId]: true }));
      });

      socket.on("stopTyping", ({ senderId }) => {
        console.log("Stop typing from:", senderId);
        setTypingUsers(prev => ({ ...prev, [senderId]: false }));
      });

      socket.on("messageDeleted", ({ messageId }) => {
        setChatHistory(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, isDeleted: true, message: "", imageUrl: "", fileUrl: "" } : msg
        ));
      });

      socket.on("messagesRead", ({ readAt }) => {
        setChatHistory((prev) =>
          prev.map(msg =>
            (msg.senderId === myUserId && msg.status !== 'read') ? { ...msg, status: 'read', readAt } : msg
          )
        );
      });

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // ── Incoming Call ──────────────────────────────────────────────────────
      socket.on("incomingCall", ({ caller, callType, offer }) => {
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
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageDeleted");
      socket.off("incomingCall");
      socket.disconnect();
    };
  }, [myUserId]);

  // Fetch Chat History when a friend is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedFriend) return;
      try {
        let fPubKey = null;
        try {
          const friendRes = await api.get("/users/user/" + selectedFriend.userId);
          if (friendRes?.data?.user?.publicKey) {
            fPubKey = friendRes.data.user.publicKey;
          } else if (friendRes?.user?.publicKey) {
            fPubKey = friendRes.user.publicKey;
          }
          setFriendPublicKey(fPubKey);
        } catch (err) {
          console.error("Could not fetch friend public key", err);
          setFriendPublicKey(null);
        }

        const data = await api.get(`/messages/${selectedFriend.userId}`);
        const mySecKey = localStorage.getItem("e2ee_secretKey");

        let displayHistory = data;
        if (Array.isArray(data)) {
          displayHistory = data.map(msg => {
            if (msg.message && fPubKey && mySecKey) {
              const decMsg = decryptMessage(msg.message, mySecKey, fPubKey);
              if (decMsg && decMsg !== msg.message) {
                return { ...msg, message: decMsg };
              }
            }
            return msg;
          });
        }

        setChatHistory(displayHistory || []);

        // Clear local unread counts for this friend
        setGlobalUnreadCounts(prev => {
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
  }, [selectedFriend, setGlobalUnreadCounts]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Show preview only for images
      if (file.type.startsWith("image/")) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        // For videos and docs, show file name as preview
        setImagePreview(file.name);
      }
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!selectedFriend) return;

    // Emit typing event
    socket.emit("typing", { senderId: myUserId, receiverId: selectedFriend.userId });

    // Clear existing timeout
    if (typingTimeoutRef.current[selectedFriend.userId]) {
      clearTimeout(typingTimeoutRef.current[selectedFriend.userId]);
    }

    // Set new timeout to emit stopTyping
    typingTimeoutRef.current[selectedFriend.userId] = setTimeout(() => {
      socket.emit("stopTyping", { senderId: myUserId, receiverId: selectedFriend.userId });
    }, 2000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  }

  const handleSendMessage = async () => {
    if (message.trim() === "" && !selectedImage) return;

    // Cache and clear instantly to prevent double submits
    const msgText = message;
    const imgFile = selectedImage;
    const previewBackup = imagePreview;

    setMessage("");
    clearImage();

    // Immediately stop typing when message is sent
    if (selectedFriend) {
      socket.emit("stopTyping", { senderId: myUserId, receiverId: selectedFriend.userId });
      if (typingTimeoutRef.current[selectedFriend.userId]) {
        clearTimeout(typingTimeoutRef.current[selectedFriend.userId]);
      }
    }

    try {
      const formData = new FormData();
      let finalMsg = msgText;
      const mySecKey = localStorage.getItem("e2ee_secretKey");

      if (finalMsg && mySecKey && friendPublicKey) {
        finalMsg = encryptMessage(finalMsg, mySecKey, friendPublicKey) || finalMsg;
      }

      if (finalMsg) formData.append("message", finalMsg);
      if (imgFile) formData.append("image", imgFile);

      // Using our centralized api instance
      const data = await api.post(`/messages/send/${selectedFriend.userId}`, formData);

      if (data) {
        // Render plaintext in current user's UI instantly instead of ciphertext
        const msgToRender = { ...data, message: msgText };
        setChatHistory((prev) => [...prev, msgToRender]);
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

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await api.delete(`/messages/${messageId}`);
      if (res.success) {
        setChatHistory(prev => prev.map(msg =>
          msg._id === messageId ? { ...msg, isDeleted: true, message: "", imageUrl: "", fileUrl: "" } : msg
        ));
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, selectedFriend]);

  const showContactsList = !isMobile || !selectedFriend;
  const showChatArea = !isMobile || selectedFriend;

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 9999, bgcolor: "#fff", overflow: "hidden" }}>

      {/* LEFT SIDEBAR - FRIENDS LIST */}
      {showContactsList && (
        <Box sx={{ width: isMobile ? "100%" : 320, borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>

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
                    {globalUnreadCounts[friend.userId] > 0 && (
                      <Badge badgeContent={globalUnreadCounts[friend.userId]} color="primary" sx={{ mr: 1 }} />
                    )}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        </Box>
      )}

      {/* RIGHT PANEL - CHAT INTERFACE */}
      {showChatArea && (
        <Box sx={{ flex: 1, width: isMobile ? "100%" : "auto", display: "flex", flexDirection: "column", bgcolor: "#f9f9f9" }}>

          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {isMobile && (
                    <IconButton edge="start" sx={{ mr: 1, color: "#555" }} onClick={() => setSelectedFriend(null)}>
                      <ArrowBack />
                    </IconButton>
                  )}
                  <Avatar src={selectedFriend.profilePic} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedFriend.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: typingUsers[selectedFriend.userId] ? "#0a66c2" : onlineUsers.includes(selectedFriend.userId) ? "green" : "text.secondary", fontWeight: typingUsers[selectedFriend.userId] ? "bold" : "normal" }}>
                      {typingUsers[selectedFriend.userId] ? "typing..." : (onlineUsers.includes(selectedFriend.userId) ? "Online" : "Offline")}
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
                <Box sx={{ alignSelf: "center", bgcolor: "#fff3cd", color: "#856404", px: 2, py: 1, borderRadius: 2, fontSize: "0.8rem", textAlign: "center", maxWidth: "80%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  🔒 Messages are end-to-end encrypted. No one outside of this chat, not even SkillShare Social, can read them.
                </Box>
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
                        position: 'relative',
                        '&:hover .delete-btn': { opacity: 1 }
                      }}
                    >
                      {isMe && !chat.isDeleted && (
                        <IconButton
                          className="delete-btn"
                          size="small"
                          onClick={() => handleDeleteMessage(chat._id || chat.id)}
                          sx={{
                            position: 'absolute',
                            left: -35,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: '#d32f2f',
                            bgcolor: 'rgba(211, 47, 47, 0.05)',
                            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.15)' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          px: 2,
                          borderRadius: 2,
                          bgcolor: chat.isDeleted ? "#f0f0f0" : (isMe ? "#0a66c2" : "#fff"),
                          color: chat.isDeleted ? "#888" : (isMe ? "#fff" : "text.primary"),
                          borderTopRightRadius: isMe ? 0 : 8,
                          borderTopLeftRadius: isMe ? 8 : 0,
                          fontStyle: chat.isDeleted ? "italic" : "normal",
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        {chat.isDeleted ? (
                          <>
                            <Block sx={{ fontSize: 16, opacity: 0.6 }} />
                            <Typography variant="body2">This message was deleted</Typography>
                          </>
                        ) : (
                          <Box sx={{ width: "100%" }}>
                            {/* IMAGE bubble */}
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
                            {/* VIDEO bubble */}
                            {chat.fileType === "video" && chat.fileUrl && (
                              <Box sx={{ mb: (chat.message || chat.text) ? 1 : 0 }}>
                                <video
                                  src={chat.fileUrl}
                                  controls
                                  style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8 }}
                                />
                              </Box>
                            )}
                            {/* DOCUMENT bubble */}
                            {chat.fileType === "document" && chat.fileUrl && (
                              <Box
                                sx={{
                                  mb: (chat.message || chat.text) ? 1 : 0,
                                  display: "flex", alignItems: "center", gap: 1,
                                  bgcolor: isMe ? "rgba(255,255,255,0.15)" : "#f0f0f0",
                                  borderRadius: 2, p: 1.5, cursor: "pointer",
                                }}
                                onClick={() => window.open(chat.fileUrl, "_blank")}
                              >
                                <InsertDriveFile sx={{ fontSize: 32, color: isMe ? "#fff" : "#1976d2" }} />
                                <Box sx={{ overflow: "hidden" }}>
                                  <Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: 180 }}>
                                    {chat.fileName || "Document"}
                                  </Typography>
                                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    Tap to open
                                  </Typography>
                                </Box>
                                <Download sx={{ ml: "auto", opacity: 0.7, fontSize: 18, color: isMe ? "#fff" : "inherit" }} />
                              </Box>
                            )}
                            {(chat.message || chat.text) && (
                              <Typography variant="body2">{chat.message || chat.text}</Typography>
                            )}
                          </Box>
                        )}
                      </Paper>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, alignSelf: isMe ? "flex-end" : "flex-start", display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {timeStr}
                        {isMe && !chat.isDeleted && (
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} title={chat.status === "read" && chat.readAt ? `Seen ${new Date(chat.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ""}>
                            {chat.status === "read" ? (
                              <DoneAll sx={{ fontSize: 16, color: "#4fc3f7" }} />
                            ) : chat.status === "delivered" ? (
                              <DoneAll sx={{ fontSize: 16, color: "text.secondary" }} />
                            ) : (
                              <Check sx={{ fontSize: 16, color: "text.secondary" }} />
                            )}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  )
                })}
                {typingUsers[selectedFriend.userId] && (
                  <Box sx={{ alignSelf: "flex-start", ml: 1, p: 1, bgcolor: "#fff", borderRadius: 2, borderBottomLeftRadius: 0, boxShadow: 1, display: "flex", gap: 0.5, alignItems: "center" }}>
                    <Box sx={{ width: 6, height: 6, bgcolor: "#9e9e9e", borderRadius: "50%", animation: "typingDot 1.4s infinite", animationDelay: "0s" }} />
                    <Box sx={{ width: 6, height: 6, bgcolor: "#9e9e9e", borderRadius: "50%", animation: "typingDot 1.4s infinite", animationDelay: "0.2s" }} />
                    <Box sx={{ width: 6, height: 6, bgcolor: "#9e9e9e", borderRadius: "50%", animation: "typingDot 1.4s infinite", animationDelay: "0.4s" }} />
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input Box */}
              <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 1 }}>

                {/* Attachment menu */}
                {imagePreview && (
                  <Box sx={{ position: "relative", width: "fit-content", mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 2, bgcolor: "#f9f9f9", display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" onClick={clearImage} sx={{ position: "absolute", top: -10, right: -10, bgcolor: "black", color: "white", "&:hover": { bgcolor: "gray" }, width: 22, height: 22 }}>
                      <Close sx={{ fontSize: 14 }} />
                    </IconButton>
                    {selectedImage?.type?.startsWith("image/") ? (
                      <img src={imagePreview} alt="Preview" style={{ maxHeight: 80, borderRadius: 4 }} />
                    ) : selectedImage?.type?.startsWith("video/") ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                        <PlayCircle sx={{ color: "#1976d2", fontSize: 28 }} />
                        <Typography variant="caption" noWrap sx={{ maxWidth: 160 }}>{selectedImage.name}</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                        <InsertDriveFile sx={{ color: "#1976d2", fontSize: 28 }} />
                        <Typography variant="caption" noWrap sx={{ maxWidth: 160 }}>{selectedImage?.name}</Typography>
                      </Box>
                    )}
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                  {/* ── Always-mounted hidden inputs (must stay in DOM) ── */}
                  <input id="chat-image-input" type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => { handleImageSelect(e); setAttachMenuOpen(false); }} />
                  <input id="chat-video-input" type="file" accept="video/*" style={{ display: 'none' }} ref={videoInputRef} onChange={(e) => { handleImageSelect(e); setAttachMenuOpen(false); }} />
                  <input id="chat-doc-input" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" style={{ display: 'none' }} ref={docInputRef} onChange={(e) => { handleImageSelect(e); setAttachMenuOpen(false); }} />

                  {/* ── ATTACH BUTTON with popup ── */}
                  <Box sx={{ position: 'relative' }}>
                    <IconButton onClick={() => setAttachMenuOpen(o => !o)} sx={{ color: attachMenuOpen ? "#1976d2" : "#555" }}>
                      <AttachFile />
                    </IconButton>

                    {attachMenuOpen && (
                      <Box
                        sx={{
                          position: 'absolute', bottom: '110%', left: 0,
                          bgcolor: '#fff', borderRadius: 2,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          p: 0.5, minWidth: 145, zIndex: 9999,
                        }}
                      >
                        <label htmlFor="chat-image-input" style={{ cursor: 'pointer', display: 'block' }}>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}>
                            <Image sx={{ color: '#43a047', fontSize: 20 }} />
                            <Typography variant="body2">Photo</Typography>
                          </Box>
                        </label>

                        <label htmlFor="chat-video-input" style={{ cursor: 'pointer', display: 'block' }}>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}>
                            <Videocam sx={{ color: '#1976d2', fontSize: 20 }} />
                            <Typography variant="body2">Video</Typography>
                          </Box>
                        </label>

                        <label htmlFor="chat-doc-input" style={{ cursor: 'pointer', display: 'block' }}>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: 1, '&:hover': { bgcolor: '#f5f5f5' } }}>
                            <InsertDriveFile sx={{ color: '#e65100', fontSize: 20 }} />
                            <Typography variant="body2">Document</Typography>
                          </Box>
                        </label>
                      </Box>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    placeholder="Write a message..."
                    variant="outlined"
                    size="small"
                    value={message}
                    onChange={handleTyping}
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
      )}

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
                        // Forwarding via API service
                        const formData = new FormData();
                        formData.append("image", file);

                        const data = await api.post(`/messages/send/${friend.userId}`, formData);

                        if (data) {
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

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default UserChat;