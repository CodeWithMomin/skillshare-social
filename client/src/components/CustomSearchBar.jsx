import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper, CircularProgress, Typography, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const CustomSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let debounceTimer;
    if (query.trim().length >= 2) {
      setLoading(true);
      setShowDropdown(true);
      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/users?search=${query}`);
          const data = await res.json();
          if (data.success) {
            setResults(data.users);
          }
        } catch (error) {
          console.error("Failed to search users", error);
        } finally {
          setLoading(false);
        }
      }, 400); // 400ms debounce
    } else {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      setShowDropdown(true);
    }
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleSelectUser = (userId) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/profile/${userId}`);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", width: "100%", zIndex: 1300 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            border: 2.4,
            borderRadius: "50px",
            padding: "2px 8px", // smaller vertical padding
            width: "500px",
            "@media (max-width: 768px)": {
              width: "100%",
              borderRadius: "15px",
              maxWidth: "130px",
              height: "36px",
              padding: "0 6px",
              border: 2,
              borderColor: "#ee9917",
              mr: 1,
              ml: 0,
            },
            my: 2, // margin-top and margin-bottom
            height: "40px",
            borderColor: "#ee9917",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search..."
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "0.9rem",
                "@media (max-width: 768px)": {
                  fontSize: "0.8rem",
                },
                padding: "2px 3px",
                color: "black",
              },
            }}
            sx={{
              flex: 1,
              height: "100%", // match Box height
            }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <IconButton onClick={handleSearch} sx={{
            p: "6px", "@media (max-width: 768px)": {
              p: "4px",
            },
          }}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              maxHeight: 300,
              overflowY: "auto",
              borderRadius: 2,
              bgcolor: "#fff",
              "@media (max-width: 768px)": {
                width: "250vw", // expand width on mobile since search bar is small
                maxWidth: 280,
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress size={24} sx={{ color: "#ee9917" }} />
              </Box>
            ) : results.length > 0 ? (
              <List sx={{ p: 0 }}>
                {results.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => handleSelectUser(user._id)}
                    sx={{ "&:hover": { bgcolor: "#f3f2ef" }, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePic || user.photo} sx={{ width: 36, height: 36 }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>{user.fullName}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary" noWrap>{user.headline || user.email}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : query.trim().length >= 2 ? (
              <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">No users found for "{query}"</Typography>
              </Box>
            ) : null}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default CustomSearchBar;
