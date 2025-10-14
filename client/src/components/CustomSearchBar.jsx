import React, { useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const CustomSearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Search query:", query);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#c4c7c8ff",
        borderRadius: "50px",
        padding: "2px 8px",  // smaller vertical padding
        width: "600px",
        my: 2,               // margin-top and margin-bottom
        height: "40px",      // total height of search bar
      }}
    >
      <TextField
        variant="standard"
        placeholder="Search..."
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: "0.9rem",    // smaller font
            padding: "4px 0", 
            color:"black"     // reduce padding inside TextField
          },
        }}
        sx={{
          flex: 1,
          height: "100%",           // match Box height
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton onClick={handleSearch} sx={{ p: "6px" }}>
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default CustomSearchBar;
