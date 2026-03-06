import React, { useState } from "react";
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
import { users } from "../lib/users";

const PAGE_SIZE = 4;

const PeopleYouMayKnow = () => {
  const [people, setPeople] = useState(users);
  const [connected, setConnected] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(people.length / PAGE_SIZE);
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

  const handleConnect = (id) => {
    setConnected((prev) => ({ ...prev, [id]: true }));
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
                {connected[person.id] ? "✓ Requested" : "Connect"}
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