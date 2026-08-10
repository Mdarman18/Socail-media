import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes/routes";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setonlineUser } from "./store/Message";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketIo = io("http://localhost:4400", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      socketIo.on("getUserOnline", (onlineUsers) => {
        dispatch(setonlineUser(onlineUsers));
      });
      return () => {
        socketIo.close();
      };
    } else {
      socketIo.close();
    }
  }, [user, dispatch]);
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

      <RouterProvider router={routes} />
    </>
  );
}

export default App;
