import React from "react";
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
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      {/* Header - Fixed Top */}
      <header className="fixed top-0 left-0 right-0 h-12 md:h-16 bg-white border-b border-gray-200 z-50 shadow-sm px-4 sm:px-8 flex items-center justify-between">
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

      {/* Spacer equal to header height */}
      <div className="h-16 md:h-20 shrink-0" />

      {/* Main Layout — starts right below header */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-4 px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6">

        {/* Left Sidebar */}
        <aside className="hidden md:block w-[235px] shrink-0">
          <div className="sticky top-[88px]">
            <SideBar />
          </div>
        </aside>

        {/* Center Feed */}
        <section className="flex-1 min-w-0 overflow-y-auto max-h-[calc(100vh-96px)] md:max-h-[calc(100vh-112px)] custom-scrollbar rounded-xl pb-6">
          <Outlet />
        </section>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[300px] xl:w-[350px] shrink-0">
          <div className="sticky top-[88px]">
            <RightSideBar />
          </div>
        </aside>

      </main>
    </div>
  );
};

export default HomePage;