import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Login from "../pages/AuthPage/Login";
import Signup from "../pages/AuthPage/Signup";
import AuthPage from "../pages/AuthPage/Auth";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <AuthPage />,
      },
    ],
  },
]);
