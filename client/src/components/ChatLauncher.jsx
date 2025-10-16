import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css'
const ChatLauncher = () => {
  const navigate=useNavigate()
   const handleClick = () => {
    // Navigate to the chat page
    navigate("/chat"); // change "/chat" to your desired route
  };
  return (
   <>
   <div className="chatdiv" onClick={handleClick}>
    <img
        src="src\assets\chatting.png"
        alt=""
      />
   </div>

   </>
  );
};

export default ChatLauncher;
