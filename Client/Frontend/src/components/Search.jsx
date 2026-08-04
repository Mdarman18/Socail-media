import React from "react";
import { FaBell, FaSearch, FaPlus } from "react-icons/fa";

const Search = () => {
  console.log("Search Render");

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
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
            <FaPlus className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">Create Post</span>
          </button>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-4 pl-1.5 sm:pl-3 border-l border-slate-200">
            
            {/* Notification Icon */}
            <button className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none">
              <FaBell className="text-lg sm:text-xl" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile Avatar */}
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-300 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Search;