import React, { useState } from "react";
import { FaBell, FaSearch, FaPlus } from "react-icons/fa";
import { LuLogIn } from "react-icons/lu";
import CreatePost from "./CreatePost";
import { useDispatch } from "react-redux";
import { logout } from "../store/CreateSlice";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const [isOpen, setIsopen] = useState(false);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full sm:block hidden">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-4 w-full bg-white shadow-sm border-b border-slate-200">
        {/* Search Bar Container */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 sm:py-2 flex-1 max-w-xs sm:max-w-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <span className="text-slate-400 text-sm sm:text-base">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs sm:text-sm"
          />
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Create Post Button (Mobile: Plus Icon, Desktop: Text + Icon) */}
          <button
            onClick={() => setIsopen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <FaPlus className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">Create Post</span>
          </button>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-gray-200">
            {/* Notification */}
            <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-300">
              <FaBell className="text-lg text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Logout */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-300 font-medium text-sm sm:text-base">
              <span onClick={handleLogout} className="hidden sm:block">
                Logout
              </span>
              <LuLogIn className="text-lg" />
            </button>
          </div>
        </div>
      </nav>
      <CreatePost isOpen={isOpen} setIsopen={setIsopen} />
    </div>
  );
};

export default Search;
