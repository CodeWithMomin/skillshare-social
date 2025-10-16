// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
  const navigate = useNavigate();

  // Load user data from localStorage (or API)
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    headline: "Frontend Developer",
    location: "New York, USA",
    skills: ["React", "JavaScript", "CSS"],
    profilePicture: null, // store image URL here
  });

  // Check if user uploaded a profile picture in localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleCompleteProfile = () => {
    navigate("/complete-profile");
  };

  return (
    <div className="profile-container">
      <div className="profile-picture">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" />
        ) : (
          <div className="placeholder">No Profile Picture</div>
        )}
      </div>
      <h2>{user.fullName}</h2>
      <p>Email: {user.email}</p>
      <p>Headline: {user.headline}</p>
      <p>Location: {user.location}</p>
      <p>
        Skills: {user.skills.length > 0 ? user.skills.join(", ") : "None"}
      </p>

      <button className="complete-profile-btn" onClick={handleCompleteProfile}>
        Complete Profile
      </button>
    </div>
  );
};

export default Profile;
