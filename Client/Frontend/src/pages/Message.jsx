import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageUrl, profileUrl } from "../api/Axios";
import { useSocketContext } from "../context/SocketContext";
import { addMessage, setMessage } from "../store/Message";

const BasicOnlineCount = () => {
  const dispatch = useDispatch();

  const { socket } = useSocketContext();

  const onlineUsers = useSelector((state) => state.message?.onlineUser) || [];

  const allMessages = useSelector((state) => state.message?.message) || [];

  const user = useSelector((state) => state.auth?.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessageInput] = useState("");
  const [profiles, setProfiles] = useState([]);

  // =========================================
  // Current user ko online users se remove
  // =========================================
  const otherUsers = onlineUsers.filter(
    (id) => id?.toString() !== user?._id?.toString(),
  );
  console.log(onlineUsers);

  // =========================================
  // Online users ki profiles fetch
  // =========================================
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await Promise.all(
          otherUsers.map(async (id) => {
            const res = await profileUrl.get(`/get/${id}`);

            return res.data.user;
          }),
        );

        setProfiles(data);
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error?.response?.data || error.message,
        );
      }
    };

    if (otherUsers.length > 0) {
      fetchProfiles();
    } else {
      setProfiles([]);
    }
  }, [onlineUsers, user?._id]);

  // =========================================
  // Socket.IO - Receive New Message
  // =========================================
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);

  // =========================================
  // Get Chat History
  // =========================================
  useEffect(() => {
    if (!selectedUser?._id) return;

    const getMessages = async () => {
      try {
        const res = await messageUrl.get(`/getmessage/${selectedUser._id}`);

        console.log("Messages:", res.data);

        dispatch(setMessage(res.data?.messages || []));
      } catch (error) {
        console.error(
          "Get messages error:",
          error?.response?.data || error.message,
        );

        dispatch(setMessage([]));
      }
    };

    getMessages();
  }, [selectedUser?._id, dispatch]);

  // =========================================
  // Send Message
  // =========================================
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser?._id) {
      return;
    }

    try {
      const res = await messageUrl.post(`/addmessage/${selectedUser._id}`, {
        text: message.trim(),
      });

      console.log("Sent message:", res.data);

      // Backend:
      // {
      //   success: true,
      //   newMessage: {...}
      // }

      dispatch(addMessage(res.data?.newMessage));

      setMessageInput("");
    } catch (error) {
      console.error(
        "Send message error:",
        error?.response?.data || error.message,
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden bg-slate-50">
      {/* =========================================
          LEFT SIDEBAR
      ========================================= */}

      <div className="w-80 border-r border-slate-200 bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 p-4">
          <h2 className="text-xl font-bold text-slate-800">Messages</h2>
        </div>

        {/* Users */}
        <div className="overflow-y-auto">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <div
                key={profile._id}
                onClick={() => setSelectedUser(profile)}
                className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 p-4 transition hover:bg-violet-50 ${
                  selectedUser?._id === profile._id ? "bg-violet-50" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-600 font-bold text-white">
                  {profile.img ? (
                    <img
                      src={profile.img}
                      alt={profile.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.username?.charAt(0)?.toUpperCase()
                  )}

                  {/* Online Dot */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>

                {/* User Info */}
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-800">
                    {profile.username}
                  </h3>

                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              No users online
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          CHAT AREA
      ========================================= */}

      <div className="flex flex-1 flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-600 font-bold text-white">
                {selectedUser.img ? (
                  <img
                    src={selectedUser.img}
                    alt={selectedUser.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  selectedUser.username?.charAt(0)?.toUpperCase()
                )}
              </div>

              <div>
                <h2 className="font-semibold text-slate-800">
                  {selectedUser.username}
                </h2>

                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            {/* =========================================
                MESSAGES
            ========================================= */}

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
              {allMessages.length > 0 ? (
                allMessages.map((msg) => {
                  const isMe =
                    msg.senderId?.toString() === user?._id?.toString();

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-xl px-4 py-2 ${
                          isMe
                            ? "bg-violet-600 text-white"
                            : "border bg-white text-slate-700 shadow-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-slate-400">No messages yet</p>
                </div>
              )}
            </div>

            {/* =========================================
                MESSAGE INPUT
            ========================================= */}

            <form
              onSubmit={handleSend}
              className="border-t border-slate-200 bg-white p-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-xl bg-violet-600 px-5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          /* =========================================
             NO CHAT SELECTED
          ========================================= */

          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-2xl">
                💬
              </div>

              <h2 className="text-xl font-semibold text-slate-700">
                Select a user
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Select an online user to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicOnlineCount;
