import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import AiFeatures from "./pages/AiFeatures";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Login from "./pages/Login"; // public
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    // 🔓 Public route (login only)
    {
      path: "/login",
      element: <Login />,
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
