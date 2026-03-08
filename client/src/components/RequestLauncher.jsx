import React from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const RequestLauncher = ({ onClick }) => {
  return (
    <PersonAddIcon
      sx={{
        fontSize: 28,
        color: "#ee9917",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          scale: 1.1,
          textShadow: "0 0 10px rgba(25, 118, 210, 0.7)",
          transform: "translateY(-2px)",
        },
      }}
      onClick={onClick}
    />
  );
};

export default RequestLauncher;
