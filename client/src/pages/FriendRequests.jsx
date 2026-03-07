import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FriendRequests = () => {
    const { getUserProfile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await getUserProfile();
            if (res && res.friendRequests) {
                setRequests(res.friendRequests);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load friend requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAccept = async (targetId) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:5000/api/users/${targetId}/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Friend request accepted!");
                setRequests(requests.filter(req => req.userId !== targetId));
                window.dispatchEvent(new Event('connectionsUpdated'));
            } else {
                toast.error(data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Failed to accept request:", error);
            toast.error("Failed to accept request.");
        }
    };

    const handleDecline = async (targetId) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:5000/api/users/${targetId}/decline`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Declined request.");
                setRequests(requests.filter(req => req.userId !== targetId));
                window.dispatchEvent(new Event('connectionsUpdated'));
            } else {
                toast.error(data.message || "Failed to decline");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Connection Requests
            </Typography>

            {requests.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                    <Typography variant="body1" color="text.secondary">
                        No new connection requests.
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {requests.map((req) => (
                        <Card
                            key={req._id || req.userId}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 2,
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar src={req.profilePic} alt={req.name} sx={{ width: 56, height: 56 }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {req.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {req.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAccept(req.userId)}
                                    startIcon={<Check />}
                                    sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDecline(req.userId)}
                                    sx={{ minWidth: "40px", p: 1, borderRadius: "8px" }}
                                >
                                    <Close />
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default FriendRequests;
