import React from "react";
// import './App.css'
import "../App.css";
import Logo from "../components/Logo";
import CustomSearchBar from "../components/CustomSearchBar";
import ChatLauncher from "../components/ChatLauncher";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import Notificationlogo from "../components/Notificationlogo";
const HomePage = () => {
  return (
    <>
      <div className="header">
        <Logo />
        <CustomSearchBar />
        <div className="noti-chat">

          <Notificationlogo />
          <ChatLauncher />
        </div>
      </div>
      <div className="container">
        <div className="left-sidebar">
          <SideBar />
        </div>
        <div className="feed">
          <Outlet />
        </div>
        <div className="right-sidebar">
          <RightSideBar />
        </div>
      </div>
    </>
  );
};

export default HomePage;
