import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, useMediaQuery, useTheme, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import FeedIcon from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import { Explore, Hub, People, PersonAdd } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Feed", icon: <FeedIcon />, path: "/feed" },
  { label: "Explore", icon: <Explore />, path: "/explore" },
  { label: "Projects", icon: <FolderIcon />, path: "/projects" },
  { label: "Network", icon: <Hub />, path: "/mynetwork" },
  { label: "Alumni Connect", icon: <People />, path: "/alumniconnect" },
  { label: "Requests", icon: <PersonAdd />, path: "/friend-requests" },
  {
    label: "AI Features",
    icon: <SmartToyIcon />,
    path: "/aifeatures",
    subItems: [
      { label: "Document Summarizer", path: "/aifeatures" }
    ]
  },
];

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        justifyContent: isMobile ? "space-around" : "space-between",
        alignItems: "center",

        p: isMobile ? 0 : 2,
        ml: isMobile ? 0 : 1,

        bgcolor: "#fff",
        borderRadius: isMobile ? 0 : 2,

        position: isMobile ? "fixed" : "relative",
        bottom: isMobile ? 0 : "auto",
        left: 0,

        width: isMobile ? "100%" : 235,
        height: isMobile ? 64 : "calc(100vh - 85px)",

        boxShadow: isMobile
          ? "0px -2px 10px rgba(0,0,0,0.1)"
          : "0px 5px 10px rgba(0,0,0,0.1)",

        zIndex: 1200,
      }}
    >
      {/* -------- NAV ITEMS -------- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? 0 : 1.2,
          width: "100%",
          justifyContent: isMobile ? "space-around" : "flex-start",
        }}
      >
        {navItems.map((item, index) => {
          const active = location.pathname.startsWith(item.path) && item.path !== "/";
          // Also check exact match to cover root path corner cases if needed
          const isExactActive = location.pathname === item.path;

          return (
            <React.Fragment key={item.label + index}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    fontWeight: "500",
                    gap: isMobile ? 0 : 2,
                    px: isMobile ? 0.7 : 2,
                    py: isMobile ? 0.7 : 1.4,
                    borderRadius: "10px",
                    fontSize: isMobile ? "0.7rem" : "1rem",
                    color: active || isExactActive ? "#fff" : "#000",
                    backgroundColor: active || isExactActive ? "#ee9917" : "#fff",
                    transition: "all 0.2s ease",
                  }}
                >
                  {React.cloneElement(item.icon, {
                    fontSize: "medium",
                    sx: {
                      color: active || isExactActive ? "#fff" : "#ee9917",
                      transition: "all 0.2s ease",
                    },
                  })}

                  {!isMobile && <span>{item.label}</span>}
                </Box>
              </Link>

              {/* Render SubItems if they exist and this category is active */}
              {item.subItems && (active || isExactActive) && !isMobile && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 4, mt: 0.5, mb: 1 }}>
                  {item.subItems.map((sub, subIndex) => {
                    const subActive = location.pathname === sub.path;
                    return (
                      <Link key={subIndex} to={sub.path} style={{ textDecoration: "none" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.85rem",
                            py: 1,
                            px: 2,
                            borderRadius: "8px",
                            color: subActive ? "#ee9917" : "#666",
                            backgroundColor: subActive ? "#fff8ed" : "transparent",
                            fontWeight: subActive ? "600" : "500",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              color: "#ee9917",
                              backgroundColor: "#fff8ed"
                            }
                          }}
                        >
                          {sub.label}
                        </Box>
                      </Link>
                    )
                  })}
                </Box>
              )}
            </React.Fragment>
          );
        })}
        {isMobile && (
          <Link to="/profile" style={{ textDecoration: "none" }}>
            {/* Profile Button Instead of Setup Profile when in mobile */}
            <Box
              onClick={() => navigate("/profile")}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#ee9917",
                  transform: "scale(1.05)",
                }
              }}
            >
              <Avatar 
                src={user?.profilePic || user?.avatar} 
                sx={{ width: 34, height: 34, bgcolor: "#ee9917", fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </Avatar>
            </Box>
          </Link>
        )}

      </Box>

      {/* -------- PROFILE + SETTINGS (DESKTOP ONLY ICONS) -------- */}
      {!isMobile && (
        <>
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1.5,
              mt: "auto",
              mb: 0,
              px: { xs: 1, md: 3 },
              py: 1,
              mx: { xs: 1, md: 2 },
              borderRadius: 3,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              }
            }}
          >
            <Avatar 
                src={user?.profilePic || user?.avatar} 
                sx={{ width: 44, height: 44, bgcolor: "#ee9917", fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.fullName || user?.username || "My Profile"}
              </Typography>
            </Box>
            <ExpandMoreIcon sx={{ color: "text.secondary" }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            disableScrollLock={true}
            PaperProps={{
              elevation: 0,
              sx: {
                borderRadius: 3,
                minWidth: 180,
                mt: -1.5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }} sx={{ py: 1.5 }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText><Typography variant="body2" sx={{ fontWeight: 500 }}>My Profile</Typography></ListItemText>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/settings"); }} sx={{ py: 1.5 }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText><Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography></ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default SideBar;
