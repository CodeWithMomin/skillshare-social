import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { useAlumniAuth } from "../../AlumniConnect/alumniContext/AlumniAuthContext"
import { useAlumniAuth } from "../AlumniConnect/alumniContext/AlumniAuthContext";
const AlumniSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAlumniAuth();

  const [activeSection, setActiveSection] = useState("password");

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  // ---------------- HANDLERS ----------------

  const handlePasswordChange = () => {
    if (password.new !== password.confirm) {
      alert("New password and confirm password do not match");
      return;
    }
    console.log("Password changed:", password);
  };

  const handleLogout = () => {
    logout();
    navigate("/alumni-auth");
  };

  // ---------------- RENDER SECTIONS ----------------

  const renderChangePassword = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Change Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="Current Password"
          sx={{ mb: 2 }}
          value={password.current}
          onChange={(e) =>
            setPassword({ ...password, current: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="New Password"
          sx={{ mb: 2 }}
          value={password.new}
          onChange={(e) =>
            setPassword({ ...password, new: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Confirm New Password"
          sx={{ mb: 2 }}
          value={password.confirm}
          onChange={(e) =>
            setPassword({ ...password, confirm: e.target.value })
          }
        />

        <Button variant="contained" onClick={handlePasswordChange}>
          Update Password
        </Button>
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Notification Settings
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notifications.email}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  email: e.target.checked,
                })
              }
            />
          }
          label="Email Notifications"
        />

        <FormControlLabel
          control={
            <Switch
              checked={notifications.push}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  push: e.target.checked,
                })
              }
            />
          }
          label="Push Notifications"
        />

        <Divider sx={{ my: 2 }} />

        <Button variant="contained">Save Preferences</Button>
      </CardContent>
    </Card>
  );

  // ---------------- UI ----------------

  return (
    <Box display="flex" p={3} gap={4}>
      {/* ---------------- SIDEBAR ---------------- */}
      <Box width="250px">
        <Typography variant="h6" fontWeight={700} mb={2}>
          Settings
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={activeSection === "password"}
              onClick={() => setActiveSection("password")}
            >
              <ListItemText primary="Change Password" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeSection === "notifications"}
              onClick={() => setActiveSection("notifications")}
            >
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          color="error"
          variant="outlined"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* ---------------- RIGHT CONTENT ---------------- */}
      <Box flexGrow={1}>
        {activeSection === "password" && renderChangePassword()}
        {activeSection === "notifications" && renderNotifications()}
      </Box>
    </Box>
  );
};

export default AlumniSettings;
