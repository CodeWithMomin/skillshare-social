import React from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // remove auth token (if any)
    navigate("/login"); // redirect to login page
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#fff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Page Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Settings
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Logout Section */}
        <Typography sx={{ fontSize: "1rem", fontWeight: 500, mb: 1 }}>
          Account
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 2,
            bgcolor: "#ee9917",
            "&:hover": { bgcolor: "#d88312" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
