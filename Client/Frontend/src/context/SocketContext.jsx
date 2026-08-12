import { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setonlineUser } from "../store/Message"; // Apne path ke hisab se import karein

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
      socketInstance = io("https://socail-media-4.onrender.com", {
        query: {
          userId: user._id,
        },
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
