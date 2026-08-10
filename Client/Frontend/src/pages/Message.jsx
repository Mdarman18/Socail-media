import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { profileUrl } from "../api/Axios";

const Message = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // All online user IDs
  const onlineUsers = useSelector((state) => state.message.onlineUser);

  // Current logged-in user
  const user = useSelector((state) => state.auth.user);

  // Store complete profiles of online users
  const [onlineProfiles, setOnlineProfiles] = useState([]);

  // Remove current user from online users
  const otherOnlineUsers = onlineUsers?.filter(
    (ele) => ele.toString() !== user?._id?.toString(),
  );

  // =========================================
  // Fetch all online users' profiles
  // =========================================

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!otherOnlineUsers?.length) {
        setOnlineProfiles([]);
        return;
      }

      try {
        const profiles = await Promise.all(
          otherOnlineUsers.map(async (id) => {
            const res = await profileUrl.get(`/get/${id}`);

            return res.data.user;
          }),
        );

        console.log("ALL ONLINE PROFILES:", profiles);

        setOnlineProfiles(profiles);
      } catch (error) {
        console.log("Profile Fetch Error:", error);
      }
    };

    fetchProfiles();
  }, [onlineUsers, user?._id]);

  return (
    <div className="flex h-[calc(100vh-110px)] w-full overflow-hidden">
      {/* ================= LEFT SIDE ================= */}

      <div
        className={`
          w-full border-r
          sm:w-80
          ${selectedChat ? "hidden sm:block" : "block"}
        `}
      >
        {/* Header */}

        <div className="border-b p-4">
          <h1 className="text-xl font-bold text-slate-800">Messages</h1>

          {/* Search */}

          <input
            type="text"
            placeholder="Search conversations..."
            className="
              mt-4
              w-full
              rounded-lg
              border
              bg-slate-50
              px-3
              py-2
              text-sm
              outline-none
              focus:border-violet-500
            "
          />
        </div>

        {/* ================= ONLINE USERS ================= */}

        <div className="overflow-y-auto">
          {onlineProfiles.length > 0 ? (
            onlineProfiles.map((profile) => (
              <button
                key={profile._id}
                onClick={() => setSelectedChat(profile)}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  border-b
                  p-4
                  text-left
                  transition
                  hover:bg-violet-50
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-violet-600
                    font-semibold
                    text-white
                  "
                >
                  {profile.img ? (
                    <img
                      src={profile.img}
                      alt={profile.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.username?.charAt(0)?.toUpperCase()
                  )}
                </div>

                {/* User Details */}

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-800">
                    {profile.username}
                  </h2>

                  <p className="text-xs text-green-500">Online</p>
                </div>
              </button>
            ))
          ) : (
            <p className="p-4 text-sm text-slate-400">No users online</p>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div
        className={`
          flex
          flex-1
          flex-col
          ${selectedChat ? "flex" : "hidden sm:flex"}
        `}
      >
        {selectedChat ? (
          <>
            {/* ================= CHAT HEADER ================= */}

            <div className="flex items-center gap-3 border-b p-4">
              {/* Mobile Back */}

              <button
                onClick={() => setSelectedChat(null)}
                className="text-xl sm:hidden"
              >
                ←
              </button>

              {/* Avatar */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-violet-600
                  font-semibold
                  text-white
                "
              >
                {selectedChat.img ? (
                  <img
                    src={selectedChat.img}
                    alt={selectedChat.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  selectedChat.username?.charAt(0)?.toUpperCase()
                )}
              </div>

              {/* User Details */}

              <div>
                <h2 className="font-semibold text-slate-800">
                  {selectedChat.username}
                </h2>

                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            {/* ================= CHAT MESSAGES ================= */}

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {/* Received */}

              <div className="flex">
                <div className="max-w-[75%] rounded-xl bg-slate-100 px-4 py-2">
                  <p className="text-sm">Hey! How are you?</p>
                </div>
              </div>

              {/* Sent */}

              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-xl bg-violet-600 px-4 py-2 text-white">
                  <p className="text-sm">I'm good! What about you?</p>
                </div>
              </div>
            </div>

            {/* ================= MESSAGE INPUT ================= */}

            <div className="border-t p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="
                    flex-1
                    rounded-xl
                    border
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-violet-500
                  "
                />

                <button
                  className="
                    rounded-xl
                    bg-violet-600
                    px-5
                    font-semibold
                    text-white
                    hover:bg-violet-700
                  "
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ================= NO CHAT SELECTED ================= */

          <div className="flex flex-1 items-center justify-center p-5 text-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-700">
                Select a conversation
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Choose someone from the list to start messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
