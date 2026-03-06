import React from "react";
import "../App.css";
import { Box } from "@mui/material";
import PeopleYouMayKnow from "./PeopleYouMayKnow";
const RightSideBar = () => {
  return (
    <>
      {/* <div className="recommend">Recommendations</div> */}
      <Box sx={{ flex: 1, minWidth: 280 }}>
      <PeopleYouMayKnow />
    </Box>
    </>
  );
};

export default RightSideBar;
