import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Login from "../pages/AuthPage/Login";
import Signup from "../pages/AuthPage/Signup";
import AuthPage from "../pages/AuthPage/Auth";
import Profile from "../pages/Profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{
      path:"profile",
      element:<Profile/>
    }],
  },
  {
    path: "login",
    element: <AuthPage />,
  },
]);
