import React, { useEffect } from "react";
import { RouterProvider, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // Agar toast notifications use kar rahe hain
import { routes } from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/CreateSlice";
import axios from "axios";
import { verifyMe } from "./api/Axios";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyMe.get("/me", {
          withCredentials: true,
        });
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout());
        }
      }
    };

    checkAuth();
  }, [dispatch]);
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
