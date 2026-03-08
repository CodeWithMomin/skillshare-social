import React, { useState } from "react";
import "../App.css";
import Logo from "../components/Logo";
import CustomSearchBar from "../components/CustomSearchBar";
import ChatLauncher from "../components/ChatLauncher";
import SideBar from "./SideBar";
import { Outlet, useLocation } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import Notificationlogo from "../components/Notificationlogo";
import MobileBottomNav from "../components/MobileBottomNav";
import RequestLauncher from "../components/RequestLauncher";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HomePage = () => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide right sidebar on all AI features pages
  const isAiPage = location.pathname.startsWith('/aifeatures');

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  return (
    <div className="bg-[#f3f2ef] min-h-screen flex flex-col">
      {/* Header - Fixed Top */}
      <header className="fixed top-0 left-0 right-0 h-20 lg:h-16 bg-white border-b border-gray-200 z-50 shadow-sm px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="hidden md:block w-72 lg:w-96">
          <CustomSearchBar />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="md:hidden">
            <CustomSearchBar />
          </div>
          <div className="lg:hidden flex items-center">
            {!isAiPage && <RequestLauncher onClick={toggleRightSidebar} />}
          </div>
          <Notificationlogo />
          <ChatLauncher />
        </div>
      </header>

      {/* Spacer equal to header height */}
      <div className="h-20 lg:h-16 shrink-0" />

      {/* Main Layout — starts right below header */}
      <main className="flex-1  mx-auto w-full flex gap-4 px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-6">

        {/* Left Sidebar */}
        <aside className="hidden md:block w-[235px] shrink-0">
          <div className="sticky top-[72px]">
            <SideBar />
          </div>
        </aside>

        {/* Center Feed */}
        <section className="flex-1 min-w-0 rounded-xl pb-6">
          <Outlet />
        </section>

        {/* Right Sidebar — hidden on AI pages */}
        {!isAiPage && (
          <aside className="hidden lg:block w-[300px] xl:w-[350px] shrink-0 xl:mr-2">
            <div className="sticky top-[88px]">
              <RightSideBar />
            </div>
          </aside>
        )}

      </main>

      <MobileBottomNav />

      {/* Mobile Right Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={isRightSidebarOpen}
        onClose={toggleRightSidebar}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: "90vw",
            bgcolor: "#f3f2ef",
            p: 2,
          },
        }}
        className="lg:hidden"
      >
        {!isAiPage && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#27467a">
                Network
              </Typography>
              <IconButton onClick={toggleRightSidebar}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ overflowY: "auto", pb: 4, "::-webkit-scrollbar": { display: "none" } }}>
              <RightSideBar />
            </Box>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default HomePage;