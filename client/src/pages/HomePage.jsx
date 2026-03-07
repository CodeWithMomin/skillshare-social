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
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col pt-[70px]">
      {/* Header - Fixed Top */}
      <header className="fixed top-0 left-0 right-0 h-[70px] bg-white border-b border-gray-200 z-50 shadow-sm px-4 sm:px-8 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden md:block w-72 lg:w-96">
            <CustomSearchBar />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="md:hidden">
            <CustomSearchBar />
          </div>
          <Notificationlogo />
          <ChatLauncher />
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-6 mt-6 px-4 md:px-8">

        {/* Left Sidebar */}
        <aside className="hidden md:block w-[240px] shrink-0">
          <div className="sticky top-[94px]">
            <SideBar />
          </div>
        </aside>

        {/* Center Feed Area */}
        <section className="flex-1 w-full max-w-full md:max-w-2xl mx-auto h-[calc(100vh-100px)] overflow-y-auto pb-10 custom-scrollbar rounded-xl">
          <Outlet />
        </section>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[300px] xl:w-[350px] shrink-0">
          <div className="sticky top-[94px]">
            <RightSideBar />
          </div>
        </aside>

      </main>
    </div>
  );
};

export default HomePage;
