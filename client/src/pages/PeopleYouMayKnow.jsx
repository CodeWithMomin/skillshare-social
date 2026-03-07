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
    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
      {/* Header */}
      <CardContent sx={{ pb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            People you may know
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, people.length)} of {people.length}
          </Typography>
        </Box>
      </CardContent>

      {/* People List */}
      {visiblePeople.map((person, index) => (
        <Box key={person.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              px: 2,
              py: 1.5,
              position: "relative",
              "&:hover": { bgcolor: "#f9f9f9" },
            }}
          >
            {/* Dismiss */}
            <IconButton
              size="small"
              onClick={() => handleDismiss(person.id)}
              sx={{ position: "absolute", top: 6, right: 6 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Avatar */}
            <Avatar
              src={person.avatar}
              sx={{ width: 48, height: 48, border: "2px solid #e0e0e0" }}
            />

            {/* Info */}
            <Box sx={{ flex: 1, pr: 3 }}>
              <Typography variant="body2" fontWeight="bold" noWrap>
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
                }}
              >
                {person.title}
              </Typography>
              <Typography variant="caption" color="text.disabled" display="block">
                👥 {person.mutualConnections} mutual connections
              </Typography>

              <Button
                size="small"
                variant={connected[person.id] ? "contained" : "outlined"}
                startIcon={!connected[person.id] && <PersonAddAltIcon fontSize="small" />}
                onClick={() => handleConnect(person.id)}
                disabled={connected[person.id]}
                sx={{
                  mt: 0.5,
                  borderRadius: "20px",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  px: 2,
                  borderColor: "#0a66c2",
                  color: connected[person.id] ? "white" : "#0a66c2",
                  "&:hover": { borderColor: "#0a66c2", bgcolor: "#e8f0fe" },
                }}
              >
                {connected[person.id] ? "✓ Pending" : "Connect"}
              </Button>
            </Box>
          </Box>

          {index < visiblePeople.length - 1 && <Divider sx={{ mx: 2 }} />}
        </Box>
      ))}

      {/* Empty State */}
      {people.length === 0 && (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No suggestions at the moment
          </Typography>
        </Box>
      )}

      {/* Pagination Footer */}
      {people.length > 0 && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              py: 1,
            }}
          >
            {/* Prev */}
            <IconButton
              size="small"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <ArrowBackIosNewIcon fontSize="small" />
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
                      height: 32,
                      borderRadius: "50%",
                      fontWeight: currentPage === page ? "bold" : "normal",
                      bgcolor: currentPage === page ? "#0a66c2" : "transparent",
                      color: currentPage === page ? "white" : "text.secondary",
                      "&:hover": {
                        bgcolor: currentPage === page ? "#0a66c2" : "#f0f0f0",
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
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )}
    </Card>
  );
};

export default PeopleYouMayKnow;