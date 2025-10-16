import React from 'react'
import NotificationsIcon from "@mui/icons-material/Notifications";
const Notificationlogo = () => {
  return (
   <NotificationsIcon
  sx={{
    fontSize: 28,
    color: "#1976d2",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      scale:1.1,
      textShadow: "0 0 10px rgba(25, 118, 210, 0.7)",
      transform: "translateY(-2px)",
    },
  }}
/>
  )
}

export default Notificationlogo