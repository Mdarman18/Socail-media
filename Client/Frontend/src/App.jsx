import React from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Agar toast notifications use kar rahe hain
import { routes } from "./routes/routes";

const App = () => {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
