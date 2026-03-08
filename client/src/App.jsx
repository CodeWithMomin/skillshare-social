import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import AiFeatures from "./pages/AiFeatures";
import AiChatbot from "./pages/AiChatbot";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login"; // public
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';
import UserChat from "./pages/UserChat";
import ResumeGenerator from "./pages/ResumeGenerator";
import CompleteProfile from "./pages/CompleteProfile";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import MyNetwork from "./pages/MyNetwork";
import FriendRequests from "./pages/FriendRequests";
import AlumniDirectory from "./pages/AlumniConnect/AlumniDirectory";

import AlmuniAuth from "./pages/AlumniConnect/AlmuniAuth";
import AlumniConnect from "./pages/AlumniConnect/AlumniConnect";
import AlumniProfile from "./pages/AlumniConnect/AlumniProfile";
// import AlumniProfile from "./pages/AlumniConnect/AlumniProfile";
import AboutUs from "./pages/AlumniConnect/AboutUs";
import AlumniProtectedRoutes from "./components/AlumniComponents/AlumniProtectedRoutes";
import Dashboard from "./pages/AlumniConnect/Dashboard";
import { useAuth } from "./context/AuthContext";
import { useAlumniAuth } from "./AlumniConnect/alumniContext/AlumniAuthContext";
import AlumniSettings from "./pages/AlumniSettings";
import BirjuAiLauncher from "./components/BirjuAiLauncher";

function App() {
  // const isAuthenticated = !!localStorage.getItem("authToken");
  const { isAuthenticated } = useAuth()

  const { isAlumniAuthenticated } = useAlumniAuth()

  //  console.log(isAlumniAuthenticated)

  const router = createBrowserRouter([
    // 🔓 Public route (login only)
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/alumni-auth",
      element: <AlmuniAuth />
    },
    // 🔒 Chat Interface (Independent Layout)
    {
      path: "/chat",
      element: (
        <ProtectedRoute
          element={<UserChat />}
          isAuthenticated={isAuthenticated}
        />
      ),
    },

    // 🔒 Entire HomePage (and its nested routes) protected
    {
      path: "/",
      element: (
        <ProtectedRoute
          element={<HomePage />}
          isAuthenticated={isAuthenticated}
        />
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/feed" replace />,
        },
        {
          path: "feed",
          element: <Feed />,
        },
        {
          path: "notifications",
          element: <Notifications />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "aifeatures",
          element: <AiFeatures />
        },
        {
          path: "aifeatures/chatbot",
          element: <AiChatbot />
        },
        {
          path: "aifeatures/resume",
          element: <ResumeGenerator />
        },
        {
          path: "projects",
          element: <Projects />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "profile/:id",
          element: <UserProfile />
        },
        // {
        //   path:"complete-profile",
        //   element:<CompleteProfile/>
        // },
        {
          path: "settings",
          element: <Settings />
        },
        {
          path: "explore",
          element: <Explore />
        },
        {
          path: "mynetwork",
          element: <MyNetwork />
        },
        {
          path: "friend-requests",
          element: <FriendRequests />
        },

      ],

    },
    {
      path: "/complete-profile",
      element: (
        <AlumniProtectedRoutes element={<CompleteProfile />}
          isAlumniAuthenticated={isAlumniAuthenticated} />
      )
    },
    {
      path: "/alumniconnect",
      element: (
        <AlumniProtectedRoutes
          element={<AlumniConnect />}
          isAlumniAuthenticated={isAlumniAuthenticated}
        />
      ),
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "profile",
          element: <AlumniProfile />,
        },
        {
          path: "aboutus",
          element: <AboutUs />,
        },

        {
          path: "alumni-directory",
          element: <AlumniDirectory />
        },
        {
          path: "alumnisettings",
          element: <AlumniSettings />
        },
      ],
    }

  ]);

  return <>
    <RouterProvider router={router} />
    <Toaster />
    {(isAuthenticated || isAlumniAuthenticated) && <BirjuAiLauncher />}
  </>;
}

export default App;
