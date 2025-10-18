import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import AiFeatures from "./pages/AiFeatures";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // public
import ProtectedRoute from "./components/ProtectedRoute";

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
function App() {
  const isAuthenticated = !!localStorage.getItem("token");
  const isAlumniAuthenticated=!!localStorage.getItem("alumni-token");
  // console.log(isAlumniAuthenticated)
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
        {
          path:"complete-profile",
          element:<CompleteProfile/>
        },
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
  path: "/alumniconnect",
  element: (
    <AlumniProtectedRoutes
      element={<AlumniConnect />}
      isAlumniAuthenticated={isAlumniAuthenticated}
    />
  ),
  children: [
   
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

  return <RouterProvider router={router} />;
}

export default App;
