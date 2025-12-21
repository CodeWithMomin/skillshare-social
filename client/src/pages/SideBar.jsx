import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import FeedIcon from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { Explore, Hub, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const navItems = [
  { label: "Feed", icon: <FeedIcon />, path: "/feed" },
  { label: "Explore", icon: <Explore />, path: "/explore" },
  { label: "Projects", icon: <FolderIcon />, path: "/projects" },
  { label: "Network", icon: <Hub />, path: "/mynetwork" },
  { label: "Alumni Connect", icon: <People />, path: "/alumniconnect" },
  { label: "AI Features", icon: <SmartToyIcon />, path: "/aifeatures" },
];

const SideBar = () => {
  const location = useLocation();
    const navigate=useNavigate()
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        ml: 1,
        bgcolor: "#fff",
        borderRadius: 2,
        minHeight: "calc(100vh - 85px)",
        width: 230,
        boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* ---------------- NAVIGATION ---------------- */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                textDecoration: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 2,
                  py: 1.4,
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: active ? "#ee9917" : "#333",
                  backgroundColor: active ? "#f5f5f5" : "transparent",
                  transition: "0.2s ease",
                  "&:hover": {
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                {React.cloneElement(item.icon, {
                  fontSize: "medium",
                  sx: { color: "#ee9917" },
                })}
                <span>{item.label}</span>
              </Box>
            </Link>
          );
        })}
      </Box>

      {/* ---------------- PROFILE + SETTINGS ---------------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2.5,
          mt: 4,
        }}
      >
        {/* Profile Button */}
        <Link
          to="/profile"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            backgroundColor: "#ee9917",
            color: "#fff",
            borderRadius: "50%",
            fontWeight: "bold",
            fontSize: "1.2rem",
            textDecoration: "none",
          }}
        >
          M
        </Link>

        {/* Settings Icon */}
        <IconButton
          sx={{
            color: "#555",
            "&:hover": { color: "#ee9917" },
          }}
          onClick={()=>{
            navigate('/settings')
          }}
        >
          <SettingsIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SideBar;
