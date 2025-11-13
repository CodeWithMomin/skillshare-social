import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Avatar } from "@mui/material";
import FeedIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { Explore, Hub, NetworkWifi, People } from "@mui/icons-material";

const navItems = [
  { label: "Feed", icon: <FeedIcon />, path: "/feed" },
  { label: "Explore", icon: <Explore />, path: "/explore" },
  { label: "Projects", icon: <FolderIcon />, path: "/projects" },
  { label: "Network", icon: <Hub />, path: "/mynetwork" },
  // { label: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { label: "Alumni Connect", icon: <People />, path: "/alumniconnect" },
  { label: "AI Features", icon: <SmartToyIcon />, path: "/aifeatures" },

  // { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const SideBar = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ml: 1,

        justifyContent: "space-between",
        p: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        minHeight: "calc(100vh - 85px)",
        width: 220,
        boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Navigation Links */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {navItems.map(item => (
          <Link
            key={item.label}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              textDecoration: "none",
              padding: "10px 15px",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "1rem",
              color: location.pathname === item.path ? "#ee9917" : "black",
              backgroundColor:
                location.pathname === item.path ? "#ebedeeff" : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            {React.cloneElement(item.icon, {
              fontSize: "small",
              sx: { color: "#ee9917" },
            })}
            <span>{item.label}</span>
          </Link>
        ))}
      </Box>

      {/* Profile Button */}
      <Box
        sx={{
          mt: 2,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
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
            transition: "all 0.2s ease",
          }}
        >
          M
        </Link>
      </Box>
    </Box>
  );
};

export default SideBar;
