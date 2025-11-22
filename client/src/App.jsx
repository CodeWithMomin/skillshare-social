import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import AiFeatures from "./pages/AiFeatures";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // public
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';
import UserChat from "./pages/UserChat";
import CompleteProfile from "./pages/CompleteProfile";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import MyNetwork from "./pages/MyNetwork";
import AlumniDirectory from "./pages/AlumniConnect/AlumniDirectory";

import AlmuniAuth from "./pages/AlumniConnect/AlmuniAuth";
import AlumniConnect from "./pages/AlumniConnect/AlumniConnect";
import AlumniProfile from "./pages/AlumniConnect/AlumniProfile";
// import AlumniProfile from "./pages/AlumniConnect/AlumniProfile";
import AboutUs from "./pages/AlumniConnect/AboutUs";
import AlumniProtectedRoutes from "./components/AlumniComponents/AlumniProtectedRoutes";
import Dashboard from "./pages/AlumniConnect/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  // const isAuthenticated = !!localStorage.getItem("authToken");
  const {isAuthenticated}=useAuth()

  const isAlumniAuthenticated=!!localStorage.getItem("alumni-token");
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
          path: "aifeatures",
          element: <AiFeatures />,
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
          path: "chat",
          element:<UserChat/>,
        },
        // {
        //   path:"complete-profile",
        //   element:<CompleteProfile/>
        // },
         {
          path:"settings",
          element:<Settings/>
        },
        {
          path:"explore",
          element:<Explore/>
        },
         {
          path:"mynetwork",
          element:<MyNetwork/>
        },
         
      ],
      
    },
    {
      path:"/complete-profile",
      element:(
        <AlumniProtectedRoutes element={<CompleteProfile/>}
        isAlumniAuthenticated={isAlumniAuthenticated}/>
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
    path:"dashboard",
    element:<Dashboard/>
   },
    {
      path: "profile",
      element: <AlumniProfile />,
    },
    {
      path: "aboutus",
      element: <AboutUs/>,
    },
    
    {
      path:"alumni-directory",
      element:<AlumniDirectory/>
    },
  ],
}
    
  ]);

  return <>
  <RouterProvider router={router} />
  <Toaster/>
  </>;
}

export default App;
