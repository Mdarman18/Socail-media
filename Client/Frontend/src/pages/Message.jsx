import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageUrl, profileUrl } from "../api/Axios";
import { useSocketContext } from "../context/SocketContext";
import { addMessage, setMessage } from "../store/Message";
import { FaArrowLeft } from "react-icons/fa";
import { persistor } from "../store/store";

const BasicOnlineCount = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketContext();

  const onlineUsers = useSelector((state) => state.message?.onlineUser) || [];
  const allMessages = useSelector((state) => state.message?.message) || [];
  const user = useSelector((state) => state.auth?.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessageInput] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading States
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Auto scroll ref for messages container
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages.length]);

  const otherUsers = onlineUsers.filter(
    (id) => id?.toString() !== user?._id?.toString(),
  );

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

  useEffect(() => {
    if (!selectedUser?._id) return;

    const getMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await messageUrl.get(`/getmessage/${selectedUser._id}`);
        dispatch(setMessage(res.data?.messages || []));
      } catch (error) {
        console.error(
          "Get messages error:",
          error?.response?.data || error.message,
        );
        dispatch(setMessage([]));
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [selectedUser?._id, dispatch]);

  // Send Message with Loading Spinner
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser?._id || isSending) {
      return;
    }

    setIsSending(true);
    try {
      const res = await messageUrl.post(`/addmessage/${selectedUser._id}`, {
        text: message.trim(),
      });

      dispatch(addMessage(res.data?.newMessage));
      setMessageInput("");
    } catch (error) {
      console.error(
        "Send message error:",
        error?.response?.data || error.message,
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleGetUser = async () => {
    setLoadingUsers(true);
    try {
      const res = await profileUrl.get("/getSuggestion");
      setUsers(res.data.users || []);
    } catch (error) {
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      handleGetUser();
    }
  }, [user?._id]);

  // Helper function to format time (e.g., 10:30 AM)
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  allMessages.map((msg) => {
    // ...
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] w-full overflow-hidden bg-slate-50">
      {/* Left Sidebar / Online Users Bar */}
      <div
        className={`w-full md:w-80 h-full border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col shrink-0 ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-slate-200 p-3 md:p-4 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-0 divide-y divide-slate-100">
          {loadingUsers ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 animate-pulse"
              >
                <div className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : users.length > 0 ? (
            users.map((profile) => {
              const isOnline = onlineUsers.includes(profile._id);

              return (
                <div
                  key={profile._id}
                  onClick={() => setSelectedUser(profile)}
                  className={`flex cursor-pointer items-center gap-3 p-3 md:p-4 transition hover:bg-violet-50 ${
                    selectedUser?._id === profile._id
                      ? "bg-violet-50 border-violet-200"
                      : "bg-white"
                  }`}
                >
                  <div className="relative flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-600 font-bold text-white text-sm">
                    {profile.img ? (
                      <img
                        src={profile.img}
                        alt={profile.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      profile.username?.charAt(0)?.toUpperCase()
                    )}

                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="truncate font-semibold text-slate-800 text-sm md:text-base">
                      {profile.username}
                    </h3>
                    <p
                      className={`text-xs ${
                        isOnline ? "text-green-500" : "text-slate-400"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 md:p-6 text-center text-xs md:text-sm text-slate-400 w-full">
              No users available
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex-col h-full bg-slate-50 overflow-hidden ${
          selectedUser ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedUser ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white p-3 md:p-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition mr-1"
                >
                  <FaArrowLeft />
                </button>

                <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-600 font-bold text-white text-sm">
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
                  <h2 className="font-semibold text-slate-800 text-sm md:text-base">
                    {selectedUser.username}
                  </h2>
                  <p
                    className={`text-xs ${
                      onlineUsers.includes(selectedUser._id)
                        ? "text-green-500"
                        : "text-slate-400"
                    }`}
                  >
                    {onlineUsers.includes(selectedUser._id)
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Box */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {loadingMessages ? (
                <div className="space-y-4 animate-pulse">
                  <div className="flex justify-start">
                    <div className="h-10 w-48 bg-slate-200 rounded-xl" />
                  </div>
                  <div className="flex justify-end">
                    <div className="h-10 w-36 bg-violet-200 rounded-xl" />
                  </div>
                  <div className="flex justify-start">
                    <div className="h-12 w-60 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ) : allMessages.length > 0 ? (
                allMessages.map((msg) => {
                  const isMe =
                    msg.senderId?.toString() === user?._id?.toString();

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-xs rounded-xl px-3 py-1.5 ${
                          isMe
                            ? "bg-violet-600 text-white"
                            : "border bg-white text-slate-700 shadow-sm"
                        }`}
                      >
                        <p className="text-sm break-words leading-snug">
                          {msg.message}
                        </p>

                        {/* Message Timestamp */}
                        <span
                          className={`block text-right text-[10px] mt-0.5 ${
                            isMe ? "text-violet-200" : "text-slate-400"
                          }`}
                        >
                          {formatTime(msg.createdAt || msg.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-slate-400">No messages yet</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input with Spinner */}
            <form
              onSubmit={handleSend}
              className="border-t border-slate-200 bg-white p-3 shrink-0"
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
                  disabled={!message.trim() || isSending}
                  className="flex items-center justify-center rounded-xl bg-violet-600 px-5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 min-w-[80px]"
                >
                  {isSending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-violet-100 text-xl md:text-2xl">
                💬
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-700">
                Select a user
              </h2>
              <p className="mt-1 md:mt-2 text-xs md:text-sm text-slate-400">
                Choose an online user to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicOnlineCount;
