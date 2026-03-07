import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import { Message } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyNetwork = () => {
  const { getUserProfile } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFriends = async () => {
    try {
      const res = await getUserProfile();
      if (res && res.friends) {
        setFriends(res.friends);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Failed to load your friends list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = (friendId) => {
    // Navigate to chat or open messenger
    navigate("/chat");
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
        My Connections ({friends.length})
      </Typography>

      {friends.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <Typography variant="body1" color="text.secondary">
            You don't have any connections yet. Go to the feed to connect with others!
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {friends.map((friend) => (
            <Card
              key={friend._id || friend.userId}
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
                <Avatar src={friend.profilePic} alt={friend.name} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {friend.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {friend.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleMessage(friend.userId)}
                  startIcon={<Message />}
                  sx={{ textTransform: "none", borderRadius: "8px", fontWeight: "bold" }}
                >
                  Message
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyNetwork;