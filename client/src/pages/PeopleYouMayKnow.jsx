import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAuth } from "../context/AuthContext";
import { users } from "../lib/users";

const PAGE_SIZE = 4;

const PeopleYouMayKnow = () => {
  const [people, setPeople] = useState([]);
  const [connected, setConnected] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const { getUserProfile } = useAuth();

  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        const profileRes = await getUserProfile();
        let myFriends = [];
        let mySentRequests = [];
        let myFriendRequests = [];
        let myId = null;
        if (profileRes && profileRes._id) {
          myFriends = profileRes.friends || [];
          mySentRequests = profileRes.sentRequests || [];
          myFriendRequests = profileRes.friendRequests || [];
          myId = profileRes._id;
        }

        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();
        if (data.success && data.users) {
          // Filter out current user, accepted friends, and people who sent us a request
          const filteredUsers = data.users.filter(u => {
            if (u._id === myId) return false;
            if (myFriends.some(f => f.userId === u._id)) return false;
            // Also don't show people we need to accept/decline in the sidebar
            if (myFriendRequests.some(f => f.userId === u._id)) return false;
            return true;
          });

          const mapUserStatus = {};

          const mappedUsers = filteredUsers.map((u, i) => {
            if (mySentRequests.some(f => f.userId === u._id)) {
              mapUserStatus[u._id] = true;
            }

            return {
              id: u._id,
              name: u.fullName || "Unknown",
              title: u.headline || (u.basicInfo && u.basicInfo[0] && u.basicInfo[0].bio) || "Member",
              avatar: u.profilePic || `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
              mutualConnections: Math.floor(Math.random() * 20)
            };
          });

          setPeople(mappedUsers);
          setConnected(mapUserStatus);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    fetchRealUsers();

    const handleUpdate = () => {
      fetchRealUsers();
    };

    window.addEventListener('connectionsUpdated', handleUpdate);
    return () => window.removeEventListener('connectionsUpdated', handleUpdate);
  }, []);

  const totalPages = Math.ceil(people.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visiblePeople = people.slice(startIndex, startIndex + PAGE_SIZE);

  const handleDismiss = (id) => {
    const updated = people.filter((p) => p.id !== id);
    setPeople(updated);

    // If current page becomes empty after dismiss, go to previous page
    const newTotalPages = Math.ceil(updated.length / PAGE_SIZE);
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleConnect = async (targetId) => {
    setConnected((prev) => ({ ...prev, [targetId]: true }));
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/users/${targetId}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        window.dispatchEvent(new Event('connectionsUpdated'));
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      // Revert optimism if failed
      setConnected((prev) => ({ ...prev, [targetId]: false }));
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3, 
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <CardContent sx={{ pb: 1, pt: 2, px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight={600} color="#333">
            People you may know
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, people.length)} of {people.length}
          </Typography>
        </Box>
      </CardContent>

      <Divider sx={{ opacity: 0.6 }} />

      {/* People List */}
      <Box sx={{ py: 1 }}>
      {visiblePeople.map((person, index) => (
        <React.Fragment key={person.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              gap: 2,
              px: 2,
              py: 1.5,
              position: "relative",
              transition: "all 0.2s ease",
              "&:hover": { 
                bgcolor: "#f9f9f9",
                "& .dismiss-bt": { opacity: 1 } 
              },
            }}
          >
            {/* Dismiss */}
            <IconButton
              size="small"
              className="dismiss-bt"
              onClick={() => handleDismiss(person.id)}
              sx={{ 
                position: "absolute", 
                top: 6, 
                right: 6, 
                opacity: 0, 
                transition: "0.2s",
                bgcolor: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                "&:hover": { bgcolor: "#f3f2ef" }
              }}
            >
              <CloseIcon sx={{ fontSize: 16, color: "#666" }} />
            </IconButton>

            {/* Avatar */}
            <Avatar
              src={person.avatar}
              sx={{ 
                width: 50, 
                height: 50, 
                border: "1px solid #eee",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                mt: 0.5
              }}
            />

            {/* Info */}
            <Box sx={{ flex: 1, pr: 2, display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" fontWeight={600} color="#333" noWrap sx={{ fontSize: "0.9rem" }}>
                {person.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.3,
                  mt: 0.2,
                  mb: 0.5
                }}
              >
                {person.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "#777", display: "flex", alignItems: "center", gap: 0.5 }}>
                 👥 {person.mutualConnections} mutual connections
              </Typography>

              <Button
                size="small"
                variant={connected[person.id] ? "contained" : "outlined"}
                startIcon={!connected[person.id] && <PersonAddAltIcon sx={{ fontSize: "16px !important" }} />}
                onClick={() => handleConnect(person.id)}
                disabled={connected[person.id]}
                disableElevation
                sx={{
                  mt: 1,
                  alignSelf: "flex-start",
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 2,
                  py: 0.25,
                  ...(connected[person.id]
                    ? { bgcolor: "#e0e0e0", color: "#666" }
                    : { borderColor: "#0a66c2", color: "#0a66c2", "&:hover": { bgcolor: "#e8f0fe", borderColor: "#0a66c2" } }
                  ),
                }}
              >
                {connected[person.id] ? "Request Sent" : "Connect"}
              </Button>
            </Box>
          </Box>
          {index < visiblePeople.length - 1 && <Divider sx={{ opacity: 0.4, mx: 2 }} />}
        </React.Fragment>
      ))}
      </Box>

      {/* Empty State */}
      {people.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            No suggestions at the moment.
          </Typography>
        </Box>
      )}

      {/* Pagination Footer */}
      {people.length > 0 && (
        <>
          <Divider sx={{ opacity: 0.6 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              py: 2,
              bgcolor: "#fafbfc"
            }}
          >
            {/* Prev */}
            <IconButton
              size="small"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              sx={{ bgcolor: currentPage === 1 ? "transparent" : "#fff", boxShadow: currentPage === 1 ? "none" : "0 2px 6px rgba(0,0,0,0.05)" }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Page Numbers */}
            {(() => {
              let pages = [];
              if (totalPages <= 5) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                if (currentPage <= 3) {
                  pages = [1, 2, 3, 4, "...", totalPages];
                } else if (currentPage >= totalPages - 2) {
                  pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                } else {
                  pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
                }
              }

              return pages.map((page, idx) =>
                page === "..." ? (
                  <Typography key={`dots-${idx}`} variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
                    ...
                  </Typography>
                ) : (
                  <Button
                    key={page}
                    size="small"
                    onClick={() => setCurrentPage(page)}
                    sx={{
                      minWidth: 32,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      fontWeight: currentPage === page ? "bold" : "normal",
                      bgcolor: currentPage === page ? "#ee9917" : "transparent",
                      color: currentPage === page ? "white" : "text.secondary",
                      "&:hover": {
                        bgcolor: currentPage === page ? "#d9860b" : "#f0f0f0",
                      },
                    }}
                  >
                    {page}
                  </Button>
                )
              );
            })()}

            {/* Next */}
            <IconButton
              size="small"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              sx={{ bgcolor: currentPage === totalPages ? "transparent" : "#fff", boxShadow: currentPage === totalPages ? "none" : "0 2px 6px rgba(0,0,0,0.05)" }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </>
      )}
    </Card>
  );
};

export default PeopleYouMayKnow;