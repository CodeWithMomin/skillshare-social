import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Box } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import PeopleIcon from "@mui/icons-material/People";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HubIcon from "@mui/icons-material/Hub";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const isMoreOpen = Boolean(moreAnchorEl);
  const isProfileOpen = Boolean(profileAnchorEl);

  const handleMoreClick = (event) => setMoreAnchorEl(event.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleMoreClose();
    handleProfileClose();
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, onClick }) => {
    const active = isActive(path);
    const content = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: active ? "#ee9917" : "#555",
          transition: "all 0.2s ease",
          "&:hover": { color: "#ee9917" }
        }}
      >
        <Icon sx={{ fontSize: 28 }} />
      </Box>
    );

    if (onClick) {
      return (
        <IconButton onClick={onClick} disableRipple sx={{ p: 1 }}>
          {content}
        </IconButton>
      );
    }

    return (
      <Link to={path} style={{ textDecoration: "none" }}>
        <IconButton disableRipple sx={{ p: 1 }}>
          {content}
        </IconButton>
      </Link>
    );
  };

  return (
    <Box
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center px-1 py-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      sx={{ height: "64px" }}
    >
      <NavItem path="/feed" icon={HomeIcon} />
      <NavItem path="/explore" icon={ExploreIcon} />
      <NavItem path="/alumniconnect" icon={PeopleIcon} />
      
      {/* More Options Dropdown */}
      <IconButton 
        onClick={handleMoreClick} 
        disableRipple 
        sx={{ 
          color: isMoreOpen ? "#ee9917" : "#555", 
          p: 1 
        }}
      >
        <MoreHorizIcon sx={{ fontSize: 28 }} />
      </IconButton>
      <Menu
        anchorEl={moreAnchorEl}
        open={isMoreOpen}
        onClose={handleMoreClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          sx: { mb: 1.5, minWidth: 180, borderRadius: "12px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }
        }}
      >
        <MenuItem onClick={() => handleNavigate("/projects")} sx={{ py: 1.5, fontWeight: isActive("/projects") ? "bold" : "normal" }}>
          <FolderIcon sx={{ mr: 2, color: "#ee9917" }} /> Projects
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/mynetwork")} sx={{ py: 1.5, fontWeight: isActive("/mynetwork") ? "bold" : "normal" }}>
          <HubIcon sx={{ mr: 2, color: "#ee9917" }} /> Network
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/friend-requests")} sx={{ py: 1.5, fontWeight: isActive("/friend-requests") ? "bold" : "normal" }}>
          <PersonAddIcon sx={{ mr: 2, color: "#ee9917" }} /> Requests
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/aifeatures")} sx={{ py: 1.5, fontWeight: isActive("/aifeatures") ? "bold" : "normal" }}>
          <SmartToyIcon sx={{ mr: 2, color: "#ee9917" }} /> AI Features
        </MenuItem>
      </Menu>

      {/* Profile Dropdown */}
      <IconButton 
        onClick={handleProfileClick} 
        disableRipple 
        sx={{ p: 1 }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: isProfileOpen ? "#d98a15" : "#ee9917",
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            border: isProfileOpen ? "2px solid #fff" : "none",
            boxShadow: isProfileOpen ? "0 0 0 2px #ee9917" : "none",
            transition: "all 0.2s ease"
          }}
        >
          M
        </Box>
      </IconButton>
      <Menu
        anchorEl={profileAnchorEl}
        open={isProfileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        PaperProps={{
          sx: { mb: 1.5, minWidth: 150, borderRadius: "12px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }
        }}
      >
        <MenuItem onClick={() => handleNavigate("/profile")} sx={{ py: 1.5 }}>
          <PersonIcon sx={{ mr: 2, color: "#ee9917" }} /> Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/settings")} sx={{ py: 1.5 }}>
          <SettingsIcon sx={{ mr: 2, color: "#555" }} /> Settings
        </MenuItem>
      </Menu>

    </Box>
  );
};

export default MobileBottomNav;
