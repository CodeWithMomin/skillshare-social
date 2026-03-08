import React, { useState, useRef, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, TextField, Button, CircularProgress,
    Fab, Box, Typography, Avatar
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = "http://localhost:5000/api";
const api = axios.create({
    baseURL: API,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const BirjuAiLauncher = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi! I'm Birju, your personal AI assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage = { role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // prepare history (exclude the first welcoming message or pass everything)
            const history = messages.map((m) => ({ role: m.role, content: m.content })).slice(-8);

            const res = await api.post("/ai/birju", {
                message: trimmed,
                history,
            });

            const botMessage = { role: "bot", content: res.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            toast.error(error.response?.data?.error || "Birju could not respond.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="chat with birju"
                onClick={handleOpen}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    bgcolor: "#ee9917",
                    "&:hover": { bgcolor: "#d68713" },
                    zIndex: 9999
                }}
            >
                <SupportAgentIcon fontSize="large" sx={{ color: "white" }} />
            </Fab>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        height: "600px",
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column"
                    }
                }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#111827", color: "white", px: 2, py: 1.5 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: "#ee9917", width: 32, height: 32 }}>B</Avatar>
                        <Typography variant="h6" fontWeight="bold">Birju AI Assistant</Typography>
                    </Box>
                    <IconButton onClick={handleClose} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ flex: 1, p: 2, bgcolor: "#f9fafb", display: "flex", flexDirection: "column" }} ref={scrollRef}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {messages.map((msg, i) => (
                            <Box
                                key={i}
                                display="flex"
                                justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
                            >
                                <Box
                                    sx={{
                                        maxWidth: "80%",
                                        p: 1.5,
                                        borderRadius: 2,
                                        borderBottomLeftRadius: msg.role === "bot" ? 0 : 8,
                                        borderBottomRightRadius: msg.role === "user" ? 0 : 8,
                                        bgcolor: msg.role === "user" ? "#111827" : "#fff",
                                        color: msg.role === "user" ? "#fff" : "#111827",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                        fontSize: "0.95rem",
                                        border: msg.role === "bot" ? "1px solid #e5e7eb" : "none"
                                    }}
                                >
                                    {msg.content}
                                </Box>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box display="flex" justifyContent="flex-start">
                                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#fff", display: "flex", alignItems: "center", border: "1px solid #e5e7eb" }}>
                                    <CircularProgress size={20} sx={{ color: "#9ca3af" }} />
                                    <Typography ml={1} variant="body2" color="textSecondary">Birju is typing...</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: "white" }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Ask Birju..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                bgcolor: "#f9fafb"
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!input.trim() || isLoading}
                        onClick={handleSend}
                        sx={{
                            bgcolor: "#111827",
                            color: "white",
                            borderRadius: 2,
                            minWidth: "50px",
                            height: "40px",
                            "&:hover": { bgcolor: "#1f2937" }
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BirjuAiLauncher;
