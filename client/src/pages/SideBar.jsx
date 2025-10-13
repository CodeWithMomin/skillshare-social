import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      {/* Navigation links */}
      <div className="nav-links">
        <div className="div-1">
          <Link to="/feed">Feed</Link>
        </div>
        <div className="div-1">
          <Link to="/notifications">Notifications</Link>
        </div>
        <div className="div-1">
          <Link to="/aifeatures">AI Features</Link>
        </div>
        <div className="div-1">
          <Link to="/projects">Projects</Link>
        </div>
      </div>

      {/* Sticky Profile Button */}
      <div className="profile-button">
        <Link to="/profile">M</Link> {/* You can replace "M" with a profile image later */}
      </div>
    </div>
  );
};

export default SideBar;
