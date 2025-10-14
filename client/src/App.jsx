import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Feed from "./pages/Feed";
import Notifications from "./pages/Notifications";
import AiFeatures from "./pages/AiFeatures";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // Layout component
    children: [
      { path: "/", element: <Feed /> }, // default page
      { path: "feed", element: <Feed /> },
      { path: "notifications", element: <Notifications /> },
      { path: "aifeatures", element: <AiFeatures /> },
      { path: "projects", element: <Projects /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
