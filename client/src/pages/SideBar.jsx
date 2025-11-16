import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Avatar } from "@mui/material";
import FeedIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { Explore, Hub, NetworkWifi, People } from "@mui/icons-material";
import { useProfilePicture } from "../context/ProfilePictureContext";
import { useAuth } from "../context/AuthContext";
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
  const {profilePic}=useProfilePicture()
  const {user}=useAuth()
  
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
      width: 90,        // bigger circle
      height: 85,
      backgroundColor: "#ee9817de",
      color: "#fff",
      borderRadius: "50%",
      textDecoration: "none",
      transition: "all 0.2s ease",
      overflow: "hidden",
      boxShadow: "0px 2px 6px rgba(0,0,0,0.18)",
    }}
  >
    <Avatar
      src={user.profilePic || "/default-avatar.png"}
      alt="Profile"
      sx={{
        width: 86,        // bigger image
        height: 85,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid white",
      }}
    />
  </Link>
</Box>

      
    </Box>
  );
};

export default SideBar;
