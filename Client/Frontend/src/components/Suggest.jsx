import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { profileUrl } from "../api/Axios";

const Suggest = () => {
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true); // 1. naya loading flag

  const handleGetUser = async () => {
    setLoading(true); // request start hote hi true
    try {
      const res = await profileUrl.get("/getSuggestion");
      setUser(res.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // success ho ya fail, aakhir mein false
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const visibleUsers = showAll ? user : user.slice(0, 3);

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <FaUserCircle className="text-xl text-gray-500" />
        <h1 className="flex-1 text-md font-light text-gray-800">Suggested</h1>
        <button className="text-sm font-medium text-blue-500 hover:text-blue-600">
          View All
        </button>
      </div>

      {/* Users */}
      <div className="space-y-4">
        {loading ? (
          // 2. Skeleton rows - jitne "showAll ho to zyada" dikhne the utne fake rows
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-11 w-11 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-200" />
              </div>
              <div className="h-8 w-20 rounded-lg bg-gray-200 shrink-0" />
            </div>
          ))
        ) : visibleUsers.length > 0 ? (
          visibleUsers.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              {/* Profile Image */}
              <img
                src={u.img}
                alt={u.name}
                className="h-11 w-11 cursor-pointer rounded-full object-cover"
              />

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-800">
                  {u.name}
                </h2>
                <p className="text-xs text-gray-500">{u.username}</p>
              </div>

              {/* Follow Button */}
              <button className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
                <FaPlus className="text-xs" />
                <span>Follow</span>
              </button>
            </div>
          ))
        ) : (
          // 3. koi suggestion na mile to bhi kuch dikhe, blank na lage
          <p className="text-center text-xs text-gray-400 py-2">
            No suggestions right now
          </p>
        )}
      </div>

      {/* Down / Up Arrow */}
      {!loading && user.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mx-auto mt-5 flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          {showAll ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      )}
    </div>
  );
};

export default Suggest;
