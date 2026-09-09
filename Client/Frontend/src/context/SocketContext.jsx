import { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setonlineUser } from "../store/message.slice"; // Apne path ke hisab se import karein

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketInstance = null;

    if (user?._id) {
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:4400";

      socketInstance = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket"],
      });

      setSocket(socketInstance);

      // Online users listen karein aur Redux me update karein
      socketInstance.on("getUserOnline", (onlineUsers) => {
        dispatch(setonlineUser(onlineUsers));
      });

      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user?._id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
