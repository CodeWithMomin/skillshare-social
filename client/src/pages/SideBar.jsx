import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import FeedIcon from "@mui/icons-material/Home";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { Explore, Hub, People } from "@mui/icons-material";

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
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        height: isMobile ? 64 : "auto",
        minHeight: isMobile ? "auto" : "calc(100vh - 85px)",

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
        {navItems.map(item => {
          const active = location.pathname === item.path;

          return (
            <Link key={item.label} to={item.path} style={{ textDecoration: "none" }}>
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
                  color: active ? "#fff" : "#000",
                  backgroundColor: active ? "#ee9917" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                {React.cloneElement(item.icon, {
                  fontSize: "medium",
                  sx: {
                    color: active ? "#fff" : "#ee9917",
                    backgroundColor: active ? "#ee9917" : "#fff",
                    transition: "all 0.2s ease",
                  },
                })}

                {!isMobile && <span>{item.label}</span>}
              </Box>
            </Link>
          );
        })}
        {isMobile && (
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#555",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  backgroundColor: "#ee9917",
                  color: "#fff",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.9rem",
                }}
              >
                M
              </Box>
            </Box>
          </Link>
        )}

      </Box>

      {/* -------- PROFILE + SETTINGS (MOBILE ONLY ICONS) -------- */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2.5,
            mt: 4,
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
            }}
          >
            M
          </Link>

          <IconButton
            sx={{ color: "#555", "&:hover": { color: "#ee9917" } }}
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default SideBar;
