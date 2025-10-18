import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    headline: "Frontend Developer",
    location: "New York, USA",
    skills: ["React", "JavaScript", "CSS"],
    profilePicture: null,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleCompleteProfile = () => navigate("/complete-profile");

  const handleProfilePictureClick = () => fileInputRef.current.click();

  const handleProfilePictureChange = e => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, profilePicture: imageURL }));
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ ...user, profilePicture: imageURL })
      );
    }
  };

  return (
    <div>
      <div className="profile-container">
        <div className="icon">
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={user.profilePicture}
              sx={{ width: 150, height: 150, border: 5, borderColor: "#fff" }}
            />
          </Box>
        </div>

        <div className="info">
          <div className="naming">
            John Doe <span className="position"> | Frontend Developer</span>
          </div>
          <div className="intro">
            Pasionate developer with a lot of experience in Frontend Development
            and Backend Development as well
          </div>
          <div className="skills">
            Skills : React &bull; JavaScript &bull; CSS
          </div>
        </div>
      </div>

      <div className="follow-container">
        <div className="follower">
          Followers <p>289</p>
        </div>
        <div className="follower following">
          Following <p>29</p>
        </div>
        <div className="follower projects">
          Projects <p>19</p>
        </div>
      </div>

      <div className="project-head">My Projects</div>
      <div className="project-container">
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
        <div className="project-showcase">
          Project 1 <p className="project-details">React Node</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
